import "./landing.scss"
import { useEffect, useRef, type CSSProperties } from "react"
import SEOHead from "../../components/SEOHead/SEOHead"
import posterImage from "./landing_video.jpg"
import { Link } from "react-router-dom"
import { publicUrl } from "../../utils/publicUrl"

const VIDEO_BASE = "https://res.cloudinary.com/drdrs6pdq/video/upload"
const VIDEO_FILE = "v1793070099/Audiovisivamente/landing_video_sm_opossl.mp4"
const videoDesktop = `${VIDEO_BASE}/q_auto,f_auto/${VIDEO_FILE}`
const videoMobile = `${VIDEO_BASE}/q_auto,f_auto,w_720/${VIDEO_FILE}`

const CROSSFADE_SECONDS = 1.5

const tryPlay = (video: HTMLVideoElement) => { video.play()?.catch(() => {}) }

const Landing = () => {
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
    const coverRef = useRef<HTMLImageElement | null>(null)

    // Seamless loop: two copies of the video are stacked. As the visible one nears its end,
    // the other starts from the beginning on top and fades in, so the end blends into the start.
    useEffect(() => {
        const videos = videoRefs.current.filter((v): v is HTMLVideoElement => v !== null)
        if (videos.length !== 2) return
        // "Reduce motion" set on the device: show the still poster instead of an endless loop
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
            videos.forEach((v) => { v.pause(); v.removeAttribute('autoplay') })
            return
        }

        videos.forEach((v) => { v.muted = true })

        // A still image covers the videos (and the play button iOS draws on a blocked video)
        // until a video is actually playing, then fades away.
        const cover = coverRef.current
        const hideCover = () => { cover?.classList.add("is-hidden") }
        const onPlaying = (e: Event) => {
            if (!(e.target as HTMLVideoElement).paused) hideCover()
        }
        videos.forEach((v) => v.addEventListener("playing", onPlaying))
        // On the live site the page arrives pre-rendered, so the browser may have started the
        // video (autoplay) before this code ran and its "playing" event was already missed.
        if (videos.some((v) => !v.paused)) hideCover()


        let front = 0
        let crossfading = false
        let timer: ReturnType<typeof setTimeout> | undefined

        const crossfade = () => {
            if (crossfading) return
            crossfading = true
            const outgoing = videos[front]
            front = 1 - front
            const incoming = videos[front]

            incoming.currentTime = 0
            tryPlay(incoming)
            incoming.classList.add("is-front")
            outgoing.classList.remove("is-front")
            
            timer = setTimeout(() => {
                outgoing.pause()
                outgoing.currentTime = 0
                crossfading = false
            }, CROSSFADE_SECONDS * 1000)
        }

        const handlers = videos.map((video, i) => {
            const onTime = () => {
                if (i === front && video.duration && video.duration - video.currentTime <= CROSSFADE_SECONDS) {
                    crossfade()
                }
            }
            // Fallback if the end was reached before the check above ran (e.g. a very short video)
            const onEnded = () => { if (i === front) crossfade() }
            video.addEventListener("timeupdate", onTime)
            video.addEventListener("ended", onEnded)
            return { video, onTime, onEnded }
        })
        
        const loadSecondCopy = () => {
            videos[1].preload = "auto"
            videos[1].load()
        }
        if (videos[0].readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) loadSecondCopy()
        else videos[0].addEventListener("canplaythrough", loadSecondCopy, { once: true })

        // iPhone Low Power Mode (and some browser settings) block autoplay, but browsers still allow
        // playback after the visitor taps or presses a key. If autoplay is refused, start the video
        // on the first interaction. The back copy is started and paused in the same tap so the
        // loop's crossfade is allowed to play it later.
        const GESTURE_EVENTS = ["touchend", "click", "keydown"] as const
        const removeGestureListeners = () => {
            GESTURE_EVENTS.forEach((e) => document.removeEventListener(e, onGesture))
        }
        const onGesture = () => {
            const backIndex = 1 - front
            const back = videos[backIndex]
            if (back.paused) {
                back.play()?.then(() => { if (backIndex !== front) back.pause() }).catch(() => {})
            }
            videos[front].play()?.then(() => { hideCover(); removeGestureListeners() }).catch(() => {})
        }

        // Try again when the visitor comes back to the tab or reopens the page from history
        const onReturn = () => {
            if (document.visibilityState === "visible" && videos[front].paused) tryPlay(videos[front])
        }
        document.addEventListener("visibilitychange", onReturn)
        window.addEventListener("pageshow", onReturn)

        // play() also succeeds for a video that is already playing, so this covers that case too
        videos[0].play()?.then(hideCover).catch(() => {
            // Keep the still cover up (it hides the play button) until a tap starts the video
            cover?.classList.remove("is-hidden")
            GESTURE_EVENTS.forEach((e) => document.addEventListener(e, onGesture, { passive: true }))
        })

        return () => {
            clearTimeout(timer)
            videos.forEach((v) => v.removeEventListener("playing", onPlaying))
            removeGestureListeners()
            document.removeEventListener("visibilitychange", onReturn)
            window.removeEventListener("pageshow", onReturn)
            videos[0].removeEventListener("canplaythrough", loadSecondCopy)
            handlers.forEach(({ video, onTime, onEnded }) => {
                video.removeEventListener("timeupdate", onTime)
                video.removeEventListener("ended", onEnded)
            })
        }
    }, [])

    return(
        <div
            className="page"
            id="landingHero"
            style={{ position: 'relative', '--crossfade': `${CROSSFADE_SECONDS}s` } as CSSProperties}
        >
            <SEOHead path="/" />

            {[0, 1].map((i) => (
                <video
                    key={i}
                    ref={(el) => { videoRefs.current[i] = el }}
                    className={i === 0 ? "landingHero__video is-front" : "landingHero__video"}
                    poster={i === 0 ? posterImage : undefined}
                    autoPlay={i === 0}
                    muted
                    playsInline
                    preload={i === 0 ? "auto" : "none"}
                    aria-hidden="true"
                >
                    <source src={videoMobile} type="video/mp4" media="(max-width: 767.98px)" />
                    <source src={videoDesktop} type="video/mp4" />
                </video>
            ))}
            <img ref={coverRef} className="landingHero__cover" src={posterImage} alt="" aria-hidden="true" />
            <div className="flex flex-column flex-alignItems-center" id="logo_btn_landing">
                {/* The logo is the page's main heading (search engines and screen readers need one) */}
                <h1 className="landingHero__title">
                    {/* Black logo on phones, white on bigger screens. The browser downloads only one. */}
                    <picture>
                        <source media="(max-width: 767.98px)" srcSet={publicUrl('/logos/black_primary_logo-400.webp')} width={400} height={330} />
                        <img className="logo_partner" src={publicUrl('/logos/white_primary_logo-840.webp')} width={840} height={694} alt="Studio Within Salon" />
                    </picture>
                </h1>
                <p className="landingHero__tagline">Chicago’s curly hair salon · Curl cuts, color &amp; care</p>
                <Link to={'/home-page'} className="linkBtn">ENTER HERE</Link>
            </div>
        </div>
    )
}

export default Landing
