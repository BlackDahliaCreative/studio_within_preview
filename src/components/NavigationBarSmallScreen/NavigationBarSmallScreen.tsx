import { Link, NavLink, useLocation } from "react-router-dom";
import './navigation-bar-small-screen.scss'
import { useEffect, useRef, useState } from "react";
import { useTransition, animated } from "@react-spring/web";
import { publicUrl } from "../../utils/publicUrl";
import { navLinks, navLinksDropdown, HOME_PATH } from "../NavigationBar/navLinks";

const NavigationBarSmallScreen = () => {
    const path = useLocation().pathname
    const [isExpanded, setIsExpanded] = useState(false)
    const toggleRef = useRef<HTMLButtonElement>(null)
    const menuRef = useRef<HTMLElement>(null)
    const toggleLogic = () => {
        setIsExpanded(prevState => !prevState)
    }
    const close = () => setIsExpanded(false)

    // Keyboard and screen reader support while the menu is open:
    // focus moves into the menu, Tab stays inside it (menu links + the close button),
    // Escape closes it and puts focus back on the button, and the page behind can't scroll.
    useEffect(() => {
        if (!isExpanded) return
        const focusables = () => [
            toggleRef.current,
            ...Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a[href]') ?? []),
        ].filter((el): el is HTMLElement => el !== null)

        const firstLinkTimer = window.setTimeout(() => focusables()[1]?.focus(), 50)
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsExpanded(false)
                toggleRef.current?.focus()
                return
            }
            if (e.key !== 'Tab') return
            const items = focusables()
            const i = items.indexOf(document.activeElement as HTMLElement)
            const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i === items.length - 1 ? 0 : i + 1)
            e.preventDefault()
            items[next]?.focus()
        }
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', onKeyDown)
        return () => {
            window.clearTimeout(firstLinkTimer)
            document.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = prevOverflow
        }
    }, [isExpanded])
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
                ref={toggleRef}
                className="hambContainer"
                onClick={toggleLogic}
                aria-expanded={isExpanded}
                aria-controls="smallScreenMenu"
                aria-label={isExpanded ? 'Close navigation menu' : 'Open navigation menu'}
            >
                {/* Two lines that cross into an X when open */}
                <span className={isExpanded ? 'hamburger-menu openHam' : 'hamburger-menu'} aria-hidden="true">
                    <span className="bar bar--top"></span>
                    <span className="bar bar--middle"></span>
                    <span className="bar bar--bottom"></span>
                </span>
            </button>

            {transitions((style, item) =>
                item ? (
                    <animated.div style={style} id="smallScreenMenu" role="dialog" aria-modal="true" aria-label="Navigation menu">
                        {/* The logo webp has a ~1.5% black haze where it should be
                            transparent, which shows as a grey box on white.
                            This filter turns that near-zero alpha into zero. */}
                        <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
                            <filter id="navSmLogoClean">
                                <feComponentTransfer>
                                    <feFuncA type="linear" slope="1.05" intercept="-0.05" />
                                </feComponentTransfer>
                            </filter>
                        </svg>
                        <nav ref={menuRef} aria-label="Main navigation" className='navBarSm'>
                            <Link className="navSm__menuLogo" onClick={close} to={HOME_PATH}>
                                <img
                                    src={publicUrl('/logos/black_primary_logo-400.webp')}
                                    width={400}
                                    height={330}
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
