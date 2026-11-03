import { Link, useLocation, NavLink } from "react-router-dom";
import { publicUrl } from "../../utils/publicUrl";
import { navLinks, HOME_PATH } from "./navLinks";
import './navigation-bar.scss'

const NavigationBar = () => {
    const path = useLocation().pathname
    if (path === '/') return null // the landing page has no menu

    // On the home page the links sit in white over the hero photo, which already
    // shows the big logo. Every other page gets the logo box, which links home.
    const isHome = path.startsWith('/home-page')

    return (
        <nav aria-label="Main navigation" className={`navBar ${isHome ? 'navBar--home' : ''}`}>
            {!isHome && (
                <Link className="navBar__logo" to={HOME_PATH}>
                    <img
                        src={publicUrl('/logos/black_primary_logo-400.webp')}
                        width={400}
                        height={330}
                        alt="Studio Within Salon, home"
                    />
                </Link>
            )}
            <div className="navBar__links">
                {navLinks.map(link => (
                    <NavLink key={link.to} className="navLinks" to={link.to}>{link.label}</NavLink>
                ))}
            </div>
        </nav>
    )
}

export default NavigationBar
