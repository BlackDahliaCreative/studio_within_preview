import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
// Links
import { publicUrl } from "../../utils/publicUrl"
// Components
import SEOHead from "../../components/SEOHead/SEOHead"
import ButtonLink from "../HomePage/ButtonLink"
import GallerySection from "../../components/GallerySection/GallerySection"

import "./products.scss"
import { fetchPriority } from "../../utils/fetchPriority"

// Salon photos in the cream band at the bottom, in the order they appear in Figma
const gallery = [
    { src: 'products1.webp', alt: 'Row of black shampoo chairs under pendant lights' },
    { src: 'products2.webp', alt: 'Styling stations with arched mirrors and leather chairs' },
    { src: 'products3.webp', alt: 'Powder room with tropical wallpaper and a wooden console' },
    { src: 'products4.webp', alt: 'Front desk surrounded by shelves of curl care products' },
    { src: 'products5.webp', alt: 'Styling chairs beside a tall wooden mirror and plants' },
    { src: 'products6.webp', alt: 'Black arched front door opening into the salon' },
]
const shopifyFluff2 = 'https://kkcurls.myshopify.com/products/2-more-fluff'
const shopifyFluff3 = 'https://kkcurls.myshopify.com/products/3-the-most-fluff'
// The photo drifts a little slower than the page while it scrolls past.
// It's zoomed in slightly so the drift never shows an edge.
// priority: the photo near the top of the page, so it loads right away instead of lazily
const Photo = ({ src, alt, className, priority = false }: { src: string, alt: string, className: string, priority?: boolean }) => {
    const frameRef = useRef<HTMLDivElement>(null)
    const reduceMotion = useReducedMotion()
    const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] })
    const y = useTransform(scrollYProgress, [0, 1], ['20%', '-20%'])
    const scaleScr = useTransform(scrollYProgress, [0, 1], ['1', '1.1'])

    return (
        <div className={`products-photo ${className}`}>
            <div className="products-photo__frame" ref={frameRef}>
                <motion.img
                    src={publicUrl(`/images/product/${src}`)}
                    alt={alt}
                    loading={priority ? "eager" : "lazy"}
                    {...fetchPriority(priority ? "high" : "auto")}
                    style={reduceMotion ? undefined : { y, scale: scaleScr }}
                />
            </div>
        </div>
    )
}

const products = () => {

    return(
        <div className="page" id="productsPage">
            <SEOHead path="/products" />

            <header className="git-intro">
                <h1 className="git-title">Meet KK Curls!</h1>
                <p className="git-subtitle mb-20">
                    <span>A celebration of natural texture and individuality.  Created by master curl specialist Kristy, this collection is all about embracing what makes your curls uniquely yours.</span>
                </p>
            </header>

            <div className="products-layout">
                <div className="products-col products-col--left">
                    <Photo priority className="products-photo products-photo--band" src="product1.webp" alt="KK Curls #2 More Fluff bottle on a lit display stand" />
                    <div className="product-card">
                        <h2 className="product-card__title">#2 MORE FLUFF</h2>
                        <p className="product-card__body pb-25">A little fluff goes a long way.  Embrace soft, effortless volume and beautifully defined curls. More Fluff is all about enhancing your natural texture while keeping your curls full of life, movement, and personality.  Because great curls deserve a little extra.</p>
                        <ButtonLink to={shopifyFluff2} variant="dark" target="_blank">Order Now</ButtonLink>
                    </div>
                </div>

                <div className="products-col products-col--right">
                    <div className="product-card">
                        <h2 className="product-card__title">#3 THE MOST FLUFF</h2>
                        <p className="product-card__body">For curls that refuse to be ordinary.  Turn up the volume and celebrate every coil, curl, and twist. The Most Fluff is made for embracing your natural texture and creating a fuller, more expressive curl look.  More texture. More personality. The most fluff.</p>
                        <ButtonLink to={shopifyFluff3} variant="dark" target="_blank">Order Now</ButtonLink>
                    </div>
                    <Photo className="products-photo products-photo--band" src="product2.webp" alt="KK Curls #3 The Most Fluff bottle on a lit display stand" />
                
                </div>
            </div>

            <GallerySection photos={gallery} folder="product" label="Inside the salon" />
        </div>
    )
}

export default products
