import ButtonLink from "../../pages/HomePage/ButtonLink"
import { GIFT_CARDS_URL } from "../../utils/booking"
import "./gift-card-section.scss"

// "Give the gift of great curls" band with a link to Mangomint's gift card shop.
// Used on Services and Products. The button opens a new tab on desktop and the
// same tab on phones/tablets (see ButtonLink).
const GiftCardSection = () => (
    <section className="gift-card-section" aria-labelledby="gift-card-title">
        <h2 className="gift-card-section__title" id="gift-card-title">Looking for the perfect gift?</h2>
        <p className="gift-card-section__text">Treat someone to a curl cut, color or styling session with a Studio Within gift card.</p>
        <ButtonLink to={GIFT_CARDS_URL} variant="light" target="_blank">Buy a gift card</ButtonLink>
    </section>
)

export default GiftCardSection
