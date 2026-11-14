import { useEffect, useRef } from "react"
import { fetchPriority } from "../../utils/fetchPriority"

// Hero photo that turns her head left and right in fake 3D.
//
// How it works: a WebGL shader gives the flat photo a rough depth shape (face and
// nose closest, the hair dome behind, the white background farthest away). Each
// frame it shifts close parts more than far ones and lights the face from the
// side she's turning toward, which reads as a real head turn.
// The depth shape is drawn from ellipses placed on THIS photo (homepage_HERO). If
// the photo changes, move the numbers in `depth()` to the new face.
//
// The plain <img> is always there underneath: it shows on the pre-rendered page,
// while WebGL starts, for reduced motion, and if WebGL isn't available.

const VERTEX = `
attribute vec2 p;
varying vec2 v;
void main() { v = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`

const FRAGMENT = `
precision mediump float;
uniform sampler2D img;
uniform vec2 cover;     // crops the photo like object-fit: cover
uniform vec2 turn;      // x = turn left/right, y = tilt up/down, both about -1..1
uniform float strength; // how far the closest parts move, in photo widths
varying vec2 v;

// Soft dome: 1 in the middle, 0 at the edge of the ellipse
float dome(vec2 p, vec2 c, vec2 r) {
    vec2 d = (p - c) / r;
    return smoothstep(0.0, 1.0, 1.0 - dot(d, d));
}

// Depth in photo coordinates (0,0 = top left). 0 = far background, about 1 = nose tip.
float depth(vec2 p) {
    float hair      = 0.45 * dome(p, vec2(0.50, 0.42), vec2(0.40, 0.42));
    float face      = 0.80 * dome(p, vec2(0.48, 0.47), vec2(0.17, 0.22));
    float neck      = 0.45 * dome(p, vec2(0.45, 0.74), vec2(0.11, 0.16));
    float shoulders = 0.38 * dome(p, vec2(0.45, 1.02), vec2(0.42, 0.30));
    vec2 n = p - vec2(0.465, 0.44);
    float nose = 0.14 * exp(-dot(n, n) / 0.0018);
    return max(max(hair, face), max(neck, shoulders)) + nose;
}

void main() {
    vec2 screen = vec2(v.x, 1.0 - v.y);
    vec2 uv = 0.5 + (screen - 0.5) * cover;

    // Shift by depth around the middle of the head (0.45 stays put).
    // A second pass with the shifted point keeps edges from smearing.
    vec2 offset = turn * strength * vec2(1.0, 0.6);
    vec2 p = uv - offset * (depth(uv) - 0.45);
    p = uv - offset * (depth(p) - 0.45);

    vec3 color = texture2D(img, clamp(p, 0.001, 0.999)).rgb;

    // Light from the side she turns toward: brighter on the near cheek,
    // a soft shadow on the far one. Only on her, not the white background.
    float e = 0.004;
    float dx = depth(p + vec2(e, 0.0)) - depth(p - vec2(e, 0.0));
    float dy = depth(p + vec2(0.0, e)) - depth(p - vec2(0.0, e));
    vec3 normal = normalize(vec3(-dx * 12.0, dy * 12.0, 1.0));
    vec3 light = normalize(vec3(turn.x * 0.7, 0.25 - turn.y * 0.3, 1.0));
    float shade = 0.9 + 0.16 * dot(normal, light);
    float onHer = smoothstep(0.05, 0.25, depth(p));
    color *= mix(1.0, shade, onHer);

    gl_FragColor = vec4(color, 1.0);
}`

const TURN_SECONDS = 14 // one full left → right → left
const TILT_SECONDS = 9  // a slower, separate nod, so the motion never repeats exactly
const STRENGTH = 0.0145

type Props = {
    src: string
    srcSet: string
    sizes: string
}

const HeroDepthPhoto = ({ src, srcSet, sizes }: Props) => {
    const imgRef = useRef<HTMLImageElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const img = imgRef.current
        const canvas = canvasRef.current
        if (!img || !canvas) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        const gl = canvas.getContext("webgl", { alpha: false, antialias: false, premultipliedAlpha: false })
        if (!gl) return

        let frame = 0
        let visible = true
        let cleanup = () => {}

        const start = () => {
            const program = makeProgram(gl)
            if (!program) return

            const buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
            const p = gl.getAttribLocation(program, "p")
            gl.enableVertexAttribArray(p)
            gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0)

            const texture = gl.createTexture()
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)

            const uCover = gl.getUniformLocation(program, "cover")
            const uTurn = gl.getUniformLocation(program, "turn")
            gl.uniform1f(gl.getUniformLocation(program, "strength"), STRENGTH)

            // Match the canvas to its on-screen size (sharp on retina, capped for speed)
            const resize = () => {
                const dpr = Math.min(window.devicePixelRatio || 1, 2)
                const w = Math.round(canvas.clientWidth * dpr)
                const h = Math.round(canvas.clientHeight * dpr)
                if (!w || !h) return
                canvas.width = w
                canvas.height = h
                gl.viewport(0, 0, w, h)
                const box = w / h
                const photo = img.naturalWidth / img.naturalHeight
                gl.uniform2f(uCover, box > photo ? 1 : box / photo, box > photo ? photo / box : 1)
            }
            resize()
            const resizeObserver = new ResizeObserver(resize)
            resizeObserver.observe(canvas)

            // Leaning toward the mouse on desktop, on top of the slow automatic turn
            const pointer = { x: 0, y: 0 }
            const lean = { x: 0, y: 0 }
            const onPointer = (e: PointerEvent) => {
                if (e.pointerType !== "mouse") return
                pointer.x = (e.clientX / window.innerWidth) * 2 - 1
                pointer.y = (e.clientY / window.innerHeight) * 2 - 1
            }
            window.addEventListener("pointermove", onPointer, { passive: true })

            // Only animate while the hero is on screen
            const observer = new IntersectionObserver(([entry]) => {
                visible = entry.isIntersecting
                if (visible && !frame) frame = requestAnimationFrame(draw)
            })
            observer.observe(canvas)

            const t0 = performance.now()
            let shown = false
            function draw(now: number) {
                frame = 0
                if (!visible) return
                const t = (now - t0) / 1000
                lean.x += (pointer.x - lean.x) * 0.04
                lean.y += (pointer.y - lean.y) * 0.04
                const turnX = Math.sin((t / TURN_SECONDS) * Math.PI * 2) * 0.8 + lean.x * 0.35
                const turnY = Math.sin((t / TILT_SECONDS) * Math.PI * 2 + 1) * 0.3 + lean.y * 0.25
                gl!.uniform2f(uTurn, turnX, turnY)
                gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
                if (!shown) {
                    shown = true
                    canvas!.classList.add("is-ready")
                }
                frame = requestAnimationFrame(draw)
            }
            frame = requestAnimationFrame(draw)

            cleanup = () => {
                resizeObserver.disconnect()
                observer.disconnect()
                window.removeEventListener("pointermove", onPointer)
            }
        }

        if (img.complete && img.naturalWidth) start()
        else img.addEventListener("load", start, { once: true })

        return () => {
            cancelAnimationFrame(frame)
            img.removeEventListener("load", start)
            cleanup()
        }
    }, [])

    return (
        <>
            <img ref={imgRef} src={src} srcSet={srcSet} sizes={sizes} alt="" {...fetchPriority("high")} />
            <canvas ref={canvasRef} aria-hidden="true" />
        </>
    )
}

function makeProgram(gl: WebGLRenderingContext) {
    const compile = (type: number, source: string) => {
        const shader = gl.createShader(type)!
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Hero shader error", gl.getShaderInfoLog(shader))
            return null
        }
        return shader
    }
    const vertex = compile(gl.VERTEX_SHADER, VERTEX)
    const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT)
    if (!vertex || !fragment) return null
    const program = gl.createProgram()!
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Hero shader error", gl.getProgramInfoLog(program))
        return null
    }
    gl.useProgram(program)
    return program
}

export default HeroDepthPhoto
