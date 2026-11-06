import { useState } from "react"
import { Helmet } from "react-helmet-async"
import "./faqs.scss"
import SEOHead from "../../components/SEOHead/SEOHead"
import ButtonLink from "../HomePage/ButtonLink"
import FaqItem from "./FaqItem"
import { faqGroups, plainAnswer, PHONE_DISPLAY, PHONE_HREF } from "./faqData"

// FAQPage structured data: tells Google these are questions and answers
const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqGroups.flatMap(g => g.items).map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: plainAnswer(item.a) },
    })),
}

const FAQs = () => {
    // Only one question is open at a time: opening one closes the others
    const [openId, setOpenId] = useState<string | null>(null)
    const toggle = (id: string) => setOpenId(current => (current === id ? null : id))

    return(
        <div className="page" id="faqsPage">
            <SEOHead path="/faqs" />
            <Helmet>
                <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
            </Helmet>

            <header className="faqs-intro">
                <h1 className="faqs-title">A few things you may<br />be <em>wondering</em>...</h1>
                <p className="faqs-subtitle"><span>Everything you need to know before your first visit</span></p>
            </header>

            <div className="faqs-list">
                {faqGroups.map((group, g) => (
                    <section className="faq-group" key={group.title} aria-labelledby={`faq-group-${g}`}>
                        <h2 className="faq-group__title" id={`faq-group-${g}`}>{group.title}</h2>
                        {group.items.map((item, i) => {
                            const id = `faq-${g}-${i}`
                            return (
                                <FaqItem
                                    key={id}
                                    id={id}
                                    question={item.q}
                                    answer={item.a}
                                    open={openId === id}
                                    onToggle={() => toggle(id)}
                                />
                            )
                        })}
                    </section>
                ))}
            </div>

            <section className="faqs-help" aria-labelledby="faqs-help-title">
                <p className="faqs-help__eyebrow">Still have a question?</p>
                <h2 className="faqs-help__title" id="faqs-help-title">We’re here to help.</h2>
                <ButtonLink to="/contact-us/">Get in touch</ButtonLink>
                <p className="faqs-help__phone">or call us @ <a href={PHONE_HREF}>{PHONE_DISPLAY}</a></p>
            </section>
        </div>
    )
}

export default FAQs
