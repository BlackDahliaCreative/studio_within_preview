import "./meet-the-team.scss" 
import SEOHead from "../../components/SEOHead/SEOHead"
import { stylist_info } from "./stylists_info"
import { publicUrl } from "../../utils/publicUrl"
import { Link } from "react-router-dom"
import ButtonLink from "../HomePage/ButtonLink"
import { BOOKING_URL } from "../../utils/booking"

const MeetTheTeam = () => {

    return(
        <div className="page" id="meetTheTeamPage">
            <SEOHead path="/meet-the-team" />
            <header className="git-intro">
                <h1 className="git-title">The people behind the Curls...</h1>
                <p className="git-subtitle">
                    <span>Meet the people who make Studio Within Salon more than a salon — a thoughtful curl care space in Chicago.</span>
                </p>
                <div className="git-book my-40">
                    <ButtonLink to={BOOKING_URL} variant="light">Book now</ButtonLink>
                </div>
            </header>

            <section id="stylist_cards_section">
                
                    {stylist_info.map((stylist_obj, i) => {
                        return  <Link className={`single_stylist_card stylist_card--${stylist_obj.stylist_id}`} key={stylist_obj.stylist_id} id={`stylist_${i}`} to={`/meet-the-team/${stylist_obj.stylist_id}`}>                        
                            
                            <div className="stylist_img_cont" id={`${stylist_obj.stylist_id}`}>
                                <img className="stylist_image" src={publicUrl(`/images/meet_the_team/${stylist_obj.stylist_info_body.body_stylist_pic}`)} alt={`Picture of ${stylist_obj.stylist_name}`} />
                            </div>
                            <div className="flex flex-column">
                                <p className="stylist_name">{stylist_obj.stylist_name}</p>
                                <p className="stylist_specialty">{stylist_obj.stylist_short_title}</p>
                            </div>
                            
                        </Link>
                        
                        
                    })}
                
            </section>

            
        </div>
    )
}

export default MeetTheTeam
