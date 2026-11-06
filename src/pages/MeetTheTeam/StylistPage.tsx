import { useParams } from "react-router-dom"
import SEOHead from "../../components/SEOHead/SEOHead"
import { BOOKING_URL } from "../../utils/booking"
import { publicUrl } from "../../utils/publicUrl"
import ButtonLink from "../HomePage/ButtonLink"
import { stylist_info } from "./stylists_info"
import NotFound from "../NotFound"
import "./meet-the-team.scss" 

const StylistPage = () => {
   const { stylistId } = useParams()
    const stylist = stylist_info.find((s) => s.stylist_id === stylistId)

    if (!stylist) return <NotFound />   // e.g. /meet-the-team/nobody

    return (
        <main className="stylist_single_page">
            <SEOHead
                path={`/meet-the-team/${stylist.stylist_id}`}
                title={stylist.stylist_name}
                description={stylist.stylist_title}
            />

            <header>
                <h1 className="stylist_header">{stylist.stylist_name}</h1>
                <p className="stylist_title">{stylist.stylist_title}</p>
                <a
                    className="stylist_instagram mt-20"
                    href={`https://www.instagram.com/${stylist.stylist_social_media}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${stylist.stylist_name} on Instagram`}
                >
                    <img src={publicUrl('/images/meet_the_team/instagram-color.svg')} alt="" width="24" height="24" />
                    <span>@{stylist.stylist_social_media}</span>
                </a>

            </header>
            <section className="stylist_card_body mt-30">
                <img className="stylist_img" src={publicUrl(`/images/meet_the_team/${stylist.stylist_info_body.body_stylist_pic}`)}></img>
                <img className="stylist_body_logo mt-10" src={`${publicUrl('/logos/CurlyLogo.svg')}`}></img>
                <div className="stylist_body">
                    <div className="stylist_body_header">
                        <h2>WHAT’S MY SPECIALTY?</h2>
                        <p>{stylist.stylist_info_body.body_what_is_my_specialty}</p>
                    </div>
                    <div className="stylist_body_bio">
                        {stylist.stylist_info_body.body_stylist_bio.map((paragraph, i) => {
                            return <p className="mt-10" key={i}>{paragraph}</p>
                        })}
                    </div>
                    <div className="stylist_body_links"></div>
                </div>
            </section>
        </main>
    )
}

export default StylistPage