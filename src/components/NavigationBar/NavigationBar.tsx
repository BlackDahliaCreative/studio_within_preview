import { useEffect, useRef, useState } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { publicUrl } from "../../utils/publicUrl";
import { navLinks, navLinksDropdown, HOME_PATH } from "./navLinks";
import './navigation-bar.scss'

const NavigationBar = () => {
    const path = useLocation().pathname

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const toggleRef = useRef<HTMLButtonElement>(null)

    useEffect(() => setDropdownOpen(false), [path])
    useEffect(() => {
        if (!dropdownOpen) return
        const onPointerDown = (e: PointerEvent) => {
            if (!dropdownRef.current?.contains(e.target as Node)) setDropdownOpen(false)
        }
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setDropdownOpen(false)
                toggleRef.current?.focus()
            }
        }
        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('pointerdown', onPointerDown)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [dropdownOpen])

    if (path === '/') return null // the landing page has no menu

    const isHome = path.startsWith('/home-page')
    const inDropdownPage = navLinksDropdown.some(link => path.startsWith(link.to.replace(/\/$/, '')))

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
            <div className="navBar__links pl-50">
                {navLinks.map(link => (
                    <NavLink key={link.to} className="navLinks" to={link.to}>{link.label}</NavLink>
                ))}

                <div className={`navDropdown ${dropdownOpen ? 'navDropdown--open' : ''}`} ref={dropdownRef}>
                    <button
                        type="button"
                        ref={toggleRef}
                        className={`navLinks navDropdown__toggle ${inDropdownPage ? 'active' : ''}`}
                        aria-expanded={dropdownOpen}
                        aria-controls="getInTouchMenu"
                        onClick={() => setDropdownOpen(open => !open)}
                    >
                        Get In Touch
                        <span className="navDropdown__chevron" aria-hidden="true" />
                    </button>
                    <div className="navDropdown__menu" id="getInTouchMenu">
                        <ul>
                            {navLinksDropdown.map(link => (
                                <li key={link.to}>
                                    <NavLink className="navDropdown__link" to={link.to}>{link.label}</NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavigationBar
