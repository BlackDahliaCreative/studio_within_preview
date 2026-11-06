import { Link, NavLink, useLocation } from "react-router-dom";
import './navigation-bar-small-screen.scss'
import { useState } from "react";
import { useTransition, animated } from "@react-spring/web";
import { publicUrl } from "../../utils/publicUrl";
import { navLinks, navLinksDropdown, HOME_PATH } from "../NavigationBar/navLinks";

const NavigationBarSmallScreen = () => {
    const path = useLocation().pathname
    const [isExpanded, setIsExpanded] = useState(false)
    const toggleLogic = () => {
        setIsExpanded(prevState => !prevState)
    }
    const close = () => setIsExpanded(false)
    const transitions = useTransition(isExpanded, {
        from: { opacity: 0, height: '0%', width: '0%' },
        enter: { opacity: 1, height: '100%', width: '100%' },
        leave: { opacity: 0, height: '0%', width: '0%' },
        config: { duration: 200 },
    })

    // Same as desktop: the logo box (the home link) shows on every page except
    // the landing page and the home page, whose hero already has the big logo.
    const showLogoBar = path !== '/' && !path.startsWith('/home-page')

    return (
        <>
            {showLogoBar && (
                <div className="navSm__bar">
                    <Link className="navSm__logo" to={HOME_PATH}>
                        <img
                            src={publicUrl('/logos/black_primary_logo-400.webp')}
                            width={400}
                            height={330}
                            alt="Studio Within Salon, home"
                        />
                    </Link>
                </div>
            )}

            <button
                className="hambContainer"
                onClick={toggleLogic}
                aria-expanded={isExpanded}
                aria-controls="smallScreenMenu"
                aria-label={isExpanded ? 'Close navigation menu' : 'Open navigation menu'}
            >
                <div className={isExpanded ? 'hamburger-menu openHam' : 'hamburger-menu'} aria-hidden="true">
                    <div className="bar" id="bar1"></div>
                    <div className="bar" id="bar2"></div>
                    <div className="bar" id="bar3"></div>
                </div>
            </button>

            {transitions((style, item) =>
                item ? (
                    <animated.div style={style} id="smallScreenMenu" role="dialog" aria-label="Navigation menu">
                        <nav aria-label="Main navigation" className='navBarSm'>
                            <Link className="navSm__menuLogo" onClick={close} to={HOME_PATH}>
                                <img
                                    src={publicUrl('/logos/white_primary_logo-840.webp')}
                                    width={840}
                                    height={694}
                                    alt="Studio Within Salon, home"
                                />
                            </Link>
                            {/* No dropdown on phones: the "Get In Touch" links follow the main ones */}
                            {[...navLinks, ...navLinksDropdown].map(link => (
                                <NavLink key={link.to} className="navLinksSmScreen" onClick={close} to={link.to}>{link.label}</NavLink>
                            ))}
                        </nav>
                    </animated.div>
                ) : null
            )}
        </>
    )
}

export default NavigationBarSmallScreen
