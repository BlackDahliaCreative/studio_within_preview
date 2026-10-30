import { Link } from "react-router-dom"

// Home page button (brown "book now" style, or the light cream one in the hero)
const ButtonLink = ({ to, children, variant = 'dark' }: { to: string, children: React.ReactNode, variant?: 'dark' | 'light' }) => (
    <Link className={`home-btn home-btn--${variant}`} to={to}>{children}</Link>
)

export default ButtonLink
