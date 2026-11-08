import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import "./services.scss"
import SEOHead from "../../components/SEOHead/SEOHead"
import { publicUrl } from "../../utils/publicUrl"
import { BOOKING_URL } from "../../utils/booking"
import ButtonLink from "../HomePage/ButtonLink"

type ServiceGroup = {
    id: string
    title: string
    items: string[]
    photo: { src: string, alt: string }
    photoSide: 'left' | 'right'
    tone: 'grey' | 'cream'
}

// The five service bands, in the order they appear in Figma.
// Photo width/height are the Figma sizes; they set the shape and the largest size.
const groups: ServiceGroup[] = [
    {
        id: 'haircuts',
        title: 'Haircuts',
        items: [
            '1st Time Custom Curly Haircut',
            'Custom Curl Cut',
            'Tight Curl Cut',
            'Custom Curl Cut (short or long)',
            'Express Curly Haircut',
            'Tight Curly Express',
            'Clipper Haircut',
            'Straight Haircut (short or long, non curly)',
            'Consultation',
            'Bang Trim',
            'Face Frame',
            'Neck Clean Up',
        ],
        photo: { src: 'services1.webp', alt: 'Smiling woman running a hand through her big curly hair' },
        photoSide: 'right',
        tone: 'grey',
    },
    {
        id: 'hair-color',
        title: 'Hair Color',
        items: [
            'Root Retouch',
            'Single Process Color',
            'Double Process',
            'Mini Partial Highlight/Pintura',
            'Partial Highlight/Balayage/Pintura',
            'Full Highlight/Balayage/Pintura',
            'Fashion Color',
        ],
        photo: { src: 'services2.webp', alt: 'Woman with sun-lit coloured curls sitting on a hillside at sunset' },
        photoSide: 'left',
        tone: 'cream',
    },
    {
        id: 'hair-styling',
        title: 'Hair Styling',
        items: [
            'Wash & Go',
            'Tight Curl Wash & Go',
            'Blowout',
            'Half Updo',
            'Updo',
            'Extensions',
            'Silk Press',
        ],
        photo: { src: 'services3.webp', alt: 'Laughing woman with defined auburn curls in a knit sweater'},
        photoSide: 'right',
        tone: 'grey',
    },
    {
        id: 'hair-care',
        title: 'Hair Care Add Ons',
        items: [
            'Deep Conditioning Add On',
            'Curl/Flat Iron Add On',
            'Detangling',
            'Extra Color',
            'Detox Treatment',
            'Extra Time',
            'Gloss/Toner Add On',
            'Olaplex Add On',
            'Spa Mist Add On',
            'Malibu Treatment',
            'K-18',
            'Silent Appointment',
            'Luxe Experience',
            'K-18 Deluxe Add On',
            'Scalp Treatment',
        ],
        photo: { src: 'services4.webp', alt: 'Smiling woman with voluminous curls, eyes closed' },
        photoSide: 'left',
        tone: 'cream',
    },
    {
        id: 'retexturizing',
        title: 'Retexturizing',
        items: [
            'Smoothing Keratin Treatment Cezanne',
            'Perm Consultation',
            'Perm',
        ],
        photo: { src: 'services5.webp', alt: 'Woman with long red curls lying among daisies' },
        photoSide: 'right',
        tone: 'grey',
    },
]

// The photo drifts a little slower than the page while it scrolls past.
// It's zoomed in enough that the drift never shows an edge.
const Photo = ({ src, alt }: ServiceGroup['photo']) => {
    const frameRef = useRef<HTMLDivElement>(null)
    const reduceMotion = useReducedMotion()
    const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] })
    const y = useTransform(scrollYProgress, [0, 1], ['-17%', '20%'])
    const scaleFr = useTransform(scrollYProgress, [0, 1], ['1', '1.1'])

    return (
        <div
            className="service-group__photo"
            ref={frameRef}
        >
            <motion.img
                src={publicUrl(`/images/services/${src}`)}
                alt={alt}
                loading="lazy"
                style={reduceMotion ? undefined : { y, scale: scaleFr }}
            />
        </div>
    )
}

const Services = () => {
    return(
        <div className="page" id="servicesPage">
            <SEOHead path="/services" />

            <header className="services-intro">
                <h1 className="services-title">What we offer</h1>
                <p className="services-subtitle">
                    <span>To see prices, click Book Now to select which Stylist you would like to see.</span>{' '}
                    Each of our Stylists have different prices based on client need, level of experience and education.
                </p>
            </header>

            <div className="services-list">
                {groups.map(group => (
                    <section
                        key={group.id}
                        className={`service-group service-group--${group.tone} service-group--photo-${group.photoSide}`}
                        aria-labelledby={`service-${group.id}`}
                    >
                        <div className="service-group__text">
                            <h2 className="service-group__title" id={`service-${group.id}`}>{group.title}</h2>
                            <ul className="service-group__items">
                                {group.items.map(item => <li key={item}>{item}</li>)}
                            </ul>
                            <ButtonLink to={BOOKING_URL}>Book now</ButtonLink>
                        </div>
                        <Photo {...group.photo} />
                    </section>
                ))}
            </div>

            <section className="services-pricing">
                <p className="services-pricing__text">Pricing is based on your stylist and service needs.</p>
                <ButtonLink to="/meet-the-team/">Find the stylist that’s right for you</ButtonLink>
            </section>
        </div>
    )
}

export default Services
