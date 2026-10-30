import { Link, useLocation, NavLink } from "react-router-dom";
import './navigation-bar.scss'

const NavigationBar = () => {
    const pageShowing = useLocation().pathname
    console.log(pageShowing)
    return (
        <nav aria-label="Main navigation" className={pageShowing === '/' ? 'hide' : `flex flex-alignItems-center flex-justifyContent-center navBar`}>
            <NavLink className={pageShowing !== '/' ? 'hide': 'navlinks'} to={'/'}>Landing</NavLink>
            <div className={pageShowing.includes('home-page') ? 'white flex flex-alignItems-center': 'flex flex-alignItems-center'}>
                <NavLink className="navLinks" to={'/home-page/'}>Home</NavLink>
                <NavLink className="navLinks" to={'/meet-the-team/'}>Meet the Team</NavLink>
                <NavLink className="navLinks" to={'/policies/'}>Policies</NavLink>
                <NavLink className="navLinks" to={'/faqs/'}>FAQs</NavLink>
                <NavLink className="navLinks" to={'/services/'}>Services</NavLink>
                <NavLink className="navLinks" to={'/careers/'}>Careers</NavLink>
                <NavLink className="navLinks" to={'/get-in-touch/'}>Get in Touch</NavLink>
                
            </div>
        </nav>
    )
}

export default NavigationBar