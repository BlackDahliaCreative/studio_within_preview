import { Link } from "react-router-dom"

// Home page button (brown "book now" style, or the light cream one in the hero)
const ButtonLink = ({ to, children, variant = 'dark', onClick, target = '_self' }: { to: string, children: React.ReactNode, variant?: 'dark' | 'light', onClick?: () => void, target?: '_self' | '_blank'| '_parent'| '_top'  }) => (
    <Link className={`home-btn home-btn--${variant}`} to={to} onClick={onClick} target={target}
        // New tab: don't give the other site access back to this page
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}>{children}</Link>
)

export default ButtonLink
