import { useEffect, useRef } from "react"
import { useReducedMotion } from "framer-motion"
import { publicUrl } from "../../utils/publicUrl"

const BASE_SPEED = 40   // px per second, normal drift to the left
const FAST_SPEED = 700  // px per second while an arrow is held
const MIN_BURST = 450   // ms; a quick click still gives a short burst

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
const ReviewsMarquee = ({ reviews }: { reviews: string[] }) => {
    const trackRef = useRef<HTMLDivElement>(null)
    const hovered = useRef(false)
    const boost = useRef<{ dir: number, until: number, held: boolean } | null>(null)
    const reduceMotion = useReducedMotion()

    useEffect(() => {
        const track = trackRef.current
        if (!track) return
        let offset = 0
        let speed = 0
        let last = performance.now()
        let frame = 0

        const tick = (now: number) => {
            const dt = Math.min((now - last) / 1000, 0.1)
            last = now

            const b = boost.current
            if (b && !b.held && now >= b.until) boost.current = null
            const target = boost.current
                ? boost.current.dir * FAST_SPEED
                : (hovered.current || reduceMotion ? 0 : -BASE_SPEED)
            speed += (target - speed) * Math.min(1, dt * 8) // ease in and out

            // The list is drawn twice; wrap around after one copy for a seamless loop
            const half = track.scrollWidth / 2
            offset += speed * dt
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

    const press = (dir: number) => { boost.current = { dir, until: performance.now() + MIN_BURST, held: true } }
    const release = () => { if (boost.current) boost.current.held = false }

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
            <button type="button" className="home-reviews__arrow home-reviews__arrow--left" aria-label="Scroll reviews left" {...arrowProps(1)}>
                <Chevron />
            </button>
            <div
                className="home-reviews__viewport"
                onMouseEnter={() => { hovered.current = true }}
                onMouseLeave={() => { hovered.current = false }}
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
            <button type="button" className="home-reviews__arrow home-reviews__arrow--right" aria-label="Scroll reviews right" {...arrowProps(-1)}>
                <Chevron flip />
            </button>
        </div>
    )
}

export default ReviewsMarquee
