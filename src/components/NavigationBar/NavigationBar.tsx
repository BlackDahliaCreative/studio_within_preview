import { Link, useLocation } from "react-router-dom";
import './navigation-bar.scss'

const NavigationBar = () => {
    const pageShowing = useLocation().pathname
    console.log(pageShowing)
    return (
        <nav aria-label="Main navigation" className={pageShowing === '/' ? 'hide' : `flex flex-alignItems-center flex-justifyContent-center navBar`}>
            <Link className="navLinks" to={'/'}>Landing</Link>
            <Link className="navLinks" to={'/home-page/'}>Home Page</Link>
            <Link className="navLinks" to={'/policies/'}>Policies</Link>
            <Link className="navLinks" to={'/faqs/'}>FAQs</Link>
            <Link className="navLinks" to={'/careers/'}>Careers</Link>
            <Link className="navLinks" to={'/get-in-touch/'}>Get in Touch</Link>
            <Link className="navLinks" to={'/meet-the-team/'}>Meet the Team</Link>
        </nav>
    )
}

export default NavigationBar