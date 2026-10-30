import './footer.scss'
import { Link, useLocation } from 'react-router-dom'
import { publicUrl } from '../../utils/publicUrl'

const links = [
    { to: '/home-page/', label: 'Home' },
    { to: '/meet-the-team/', label: 'Meet the team' },
    { to: '/policies/', label: 'Policies' },
    { to: '/faqs/', label: "FAQ's" },
    { to: '/services/', label: 'Services' },
    { to: '/get-in-touch/', label: 'Get in touch' },
]

// Replace the "#" links with the salon's real profiles.
const socials = [
    { name: 'tiktok', label: 'TikTok', href: '#' },
    { name: 'facebook', label: 'Facebook', href: '#' },
    { name: 'instagram', label: 'Instagram', href: '#' },
]

const Footer = () => {
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
                {socials.map(s => (
                    <a key={s.name} className={`footer__social footer__social--${s.name}`} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer">
                        <img src={publicUrl(`/images/footer/${s.name}-frame.svg`)} alt="" />
                        <img className="footer__social-logo" src={publicUrl(`/images/footer/${s.name}-logo.svg`)} alt="" />
                    </a>
                ))}
            </div>

            <p className="footer__credit">Website by: Black Dahlia Creative</p>
        </footer>
    )
}

export default Footer
