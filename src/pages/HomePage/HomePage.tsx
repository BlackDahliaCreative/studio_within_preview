import "./home-page.scss" 
import SEOHead from "../../components/SEOHead/SEOHead"

const HomePage = () => {

    return(
        <div className="page" id="homePage">
            <SEOHead path="/home-page" />
            <h1>Home Page</h1>
        </div>
    )
}

export default HomePage