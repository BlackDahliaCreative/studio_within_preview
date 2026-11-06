import "./meet-the-team.scss" 
import SEOHead from "../../components/SEOHead/SEOHead"
import ButtonLink from "../HomePage/ButtonLink"
import { BOOKING_URL } from "../../utils/booking"
import { stylist_info } from "./stylists_info"
import { publicUrl } from "../../utils/publicUrl"
import { Link } from "react-router-dom"

const MeetTheTeam = () => {

    return(
        <div className="page" id="meetTheTeamPage">
            <SEOHead path="/meet-the-team" />
            <header className="git-intro">
                <h1 className="git-title">The people behind the Curls...</h1>
                <p className="git-subtitle mb-20">
                    <span> Meet the people who make Studio Within feel like home and bring thoughtful curl care to clients across Chicago.</span>
                </p>
                <ButtonLink to={BOOKING_URL} variant="light" >Book now</ButtonLink>
            </header>

            <section className="flex" id="stylist_cards_section">
                
                    {stylist_info.map((stylist_obj, i) => {
                        return  <Link className="single_stylist_card" key={stylist_obj.stylist_id} id={`stylist_${i}`} to={`/meet-the-team/${stylist_obj.stylist_id}`}>                        
                            
                            <p className="stylist_name">{stylist_obj.stylist_name}</p>
                            <p className="stylist_specialty">{stylist_obj.stylist_short_title}</p>
                            <img className="stylist_image" src={publicUrl(`/images/meet_the_team/${stylist_obj.stylist_info_body.body_stylist_pic}`)} alt={`Picture of ${stylist_obj.stylist_name}`} />
                            
                        </Link>
                        
                        
                    })}
                
            </section>

            
        </div>
    )
}

export default MeetTheTeam
