import { Link, useParams } from "react-router-dom"
import SEOHead from "../../components/SEOHead/SEOHead"
import { BOOKING_URL } from "../../utils/booking"
import { publicUrl } from "../../utils/publicUrl"
import ButtonLink from "../HomePage/ButtonLink"
import { stylist_info } from "./stylists_info"
import NotFound from "../NotFound"
import "./meet-the-team.scss" 
import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

const StylistPage = () => {
   const { stylistId } = useParams()
    const stylist = stylist_info.find((s) => s.stylist_id === stylistId)

    // Same drift as the Services / Get in Touch photos: the photo moves a little slower
    // than the page while it scrolls past, zoomed in enough that no edge ever shows.
    const photoFrameRef = useRef<HTMLDivElement>(null)
    const reduceMotion = useReducedMotion()
    const { scrollYProgress } = useScroll({ target: photoFrameRef, offset: ['start end', 'end start'] })
    const photoY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%'])
    const photoScale = useTransform(scrollYProgress, [0, 1], ['1', '1.3'])

    if (!stylist) return <NotFound />

    return (
        <main className="stylist_single_page">
            <SEOHead
                path={`/meet-the-team/${stylist.stylist_id}`}
                title={stylist.stylist_name}
                description={stylist.stylist_title}
            />

            <header>
                <div className="flex flex-column">

                    <h1 className="stylist_header">{stylist.stylist_name}</h1>
                    <p className="stylist_title">{stylist.stylist_title}</p>
                    
                    <a
                        className="stylist_instagram"
                        href={`https://www.instagram.com/${stylist.stylist_social_media}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${stylist.stylist_name} on Instagram`}
                    >
                        <img src={publicUrl('/images/meet_the_team/instagram-color.svg')} alt="" width="24" height="24" />
                        <span>@{stylist.stylist_social_media}</span>
                    </a>
                </div>

            </header>
            <section className="stylist_card_body mt-30">
                <div className="stylist_img" ref={photoFrameRef}>
                    <motion.img
                        src={publicUrl(`/images/meet_the_team/${stylist.stylist_info_body.body_stylist_pic}`)}
                        alt={stylist.stylist_name}
                        fetchPriority="high"
                        style={reduceMotion ? undefined : { y: photoY, scale: photoScale }}
                    />
                </div>
                <img className="stylist_body_logo mt-45" src={`${publicUrl('/logos/CurlyLogo.svg')}`}></img>
                <div className="stylist_body">
                    <div className="stylist_body_header">
                        <h2>WHAT’S MY SPECIALTY?</h2>
                        <p>{stylist.stylist_info_body.body_what_is_my_specialty}</p>
                    </div>
                    <div className="stylist_body_bio">
                        {stylist.stylist_info_body.body_stylist_bio.map((paragraph, i) => {
                            return <p className="stylist_bio_paragraph mt-10" key={i}>{paragraph}</p>
                        })}
                    </div>
                    {/* Sits across the bottom edge of the cream band (see .stylist_body_links) */}
                    <div className="stylist_body_links">
                        {   stylist.stylist_info_body.body_is_stylist === 'yes' ?
                            <a href={`https://booking.mangomint.com/959799?staffId=${stylist.stylist_info_body.mangomintID}`} className="home-btn--light">Book now with {stylist.stylist_name.split(' ')[0]}</a>
                            :
                            <></>
                        }
                        <Link className="backTo" to={'/meet-the-team'}>
                            <img src={publicUrl(`/images/arrow_left.svg`)} className="mr-10"></img>
                            Back to Stylists
                        </Link>
                    </div>
                </div>
            </section>
            <section className="stylist_education">
                {
                    stylist.stylist_education.length > 0 ?
                        <div>
                            <h1 className="mb-30">Education</h1>
                            {
                                stylist.stylist_education.map((steps, i) => {
                                    return <p key={i}><strong>{steps.title}</strong> {steps.detail}</p>
                                })
                            }
                        </div>
                    : <></>
                }
            </section>
        </main>
    )
}

export default StylistPage