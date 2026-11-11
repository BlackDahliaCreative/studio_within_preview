import { useEffect, useRef, useState } from "react"
import Dropdown from "../../components/DropdownSelect/DropdownSelect"
import SEOHead from "../../components/SEOHead/SEOHead"
import "../page.scss"
import "./careers.scss"
import ButtonLink from "../HomePage/ButtonLink"
import Confirmation from "./ConfirmationPopup"

// Black Dahlia email service (Cloudflare Worker). The form's recipient,
// subject and email design live in the email-service repo under this form name.
const EMAIL_SERVICE = {
    url: "https://email-service.blackdahlia.workers.dev",
    form: "studio-within-careers",
}

const POSITIONS = [
    "Stylist",
    "Front Desk",
    "Manager",
    "Assistant program",
]

const MAX_ABOUT_LENGTH = 600
const MAX_RESUME_MB = 10 // must match the email service's limit

const emptyForm = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    years_experience: "",
    position: "",
    portfolio: "",
    start_date: "",
    about: "",
}
type FormValues = typeof emptyForm

const Careers = () => {
    const formRef = useRef<HTMLFormElement | null>(null)
    const honeypotRef = useRef<HTMLInputElement | null>(null)
    const resumeRef = useRef<HTMLInputElement | null>(null)

    const [values, setValues] = useState<FormValues>(emptyForm)
    const [resumeName, setResumeName] = useState("")
    const [resumeTooBig, setResumeTooBig] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<"idle" | "sent" | "error">("idle")
    const [showErrors, setShowErrors] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)

    const set = (field: keyof FormValues) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
            setValues(v => ({ ...v, [field]: e.target.value }))

    // Hide the "sent" message after a few seconds
    useEffect(() => {
        if (status !== "sent") return
        const t = setTimeout(() => setStatus("idle"), 5000)
        return () => clearTimeout(t)
    }, [status])

    // Every field is required. Missing ones get a red border after Submit.
    // Listed in page order, so the cursor goes to the first one.
    type Field = keyof FormValues | "resume"
    const errors: Partial<Record<Field, true>> = {}
    if (!values.first_name.trim()) errors.first_name = true
    if (!values.last_name.trim()) errors.last_name = true
    if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = true
    if (values.phone.replace(/\D/g, "").length < 10) errors.phone = true
    if (!values.years_experience.trim()) errors.years_experience = true
    if (!values.position) errors.position = true
    // if (!values.portfolio.trim()) errors.portfolio = true
    if (!resumeName) errors.resume = true
    if (!values.start_date) errors.start_date = true
    if (!values.about.trim()) errors.about = true

    const isFormValid = Object.keys(errors).length === 0
    const errorFor = (field: Field) => (showErrors ? errors[field] : undefined)

    const onResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        // Too big: clear the picker and show the message under the field
        const tooBig = Boolean(file && file.size > MAX_RESUME_MB * 1024 * 1024)
        setResumeTooBig(tooBig)
        if (tooBig) {
            e.target.value = ""
            setResumeName("")
            return
        }
        setResumeName(file?.name ?? "")
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (honeypotRef.current?.value) return // filled in by a bot

        if (!isFormValid) {
            setShowErrors(true)
            // Take them to the first field that needs fixing
            const firstInvalid = Object.keys(errors)[0]
            document.getElementById(`careers_${firstInvalid}`)?.focus()
            return
        }
        if (isSubmitting || !formRef.current) return

        try {
            setIsSubmitting(true)
            setStatus("idle")
            // Sends every named field plus the resume file
            const data = new FormData(formRef.current)
            data.append("_form", EMAIL_SERVICE.form)
            const res = await fetch(EMAIL_SERVICE.url, { method: "POST", body: data })
            if (!res.ok) throw new Error(`Email service replied ${res.status}: ${await res.text()}`)
            setStatus("sent")
            setValues(emptyForm)
            setResumeName("")
            if (resumeRef.current) resumeRef.current.value = ""
            setShowErrors(false)
            
        } catch (err) {
            console.error("Application not sent", err)
            setStatus("error")
        } finally {

            setShowConfirmation(true)
            setIsSubmitting(false)
        }
    }

    // A required pill-shaped text field
    const textField = (
        field: keyof FormValues,
        placeholder: string,
        props: React.InputHTMLAttributes<HTMLInputElement> = {},
    ) => (
        <div className="careers-form__field">
            <input
                className="careers-form__input"
                id={`careers_${field}`}
                name={field}
                placeholder={`${placeholder}${field !== 'portfolio' ? '*' : ''}`}
                aria-label={placeholder}
                value={values[field]}
                onChange={set(field)}
                aria-invalid={Boolean(errorFor(field))}
                required
                {...props}
            />
        </div>
    )

    return (
        <div className="page" id="ContactPage">
            <SEOHead path="/careers" />

            <header className="git-intro">
                <h1 className="git-title">Interested in joining our team?</h1>
                <p className="git-subtitle my-40">
                    <span>
                        Come grow with us.
                        <br />Tell us what you do, what you love,
                        <br />and what you’re looking for next.
                    </span>
                </p>
                <ButtonLink to="/meet-the-team" variant="dark"> Meet The Team</ButtonLink>
            </header>

            <form
                id="careersForm"
                className="careers-form mt-35"
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
            >
                <h2 className="careers-form__title">Let’s get to know you</h2>

                {/* Hidden from people; bots fill it in */}
                <div className="hide" aria-hidden="true">
                    <label htmlFor="company">Company</label>
                    <input ref={honeypotRef} type="text" id="company" name="company" autoComplete="off" tabIndex={-1} />
                </div>

                <div className="careers-form__grid">
                    {textField("first_name", "First Name", { autoComplete: "given-name", required: true })}
                    {textField("last_name", "Last Name", { autoComplete: "family-name", required: true })}

                    <div className="careers-form__wide">
                        {textField("email", "Email", { type: "email", autoComplete: "email", required: true })}
                    </div>

                    {textField("phone", "Phone", { type: "tel", autoComplete: "tel", required: true })}
                    {textField("years_experience", "Years of Experience", { inputMode: "numeric" })}

                    {/* Position */}
                    <div className="careers-form__field careers-form__wide">
                        <Dropdown
                            id="careers_position"
                            classNameWrapper={`careers-form__dropdown ${errorFor("position") ? "is-invalid" : ""}`}
                            classNameButton="careers-form__input"
                            customIcon={<span className="careers-form__chevron" aria-hidden="true" />}
                            placeholder="Select position you’re interested in*"
                            options={POSITIONS.map(p => ({ value: p, label: p }))}
                            value={values.position}
                            onChange={(position) => setValues(v => ({ ...v, position }))}
                        />
                        {/* The dropdown is a button, which forms don't send, so this carries the value */}
                        <input type="hidden" name="position" value={values.position} />
                    </div>

                    <div className="careers-form__wide">
                        {textField("portfolio", "Instagram / Portfolio / Website", { autoComplete: "url" })}
                    </div>

                    {/* Resume: the whole pill opens the file picker */}
                    <div className="careers-form__field careers-form__wide">
                        <label className={`careers-form__input careers-form__split ${errorFor("resume") || resumeTooBig ? "is-invalid" : ""}`} htmlFor="careers_resume">
                            <span>Upload Resume*</span>
                            <span className="careers-form__hint">{resumeName || "choose file"}</span>
                            <input
                                ref={resumeRef}
                                className="careers-form__file"
                                type="file"
                                id="careers_resume"
                                name="resume"
                                accept=".pdf,.doc,.docx"
                                onChange={onResumeChange}
                                aria-invalid={Boolean(errorFor("resume")) || resumeTooBig}
                                aria-describedby="careers_resume_note"
                                required
                            />
                        </label>
                        <span
                            id="careers_resume_note"
                            className={`careers-form__note ${resumeTooBig ? "is-error" : ""}`}
                            role={resumeTooBig ? "alert" : undefined}
                        >
                            {resumeTooBig
                                ? `That file is over ${MAX_RESUME_MB}MB. Please choose a smaller one.`
                                : `Max upload: ${MAX_RESUME_MB}MB`}
                        </span>
                    </div>

                    {/* Start date: label on the left, the date picker on the right */}
                    <div className="careers-form__field careers-form__wide">
                        <label className={`careers-form__input careers-form__split ${errorFor("start_date") ? "is-invalid" : ""}`} htmlFor="careers_start_date">
                            <span className={`${values.start_date !== '' ? 'dateSelected':''}`}>Available Start Date*</span>
                            <input
                                className={`careers-form__date ${values.start_date !== '' ? 'selected':''}`}
                                type="date"
                                id="careers_start_date"
                                name="start_date"
                                value={values.start_date}
                                onChange={set("start_date")}
                                aria-invalid={Boolean(errorFor("start_date"))}
                                required
                            />
                        </label>
                    </div>

                    <div className="careers-form__field careers-form__wide">
                        <textarea
                            className="careers-form__input careers-form__textarea"
                            id="careers_about"
                            name="about"
                            rows={4}
                            placeholder="Tell us a little bit about yourself.*"
                            aria-label="Tell us a little bit about yourself"
                            maxLength={MAX_ABOUT_LENGTH}
                            value={values.about}
                            onChange={set("about")}
                            aria-invalid={Boolean(errorFor("about"))}
                            required
                        />
                        <small className="careers-form__count">{values.about.length}/{MAX_ABOUT_LENGTH}</small>
                    </div>
                </div>

                <button type="submit" className="careers-form__submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending…" : "Submit"}
                </button>

                <p className="careers-form__status" role="status" aria-live="polite">
                    {status === "sent" && "Thank you! We’ve received your application and will be in touch soon."}
                    {status === "error" && "Sorry, something went wrong. Please try again or give us a call."}
                </p>
            </form>

            <Confirmation isOpen={showConfirmation} onClose={() => setShowConfirmation(false)} />
        </div>
    )
}

export default Careers
