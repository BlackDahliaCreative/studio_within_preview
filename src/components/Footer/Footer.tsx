import './footer.scss'
import { Link, useLocation } from 'react-router-dom'
import { publicUrl } from '../../utils/publicUrl'
import { navLinks, navLinksDropdown } from '../NavigationBar/navLinks'
import { useNewTabOnDesktop } from "../../utils/useMediaQuery"

// Same links as the navbar (shared list), so the two menus never drift apart
const links = [...navLinks, ...navLinksDropdown]

// Replace the "#" links with the salon's real profiles.
const socials = [
    { name: 'tiktok', label: 'TikTok', href: '#' },
    { name: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/studiowithin' },
    { name: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/studiowithin/' },
]

const Footer = () => {
    // Links to other sites: new tab on desktop, same tab on phones and tablets
    const newTab = useNewTabOnDesktop()
    const pageShowing = useLocation().pathname
    return (
        <footer className={ pageShowing === '/' ? 'hide': 'footer'}>
            <span
                className="footer__mark"
                style={{ maskImage: `url("${publicUrl('/images/footer/mark-mask.svg')}")`, WebkitMaskImage: `url("${publicUrl('/images/footer/mark-mask.svg')}")` }}
            >
                <img src={publicUrl('/images/footer/mark.svg')} alt="" />
            </span>
            <img className="footer__wordmark" src={publicUrl('/images/footer/wordmark.svg')} alt="Studio Within Salon, The Curl Spot" width="296" height="34" />

            <nav className="footer__nav" aria-label="Footer navigation">
                {links.map(l => <Link key={l.to} to={l.to}>{l.label}</Link>)}
            </nav>

            <div className="footer__socials">
                {socials.filter(s => s.href !== '#').map(s => (
                    <a key={s.name} className={`footer__social footer__social--${s.name}`} href={s.href} aria-label={s.label} {...newTab}>
                        <img src={publicUrl(`/images/footer/${s.name}-frame.svg`)} alt="" />
                        <img className="footer__social-logo" src={publicUrl(`/images/footer/${s.name}-logo.svg`)} alt="" />
                    </a>
                ))}
            </div>

            <p className="footer__credit">
                Website by:{' '}
                <a href="https://blackdahliacreative.com" {...newTab}>Black Dahlia Creative</a>
            </p>
        </footer>
    )
}

export default Footer
