import { useEffect } from "react"

// Mangomint's script (booking.mangomint.com/app.js, loaded in index.html) catches every
// click on a booking.mangomint.com link, and on clients.mangomint.com/gift-cards/<company id>
// links (gift cards). On desktop it opens its booking overlay in the
// page, which is fine. On iPhones/iPads and screens up to 767px it calls
// window.open(url, "_blank") instead, so phones got a new tab for every "Book now".
//
// On those same devices we catch the click first (window, capture phase: before
// Mangomint's listener on document) and open the booking page in the same tab.
// Desktop is untouched and still gets the overlay.
const mangomintWouldOpenNewTab = () =>
    /iPad|iPhone|iPod/.test(navigator.userAgent) || window.matchMedia?.('(max-width: 767px)').matches

export const useMangomintSameTab = () => {
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            // Let ctrl/cmd/shift/middle clicks do what the visitor asked for
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
            // Booking links and clients.mangomint.com links (gift cards, memberships, packages)
            const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href*="booking.mangomint.com"], a[href*="clients.mangomint.com"]')
            if (!link || !mangomintWouldOpenNewTab()) return
            e.stopPropagation() // Mangomint never sees the click
            e.preventDefault()
            window.location.assign(link.href)
        }
        window.addEventListener('click', onClick, true)
        return () => window.removeEventListener('click', onClick, true)
    }, [])
}
