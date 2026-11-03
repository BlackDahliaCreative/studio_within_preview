import "./policies.scss"
import SEOHead from "../../components/SEOHead/SEOHead"
import { publicUrl } from "../../utils/publicUrl"
import { BOOKING_URL } from "../../utils/booking"
import ButtonLink from "../HomePage/ButtonLink"
import GallerySection from "../HomePage/GallerySection"

// Salon photos in the cream band at the bottom, in the order they appear in Figma
const gallery = [
    { src: 'policies6.webp', alt: 'Row of black shampoo chairs under pendant lights' },
    { src: 'policies2.webp', alt: 'Styling stations with arched mirrors and leather chairs' },
    { src: 'policies9.webp', alt: 'Powder room with tropical wallpaper and a wooden console' },
    { src: 'policies4.webp', alt: 'Front desk surrounded by shelves of curl care products' },
    { src: 'policies7.webp', alt: 'Styling chairs beside a tall wooden mirror and plants' },
    { src: 'policies5.webp', alt: 'Black arched front door opening into the salon' },
]

// A beige card with a title that sits on its top edge
const PolicyCard = ({ id, title, className = '', children }: {
    id: string
    title: string
    className?: string
    children: React.ReactNode
}) => (
    <section className={`policy-card ${className}`} aria-labelledby={id}>
        <h2 className="policy-card__title" id={id}>{title}</h2>
        <div className="policy-card__body">{children}</div>
    </section>
)

const Photo = ({ src, alt, className }: { src: string, alt: string, className: string }) => (
    <div className={`policies-photo ${className}`}>
        <img src={publicUrl(`/images/policies/${src}`)} alt={alt} loading="lazy" />
    </div>
)

const Policies = () => {

    return(
        <div className="page" id="policiesPage">
            <SEOHead path="/policies" />

            <h1 className="policies-title"><span>A Few Things to Know...</span></h1>

            {/* Two columns on desktop. On small screens the columns dissolve and
                the items are re-ordered into reading order (see policies.scss). */}
            <div className="policies-layout">
                <div className="policies-col policies-col--left">
                    <PolicyCard id="policy-cancellations" title="Cancellations + No Shows" className="policy-card--cancel">
                        <p>We kindly ask for 48 hours’ notice to cancel or reschedule your appointment. Cancellations or changes made within that window will be charged 100% of the reserved service total using the card on file. We understand things come up, and we appreciate your understanding as this policy helps us respect our stylists’ time and other guests waiting for appointments.</p>
                        <div className="policy-card__action">
                            <ButtonLink to={BOOKING_URL}>Book now</ButtonLink>
                        </div>
                    </PolicyCard>

                    <Photo className="policies-photo--lounge policies-photo--band" src="policies3.webp" alt="Bright waiting lounge with a living plant wall and white sofa" />

                    <PolicyCard id="policy-guests" title="Guest Policy" className="policy-card--guests">
                        <p>We love that our guests feel at home at Studio Within, and we strive to maintain a peaceful, relaxing atmosphere for everyone.</p>
                        <p>To help us do so, we kindly ask that you attend your appointment alone. Our space is designed to comfortably accommodate only those receiving services.</p>
                    </PolicyCard>

                    <PolicyCard id="policy-refunds" title="Refunds" className="policy-card--refunds">
                        <p>All product sales are final.</p>
                        <p>All services are non refundable; however, your satisfaction is very important to us.</p>
                        <p className="policy-card__gap">If you experience any concerns with your service, please reach out to us — in person, by phone, or via email — within 7 days of your appointment.</p>
                        <p>We will gladly assess the situation and do our best to make any necessary adjustments to ensure you love your results.</p>
                    </PolicyCard>
                    <div className="policies-action policies-action--refunds">
                        <ButtonLink to={BOOKING_URL}>Book now</ButtonLink>
                    </div>

                    <Photo className="policies-photo--hallway policies-photo--band" src="policies10.webp" alt="Entry hallway with a chandelier, patterned tile floor and arched doorway" />
                </div>

                <div className="policies-col policies-col--right">
                    <Photo className="policies-photo--salon" src="policies8.webp" alt="Studio Within salon floor with styling chairs under an arched opening" />

                    <PolicyCard id="policy-children" title="Children" className="policy-card--children">
                        <p>To maintain a calm and safe environment for every guest, please note that Studio Within does not offer separate children’s pricing. Our curly cuts are priced by the service booked—short, medium, or long—regardless of age. Every curl appointment receives the same dedicated time, technique, and individualized care, and appointments for our younger guests often require just as much time and attention.</p>
                        <p>We kindly ask that children under the age of 13 be accompanied by an adult who is not receiving a service, unless prior arrangements have been approved by management.</p>
                        <p>For safety reasons, minor children may not remain on the salon floor or in the lobby while a parent or guardian is receiving a service.</p>
                        <p>If these arrangements cannot be made, the appointment will need to be rescheduled, and a 100% service fee will apply.</p>
                    </PolicyCard>
                    <div className="policies-action policies-action--children">
                        <ButtonLink to={BOOKING_URL}>Book now</ButtonLink>
                    </div>

                    <Photo className="policies-photo--station" src="policies1.webp" alt="Styling station with an arched black mirror and a wooden console" />

                    <PolicyCard id="policy-food" title="Food + Beverage" className="policy-card--food">
                        <p>We are pleased to offer complimentary beverages and light snacks to enhance your salon experience.</p>
                        <p className="policy-card__gap">Please enjoy them while relaxing in our space — a small gesture to make your visit more comfortable and enjoyable.</p>
                    </PolicyCard>

                    <div className="policies-next">
                        <p className="policies-next__text">Ready for your next visit?</p>
                        <ButtonLink to={BOOKING_URL}>Book now</ButtonLink>
                    </div>
                </div>
            </div>

            <GallerySection photos={gallery} folder="policies" label="Inside the salon" />
        </div>
    )
}

export default Policies
