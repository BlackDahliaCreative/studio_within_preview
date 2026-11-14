import { Link } from "react-router-dom"
import { useMediaQuery, SMALL_SCREEN_QUERY } from "../../utils/useMediaQuery"

type Target = '_self' | '_blank' | '_parent' | '_top'

// Home page button (brown "book now" style, or the light cream one in the hero)
const ButtonLink = ({ to, children, variant = 'dark', onClick, target = '_self' }: { to: string, children: React.ReactNode, variant?: 'dark' | 'light', onClick?: () => void, target?: Target }) => {
    // Phones and tablets: "new tab" buttons open in the same tab instead
    // (new tabs are clumsy on a phone, and visitors can just go back)
    const isSmallScreen = useMediaQuery(SMALL_SCREEN_QUERY)
    const finalTarget: Target = target === '_blank' && isSmallScreen ? '_self' : target

    return (
        <Link className={`home-btn home-btn--${variant}`} to={to} onClick={onClick} target={finalTarget}
            // New tab: don't give the other site access back to this page
            rel={finalTarget === '_blank' ? 'noopener noreferrer' : undefined}>{children}</Link>
    )
}

export default ButtonLink
