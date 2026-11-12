import { useRef, useState } from "react"

// Black Dahlia email service (Cloudflare Worker). Each signup is emailed to the salon,
// who add the person to their mailing list. Recipient and email design live in the
// email-service repo under this form name.
const EMAIL_SERVICE = {
    url: "https://email-service.blackdahlia.workers.dev",
    form: "studio-within-newsletter",
}

const NewsletterForm = () => {
    const formRef = useRef<HTMLFormElement | null>(null)
    const [firstName, setFirstName] = useState("")
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<"idle" | "sent" | "error" | "invalid">("idle")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isSubmitting || !formRef.current) return

        if (!firstName.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setStatus("invalid")
            return
        }

        try {
            setIsSubmitting(true)
            setStatus("idle")
            const data = new FormData(formRef.current) // includes the hidden honeypot
            data.append("_form", EMAIL_SERVICE.form)
            const res = await fetch(EMAIL_SERVICE.url, { method: "POST", body: data })
            if (!res.ok) throw new Error(`Email service replied ${res.status}: ${await res.text()}`)
            setStatus("sent")
            setFirstName("")
            setEmail("")
        } catch (err) {
            console.error("Newsletter signup not sent", err)
            setStatus("error")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form id="stay_in_the_loop_subscribe" ref={formRef} onSubmit={handleSubmit} noValidate>
            {/* Hidden from people; bots fill it in (the email service drops those) */}
            <div className="hide" aria-hidden="true">
                <label htmlFor="newsletter_company">Company</label>
                <input type="text" id="newsletter_company" name="company" autoComplete="off" tabIndex={-1} />
            </div>

            <input
                type="text"
                name="first_name"
                placeholder="First Name"
                aria-label="First Name"
                autoComplete="given-name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                aria-invalid={status === "invalid" && !firstName.trim()}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email address"
                aria-label="Email address"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-invalid={status === "invalid" && !/\S+@\S+\.\S+/.test(email)}
                required
            />
            <button type="submit" className="home-btn home-btn--dark" disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Subscribe"}
            </button>

            <p className="stay_in_the_loop_status" role="status" aria-live="polite">
                {status === "sent" && "You’re in the loop! Thanks for signing up."}
                {status === "invalid" && "Please add your first name and a valid email."}
                {status === "error" && "Sorry, something went wrong. Please try again."}
            </p>
        </form>
    )
}

export default NewsletterForm
