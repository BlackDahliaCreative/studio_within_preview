import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import "./home-page.scss"
import SEOHead from "../../components/SEOHead/SEOHead"
import { publicUrl } from "../../utils/publicUrl"
import ReviewsMarquee from "./ReviewsMarquee"
import SustainSection from "./SustainSection"
import GallerySection from "./GallerySection"
import ButtonLink from "./ButtonLink"

// Where the "book now" style buttons go. Replace with the salon's booking link when we have it.
const BOOKING_URL = '/get-in-touch/'

// Reviews in the scrolling row, in the order they appear in Figma
const reviews = [
    "I've been looking for the perfect salon for curly hair. Look no more. They know EXACTLY what to do, plus it's a beautiful space and the staff are wonderful.",
    "Kristy listened to my concerns, gave me feedback and handled my curls with care. I left with the cut I wanted, product samples and a satisfying smile. I will definitely return because I've found MY place.",
    "Dani cut, colored, and styled my hair to perfection. I felt totally respected and listened to. The salon was welcoming and cozy, too! I would give Dani more stars if I could and more. I love my hair!!!",
    "Jacob at Studio Within is just SO wonderful, I can't say enough good things about him! He is knowledgable, patient, personable, and just generally delightful! He had answers to all of my questions and taught me SO MUCH during our time together! It was my first REAL curly haircut and my life will never be the same.",
    "When I walk into Studio Within it’s always a breath of fresh air. Customer service is welcoming & helpful. Kristy is phenomenal very personable, caring, knowledgeable, and highly skilled at what she does.",
    "Jacob is such an incredible stylist!! I love going to him. He completely understands how to bring my curls back to life and teaches me how to do it myself! The salon is so beautiful and lovely to be at. (Also the comfiest chairs of all time) I highly recommend!",
    "Overall it’s a wonderful salon with a great atmosphere—and the adorable, super well-behaved pugs that wander around sometimes are definitely a bonus!",
    "Jacob took his time to figure out what I was looking for with this haircut and offered suggestions/guidance on what would look best. I genuinely cannot remember the last time I loved a haircut as much as this one. Thank you, Jacob!!!!",
    "Kelley is a STAR! I’ve been seeing for a few years now and I adore our monthly appointments. The salon space is light, comfortable and has snacks! If you’re lucky you might see a pug or two!",
    "I loved visiting this salon for a curly haircut with Bette! The salon is very nicely decorated, with lots of plants, and all of the chairs, washing stations, etc are super comfortable. I definitely recommend a haircut here, and I definitely recommend booking with Bette.",
    "I’m not a Chicagoan, but Studio within Salon is a destination when I’m in town. A beautiful and relaxing environment is the backdrop to excellent hair care. It’s so hard to find stylists who truly know how to work with coily 4C hair. Kristy has kept my hair healthy, growing and styled. I look forward to my appointments!",
]


const gallery = [
    { src: 'homepage2.webp', alt: 'Long blonde curls covering a face' },
    { src: 'homepage4.webp', alt: 'Smiling man with a full curly afro' },
    { src: 'homepage7.webp', alt: 'Laughing woman with voluminous curly hair' },
    { src: 'homepage6.webp', alt: 'Smiling man with loose dark curls and a beard' },
    { src: 'homepage3.webp', alt: 'Close-up of a smiling woman with dark curls' },
    { src: 'homepage5.webp', alt: 'Woman in a denim shirt with big dark curls' },
]


const HomePage = () => {
    // Hero photo slowly zooms in and drifts down while the hero scrolls out of view
    const heroRef = useRef<HTMLElement>(null)
    const reduceMotion = useReducedMotion()
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '5%'])
    const wellcomeY = useTransform(scrollYProgress, [0, 1], [60, -60])

    return(
        <div className="page" id="homePage">
            <SEOHead path="/home-page" />

            <section id="landing_hero" ref={heroRef}>
                <motion.img
                    id="home_hero"
                    src={publicUrl('/images/homepage/homepage_HERO.webp')}
                    alt=""
                    fetchPriority="high"
                    style={reduceMotion ? undefined : { scale: heroScale, y: heroY }}
                />
                <div className="flex flex-column flex-alignItems-center" id="logo_home">
                    <img className="logo_partner" src={publicUrl('/logos/white_primary_logo.png')} alt="Studio Within Salon Logo" />
                    <p>Lincoln Square, Chicago</p>
                </div>
                <div className="hero_buttons">
                    <ButtonLink to={BOOKING_URL} variant="light">I am a new client</ButtonLink>
                    <ButtonLink to={BOOKING_URL} variant="light">I've been here before</ButtonLink>
                </div>
            </section>

            <section className="home-welcome">

                <motion.p className="side-label side-label--welcome" aria-hidden="true" style={reduceMotion ? undefined : { y: wellcomeY }}>← welcome home</motion.p>
                <h1 className="home-heading home-heading--italic"><span className="highlight">Chicago’s curly hair salon</span></h1>
                <p className="home-welcome__text">
                    At Studio Within, we know curls, and we know that no two heads are the same. We take the time to understand your texture, your routine, and how you actually want to wear your hair. From the health of your scalp to the shape of every curl, everything we do is intentional, personal, and designed to make your hair feel easier to live in and even better to love. Studio Within was created to feel a little different from the typical salon experience, with a relaxed but intentional approach that blends expert technique with genuine care so you feel comfortable, heard, and taken care of from the moment you walk in. Every visit is designed to feel personal and completely centered around you. Welcome home.
                </p>
                <ButtonLink to={BOOKING_URL}>Book now</ButtonLink>
            </section>

            <section className="home-about">
                <h2 className="home-about__band">A Chicago Salon for Over 20 Years, Now Dedicated to Curls</h2>
                <div className="home-about__image">
                    <img src={publicUrl('/images/homepage/homepage1.webp')} alt="Three people with different curly hair types, seen from behind" loading="lazy"/>
                    <h3 className="home-about__label">Who we are</h3>
                </div>
                <div className="home-about__card">
                    <p>Studio Within is a curly hair salon in Chicago specializing in customized curl cuts, curly hair color, styling, and healthy curl care. For more than 20 years, Studio Within has continued to evolve, beginning as a full service salon and spa with private studio spaces and growing into the curl focused salon it is today. Located in Chicago’s Arcadia Terrace neighborhood, just north of Lincoln Square on Western Avenue near Bryn Mawr, our modern, open concept salon is designed around highly specialized care for curly and textured hair.</p>
                    <p className="mt-15">Owner Kristy has spent more than two decades in the salon industry as a stylist, salon owner, mentor, and business builder. As Studio Within became increasingly focused on curly hair, Kristy and the Studio Within team continued investing in advanced curl education, curl specific training, and certifications in curly cutting techniques.</p>
                    <p className="mt-15">Our curl specialists understand that no two heads of curls are the same. Every customized curly haircut is designed around the guest’s curl pattern, texture, density, shrinkage, lifestyle, styling routine, and hair goals. Our training goes beyond simply adapting traditional haircutting techniques for curly hair. We consider how curls naturally move, fall, respond to moisture, and behave between salon visits.</p>
                    <p className="mt-15">The Studio Within experience goes beyond the haircut, too. Guests can enjoy coffee or tea, steam shampoos, personalized curl services, thoughtful styling spaces that offer a little more privacy, and snacks while color processes. From consultation to finished style, every detail is designed to make our guests feel comfortable, understood, and cared for. And if you’re lucky, you may even get a visit from one of our two resident pugs.</p>
                </div>
                <ButtonLink to="/meet-the-team/">Meet the stylists</ButtonLink>
            </section>

            <SustainSection bookingUrl={BOOKING_URL} />

            <section className="home-reviews">
                <h2 className="home-heading home-heading--italic"><span className="highlight">What people are saying...</span></h2>
                <ReviewsMarquee reviews={reviews} />
                <ButtonLink to={BOOKING_URL}>Book now</ButtonLink>
            </section>

            <GallerySection photos={gallery} />
        </div>
    )
}

export default HomePage
