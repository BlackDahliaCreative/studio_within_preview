import "./home-page.scss" 
import SEOHead from "../../components/SEOHead/SEOHead"
import { publicUrl } from "../../utils/publicUrl"

const HomePage = () => {

    return(
        <div className="page" id="homePage">
            <SEOHead path="/home-page" />
            <div id="landing_hero">
                <img id="home_hero" src={publicUrl('/images/homepage/homepage_HERO.webp')}/>
                <div className="flex flex-column flex-alignItems-center" id="logo_home">
                    <img className="logo_partner" src={publicUrl('/logos/white_primary_logo.png')} alt="Studio Within Salon Logo" />
                    <p>Lincoln Square, Chicago</p>
                </div>
            </div>
            <h1 className="Intro2">Home Page</h1>
        </div>
    )
}

export default HomePage