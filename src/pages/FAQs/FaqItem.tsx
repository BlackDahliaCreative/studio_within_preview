import { Fragment, type ReactNode } from "react"
import { Link } from "react-router-dom"

// Turns "[label](href)" inside a paragraph into links
const renderText = (text: string): ReactNode[] =>
    text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (!m) return <Fragment key={i}>{part}</Fragment>
        const [, label, href] = m
        return href.startsWith('/')
            ? <Link key={i} className="faq-link" to={href}>{label}</Link>
            : <a key={i} className="faq-link" href={href}>{label}</a>
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
const FaqItem = ({ id, question, answer, open, onToggle }: Props) => (
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
                {answer.map((p, i) => <p key={i}>{renderText(p)}</p>)}
            </div>
        </div>
    </div>
)

export default FaqItem
