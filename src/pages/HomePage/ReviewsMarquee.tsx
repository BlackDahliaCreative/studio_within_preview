import { useEffect, useRef } from "react"
import { useReducedMotion } from "framer-motion"
import { publicUrl } from "../../utils/publicUrl"

const BASE_SPEED = 40   // px per second, normal drift to the left
const FAST_SPEED = 700  // px per second while an arrow is held
const MIN_BURST = 450   // ms; a quick click still gives a short burst
const EDGE_GAP = 16     // px kept clear between a hovered card and the arrows/edge
const FLING_SLOWDOWN = 2.5 // how fast a finger fling slows back to the drift (higher = shorter glide)

const ReviewCard = ({ text }: { text: string }) => (
    <figure className="home-review">
        <img src={publicUrl('/images/homepage/icons/stars.svg')} alt="5 out of 5 stars" width="149" height="26"/>
        <blockquote>“{text}”</blockquote>
    </figure>
)

const Chevron = ({ flip }: { flip?: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
        <path d="M15 4 7 12l8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

// Row of reviews that drifts left on its own, pauses on hover,
// and scrolls fast in either direction while an arrow is held.
// On touch screens it can be dragged with a finger and flung; it glides,
// then settles back into the drift. (The arrows are hidden on phones in the SCSS.)
// The hovered card gets the `is-hovered` class (style it in home-page.scss). If that
// card is cut off at the edge or behind an arrow, the row slides it into full view.
const ReviewsMarquee = ({ reviews }: { reviews: string[] }) => {
    const trackRef = useRef<HTMLDivElement>(null)
    const viewportRef = useRef<HTMLDivElement>(null)
    const leftArrowRef = useRef<HTMLButtonElement>(null)
    const rightArrowRef = useRef<HTMLButtonElement>(null)
    const hovered = useRef(false)
    const hoveredCard = useRef<HTMLElement | null>(null)
    const sliding = useRef(false) // true while the row moves a card into view
    const boost = useRef<{ dir: number, until: number, held: boolean } | null>(null)
    // Finger dragging: moved px not yet applied, the finger's speed, and a fling to start
    const drag = useRef<{ id: number, x: number, t: number, velocity: number } | null>(null)
    const dragMoved = useRef(0)
    const fling = useRef<number | null>(null)
    const reduceMotion = useReducedMotion()

    useEffect(() => {
        const track = trackRef.current
        if (!track) return
        let offset = 0
        let speed = 0
        let coasting = false // gliding after a fling
        let last = performance.now()
        let frame = 0

        const tick = (now: number) => {
            const dt = Math.min((now - last) / 1000, 0.1)
            last = now

            if (drag.current) {
                // The finger moves the row directly
                offset += dragMoved.current
                speed = 0
            } else {
                if (fling.current !== null) {
                    speed = fling.current
                    fling.current = null
                    coasting = true
                }
                const b = boost.current
                if (b && !b.held && now >= b.until) boost.current = null
                const target = boost.current
                    ? boost.current.dir * FAST_SPEED
                    : (hovered.current || reduceMotion ? 0 : -BASE_SPEED)
                if (boost.current || Math.abs(target - speed) < 20) coasting = false
                const ease = coasting ? FLING_SLOWDOWN : 8 // a fling glides out slowly
                speed += (target - speed) * Math.min(1, dt * ease)
                offset += speed * dt

                // Ease the hovered card fully into view
                const shift = boost.current ? 0 : shiftIntoView()
                sliding.current = Math.abs(shift) > 0.5
                offset += shift * Math.min(1, dt * 6)
            }
            dragMoved.current = 0

            // The list is drawn twice; wrap around after one copy for a seamless loop
            const half = track.scrollWidth / 2
            if (half > 0) {
                if (offset <= -half) offset += half
                if (offset > 0) offset -= half
            }
            track.style.transform = `translateX(${offset}px)`
            frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [reduceMotion])

    // How far (px) the row must move so the hovered card sits fully inside the
    // space between the arrows. Measures the card as drawn, scale included.
    const shiftIntoView = () => {
        const card = hoveredCard.current
        const viewport = viewportRef.current
        if (!card || !viewport) return 0
        const box = viewport.getBoundingClientRect()
        // Arrows hidden (phones) measure as 0 wide: use the viewport edge instead
        const leftArrow = leftArrowRef.current?.getBoundingClientRect()
        const rightArrow = rightArrowRef.current?.getBoundingClientRect()
        const left = Math.max(box.left, leftArrow?.width ? leftArrow.right : box.left) + EDGE_GAP
        const right = Math.min(box.right, rightArrow?.width ? rightArrow.left : box.right) - EDGE_GAP
        const r = card.getBoundingClientRect()
        // Wider than the space (phones): center it instead
        if (r.width > right - left) return (left + right) / 2 - (r.left + r.right) / 2
        if (r.left < left) return left - r.left
        if (r.right > right) return right - r.right
        return 0
    }

    const setHoveredCard = (card: HTMLElement | null) => {
        if (card === hoveredCard.current) return
        hoveredCard.current?.classList.remove("is-hovered")
        card?.classList.add("is-hovered")
        hoveredCard.current = card
    }

    const press = (dir: number) => { boost.current = { dir, until: performance.now() + MIN_BURST, held: true } }
    const release = () => { if (boost.current) boost.current.held = false }

    // Finger (and pen) dragging. The mouse keeps hover + arrows.
    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === "mouse" || drag.current) return
        drag.current = { id: e.pointerId, x: e.clientX, t: e.timeStamp, velocity: 0 }
        boost.current = null
        hovered.current = false
        setHoveredCard(null)
    }
    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === "mouse") {
            // While the row slides a card into view, the cards move under a
            // still mouse: keep the same card until the slide is done
            if (!sliding.current) setHoveredCard((e.target as HTMLElement).closest<HTMLElement>(".home-review"))
            return
        }
        const d = drag.current
        if (!d || e.pointerId !== d.id) return
        const dx = e.clientX - d.x
        const dt = Math.max(e.timeStamp - d.t, 1)
        // Smoothed finger speed in px per second, for the fling
        d.velocity = d.velocity * 0.6 + (dx / dt) * 1000 * 0.4
        d.x = e.clientX
        d.t = e.timeStamp
        dragMoved.current += dx
    }
    const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
        const d = drag.current
        if (!d || e.pointerId !== d.id) return
        // A finger that stopped before lifting doesn't fling
        const still = e.timeStamp - d.t > 80
        fling.current = still ? 0 : Math.max(-3000, Math.min(3000, d.velocity))
        drag.current = null
    }

    const arrowProps = (dir: number) => ({
        onPointerDown: (e: React.PointerEvent) => { e.preventDefault(); press(dir) },
        onPointerUp: release,
        onPointerLeave: release,
        onPointerCancel: release,
        // Keyboard: Enter/Space fires click with detail 0, give a short burst
        onClick: (e: React.MouseEvent) => { if (e.detail === 0) { press(dir); release() } },
    })

    return (
        <div className="home-reviews__marquee">
            <button ref={leftArrowRef} type="button" className="home-reviews__arrow home-reviews__arrow--left" aria-label="Scroll reviews left" {...arrowProps(1)}>
                <Chevron />
            </button>
            <div
                ref={viewportRef}
                className="home-reviews__viewport"
                // Hover (pause + grow) only for a real mouse. Phones also send fake
                // mouse events after a tap, which would leave a card stuck grown
                // over its neighbours, so mouse events aren't used here.
                onPointerEnter={e => { if (e.pointerType === "mouse") hovered.current = true }}
                onPointerLeave={e => { if (e.pointerType === "mouse") { hovered.current = false; setHoveredCard(null) } }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerEnd}
                onPointerCancel={onPointerEnd}
            >
                {/* The list is drawn twice so the row can loop without a gap; the copy is hidden from screen readers */}
                <div className="home-reviews__track" ref={trackRef}>
                    <div className="home-reviews__list">
                        {reviews.map((text, i) => <ReviewCard key={i} text={text} />)}
                    </div>
                    <div className="home-reviews__list" aria-hidden="true">
                        {reviews.map((text, i) => <ReviewCard key={i} text={text} />)}
                    </div>
                </div>
            </div>
            <button ref={rightArrowRef} type="button" className="home-reviews__arrow home-reviews__arrow--right" aria-label="Scroll reviews right" {...arrowProps(-1)}>
                <Chevron flip />
            </button>
        </div>
    )
}

export default ReviewsMarquee
