import { useEffect, useState } from "react"

// true while the media query matches, e.g. useMediaQuery('(max-width: 999.98px)').
// Starts false and updates after the page loads, so the pre-rendered HTML (which
// has no screen size) and the first render in the browser match.
export const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false)
    useEffect(() => {
        if (!window.matchMedia) return
        const mql = window.matchMedia(query)
        const update = () => setMatches(mql.matches)
        update()
        mql.addEventListener('change', update)
        window.addEventListener('resize', update) // backup: some emulators skip the 'change' event
        return () => {
            mql.removeEventListener('change', update)
            window.removeEventListener('resize', update)
        }
    }, [query])
    return matches
}

// Phones and tablets: same breakpoint as the one-column layouts in the SCSS
export const SMALL_SCREEN_QUERY = '(max-width: 999.98px)'

// For links to other sites: a new tab on desktop, the same tab on phones and
// tablets (new tabs are clumsy there, and visitors can just go back).
// Spread onto the link: <a href="..." {...newTabOnDesktop}>
export const useNewTabOnDesktop = () => {
    const isSmallScreen = useMediaQuery(SMALL_SCREEN_QUERY)
    return isSmallScreen
        ? { target: '_self' as const }
        : { target: '_blank' as const, rel: 'noopener noreferrer' } // don't give the other site access back to this page
}
