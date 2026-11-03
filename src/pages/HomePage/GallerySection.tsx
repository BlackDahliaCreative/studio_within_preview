import { motion, useReducedMotion, type Variants } from "framer-motion"
import { publicUrl } from "../../utils/publicUrl"

type Photo = { src: string, alt: string }

const ease = [0.22, 1, 0.36, 1] as const

// Cascade: photos fade, rise and settle one after another when the gallery scrolls into view
const grid: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
}
const tile: Variants = {
    hidden: { opacity: 0.5, y: 100 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease } },
}
const photo: Variants = {
    hidden: { scale: 1.08 },
    show: { scale: 1, transition: { duration: 1.1, ease } },
}

type Props = {
    photos: Photo[]
    folder?: string // folder under public/images
    label?: string  // what screen readers announce for the section
}

const GallerySection = ({ photos, folder = 'homepage', label = 'Curly hair gallery' }: Props) => {
    const reduceMotion = useReducedMotion()

    return (
        <motion.section
            className="home-gallery"
            aria-label={label}
            variants={grid}
            initial={reduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
        >
            {photos.map(img => (
                // Frame: reveal. Inner layer: hover zoom (in the SCSS)
                <motion.div key={img.src} className="home-gallery__frame" variants={tile}>
                    <div className="home-gallery__zoom">
                        <motion.img variants={photo} src={publicUrl(`/images/${folder}/${img.src}`)} alt={img.alt} loading="lazy"/>
                    </div>
                </motion.div>
            ))}
        </motion.section>
    )
}

export default GallerySection
