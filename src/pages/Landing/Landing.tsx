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

    // Seamless loop: two copies of the video are stacked. As the visible one nears its end,
    // the other starts from the beginning on top and fades in, so the end blends into the start.
    useEffect(() => {
        const videos = videoRefs.current.filter((v): v is HTMLVideoElement => v !== null)
        if (videos.length !== 2) return
        
        videos.forEach((v) => { v.muted = true })

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

        tryPlay(videos[0])

        return () => {
            clearTimeout(timer)
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
            <div className="flex flex-column flex-alignItems-center">
                <img className="logo_partner" src={publicUrl('/logos/white_primary_logo.png')} alt="Studio Within Salon Logo" />
                <Link to={'/home-page'} className="linkBtn" style={{position: 'absolute', bottom: '40px', right: '40px'}}>ENTER HERE</Link>
            </div>
        </div>
    )
}

export default Landing
