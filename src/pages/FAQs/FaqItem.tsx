import { Fragment, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { useNewTabOnDesktop } from "../../utils/useMediaQuery"

type NewTab = ReturnType<typeof useNewTabOnDesktop>

// Turns "[label](href)" inside a paragraph into links.
// Other websites (http...) open in a new tab on desktop, the same tab on phones.
const renderText = (text: string, newTab: NewTab): ReactNode[] =>
    text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (!m) return <Fragment key={i}>{part}</Fragment>
        const [, label, href] = m
        if (href.startsWith('/')) return <Link key={i} className="faq-link" to={href}>{label}</Link>
        const external = href.startsWith('http')
        return <a key={i} className="faq-link" href={href} {...(external ? newTab : {})}>{label}</a>
    })

type Props = {
    id: string
    question: string
    answer: string[]
    open: boolean
    onToggle: () => void
}

// One collapsible question. The answer stays in the HTML when closed (so Google
// still reads it) but is hidden from keyboard and screen readers with `inert`.
const FaqItem = ({ id, question, answer, open, onToggle }: Props) => {
    const newTab = useNewTabOnDesktop()
    return (
    <div className={`faq-item${open ? ' is-open' : ''}`}>
        <h3 className="faq-item__heading">
            <button
                type="button"
                className="faq-item__toggle"
                id={`${id}-q`}
                aria-expanded={open}
                aria-controls={`${id}-a`}
                onClick={onToggle}
            >
                <span className="faq-item__question">“{question}”</span>
                <span className="faq-item__icon" aria-hidden="true">{open ? '–' : '+'}</span>
            </button>
        </h3>
        <div
            className="faq-item__panel"
            id={`${id}-a`}
            role="region"
            aria-labelledby={`${id}-q`}
            // React 18 has no typed `inert` prop; an empty string turns it on
            {...(open ? {} : { inert: '' })}
        >
            <div className="faq-item__answer">
                {answer.map((p, i) => <p key={i}>{renderText(p, newTab)}</p>)}
            </div>
        </div>
    </div>
    )
}

export default FaqItem
