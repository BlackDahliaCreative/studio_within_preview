import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import "./get-in-touch.scss"
import SEOHead from "../../components/SEOHead/SEOHead"
import { publicUrl } from "../../utils/publicUrl"
import { BOOKING_URL } from "../../utils/booking"
import { PHONE_HREF } from "../FAQs/faqData"
import ButtonLink from "../HomePage/ButtonLink"
import GallerySection from "../../components/GallerySection/GallerySection"

const EMAIL = 'swssdesk@gmail.com'
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Studio+Within+Salon+5720+N+Western+Ave+Chicago+IL+60659'

// Opening hours as shown in Figma
const hours = [
    { day: 'Monday', time: 'Closed' },
    { day: 'Tuesday', time: '10am-7pm' },
    { day: 'Wednesday', time: '11am-7pm' },
    { day: 'Thursday', time: '12pm-9pm' },
    { day: 'Friday', time: '10am-8pm' },
    { day: 'Saturday', time: '9am-6pm' },
    { day: 'Sunday', time: 'By appointment only' },
]

// Cream band at the bottom, in the order they appear in Figma
const gallery = [
    { src: 'get_in_touch4.webp', alt: 'Close-up of a woman’s face framed by brown curls' },
    { src: 'get_in_touch6.webp', alt: 'Smiling woman with a full black afro in a white sweater' },
    { src: 'test1.png', alt: 'Woman with long red curls leaning on a tree' },
    { src: 'get_in_touch5.webp', alt: 'Smiling woman resting her hand by her loose curls' },
    { src: 'get_in_touch7.webp', alt: 'Woman spraying a curl product into long auburn curls' },
    { src: 'get_in_touch9.webp', alt: 'Laughing woman with big copper curls and yellow sunglasses' },
]

// The photo drifts a little slower than the page while it scrolls past,
// zoomed in enough that the drift never shows an edge (same as Services).
const Photo = ({ src, alt, className }: { src: string, alt: string, className: string }) => {
    const frameRef = useRef<HTMLDivElement>(null)
    const reduceMotion = useReducedMotion()
    const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] })
    const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

    return (
        <div className={`git-photo ${className}`}>
            <div className="git-photo__frame" ref={frameRef}>
                <motion.img
                    src={publicUrl(`/images/get_in_touch/${src}`)}
                    alt={alt}
                    loading="lazy"
                    style={reduceMotion ? undefined : { y, scale: 1.25 }}
                />
            </div>
        </div>
    )
}

const GetInTouch = () => {
    return(
        <div className="page" id="getInTouchPage">
            <SEOHead path="/contact-us" />

            <header className="git-intro">
                <h1 className="git-title">Let’s get you in the Chair!</h1>
                <p className="git-subtitle">
                    <span>Have a question about appointments, services, or your hair? Reach out and we’ll be happy to help.</span>
                </p>
            </header>

            {/* Salon photo + contact details */}
            <section className="git-contact" aria-label="Contact details">
                <Photo className="git-photo--salon" src="get_in_touch1.webp" alt="Studio Within styling stations with wooden mirrors under a white arch" />
                <div className="git-contact__details">
                    <address>
                        <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                            5720 N Western Ave<br />Chicago, IL 60659
                        </a>
                        <br />
                        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                        <br />
                        <span className="git-contact__phone">
                            <a href={PHONE_HREF}>773-348-9323</a>
                            <span>call or text</span>
                        </span>
                    </address>
                    <ButtonLink to={BOOKING_URL}>Book now</ButtonLink>
                </div>
            </section>

            {/* Storefront on a grey band */}
            <div className="git-storefront">
                <Photo className="git-photo--storefront" src="get_in_touch2.webp" alt="Studio Within storefront with a colourful mural and planters on Western Avenue" />
            </div>

            {/* Opening hours + hallway photo */}
            <section className="git-hours mt-40" aria-labelledby="git-hours-title">
                <div className="git-hours__table">
                    <h2 className="git-hours__title" id="git-hours-title">Hours</h2>
                    <table>
                        <tbody>
                            {hours.map(h => (
                                <tr key={h.day}>
                                    <th scope="row">{h.day}</th>
                                    <td>{h.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Photo className="git-photo--hallway" src="get_in_touch3.webp" alt="Arched navy doorway at the end of the salon’s tiled entry hall" />
            </section>

            <div className="git-book">
                <ButtonLink to={BOOKING_URL}>Book now</ButtonLink>
            </div>

            <div id="stay_in_the_loop">
                <img src={publicUrl('/images/get_in_touch/stay-in-the-loop2.webp')} alt="" />
                <div id="stay_in_the_loop_form">
                    <h3>Stay in the Loop!</h3>
                    <p>
                        Join us for updates, inspiration, and
                        first dibs on what’s happening at 
                        Studio Within.
                    </p>
                    <form id="stay_in_the_loop_subscribe">
                        <input type="text" placeholder="First Name"/>
                        <input type="email" placeholder="Email address"/>
                        <button className="home-btn home-btn--dark">Subscribe</button>
                    </form>
                </div>
            </div>

            <GallerySection photos={gallery} folder="get_in_touch" label="Curly hair gallery" />
        </div>
    )
}

export default GetInTouch
