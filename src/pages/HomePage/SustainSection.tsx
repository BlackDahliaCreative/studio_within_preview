import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion"
import { publicUrl } from "../../utils/publicUrl"
import ButtonLink from "./ButtonLink"

const ease = [0.22, 1, 0.36, 1] as const

// 1. Reveal: plays once when the section scrolls into view
const block: Variants = {
    hidden: { x: '-100%' },
    show: { x: 0, transition: { duration: 0.9, ease } },
}
const photo: Variants = {
    hidden: { opacity: 0, scale: 1.08 },
    show: { opacity: 1, scale: 1, transition: { duration: 1.1, ease, delay: 0.25 } },
}
// The label is rotated in CSS; framer replaces the transform, so the rotation is kept here
const label: Variants = {
    hidden: { opacity: 0, y: 16, rotate: 180 },
    show: { opacity: 1, y: 0, rotate: 180, transition: { duration: 0.7, ease, delay: 0.5 } },
}
const content: Variants = {
    hidden: {},
    show: { transition: { delayChildren: 0.35, staggerChildren: 0.12 } },
}
const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

const SustainSection = ({ bookingUrl }: { bookingUrl: string }) => {
    const sectionRef = useRef<HTMLElement>(null)
    const reduceMotion = useReducedMotion()

    // 2. Parallax: the photo moves a little slower than the tan block while scrolling
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
    const photoY = useTransform(scrollYProgress, [0, 0.8], [100, -100])

    return (
        <motion.section
            className="home-sustain"
            ref={sectionRef}
            initial={reduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="home-sustain__media">
                <motion.span className="home-sustain__block" variants={block} aria-hidden="true" />
                <motion.p className="side-label side-label--sustain" variants={label} aria-hidden="true">Sustainability</motion.p>
                <motion.div className="home-sustain__photo" style={reduceMotion ? undefined : { y: photoY }}>
                    <motion.img variants={photo} src={publicUrl('/images/homepage/homepage8.webp')} alt="Recycling symbol made of leaves" loading="lazy"/>
                </motion.div>
            </div>
            <motion.div className="home-sustain__content" variants={content}>
                <motion.h2 className="home-sustain__title" variants={item}>Care that goes beyond the chair...</motion.h2>
                <motion.p variants={item}>At Studio Within, caring for your hair also means caring about the world around us. Through our partnership with Green Circle Salons, we’re able to divert and repurpose up to 85–95% of salon waste, including foils, color tubes, hair, plastics, and excess color. It’s one small way we’re working to leave things a little better than we found them.</motion.p>
                <motion.a className="home-sustain__more" variants={item} href="https://greencirclesalons.com" target="_blank" rel="noopener noreferrer">Read more →</motion.a>
                <motion.div variants={item}>
                    <ButtonLink to={bookingUrl}>Book now</ButtonLink>
                </motion.div>
            </motion.div>
        </motion.section>
    )
}

export default SustainSection
