import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

import { PHONE_HREF } from "../FAQs/faqData"
import { publicUrl } from "../../utils/publicUrl";

import Popup from "../../components/Popup/Popup"
import ButtonLink from "./ButtonLink";
import { BOOKING_URL } from "../../utils/booking";

import '../GetInTouch/get-in-touch.scss'

const EMAIL = 'swssdesk@gmail.com'
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Studio+Within+Salon+5720+N+Western+Ave+Chicago+IL+60659'
const CONSULTATION_LINK = 'https://booking.mangomint.com/959799?serviceId=119'

type NewClientPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
};

// Opening hours as shown in Figma
const hours = [
    { day: 'Monday', time: 'Closed' },
    { day: 'Tuesday', time: '10am-7pm' },
    { day: 'Wednesday', time: '11am-7pm' },
    { day: 'Thursday', time: '12pm-9pm' },
    { day: 'Friday', time: '10am-8pm' },
    { day: 'Saturday', time: '9am-6pm' },
    { day: 'Sunday', time: 'By appointment only' },
]

const Photo = ({ src, alt, className }: { src: string, alt: string, className: string }) => {
    const frameRef = useRef<HTMLDivElement>(null)
    const reduceMotion = useReducedMotion()
    const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] })
    const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

    return (
        <div className={`git-photo ${className}`}>
            <div className="git-photo__frame" ref={frameRef}>
                <motion.img
                    src={publicUrl(`/images/get_in_touch/${src}`)}
                    alt={alt}
                    loading="lazy"
                    style={reduceMotion ? undefined : { y, scale: 1.25 }}
                />
            </div>
        </div>
    )
}

const NewClientPopup = ({isOpen, onClose, className}: NewClientPopupProps) => {
        const { ref: thingsToDo, inView: thingsToDoInView } = useInView({
            threshold: 1,
            triggerOnce: false, // keep toggling when leaving/entering view
        })
        const { ref: salonHr, inView: salonHrInView } = useInView({
            threshold: 1,
            triggerOnce: false, // keep toggling when leaving/entering view
        })

        const bookingButtonsRef = useRef<HTMLElement | null>(null)
        useEffect(() => {
            if (!isOpen) return
            const closeOnBookingClick = (e: MouseEvent) => {
                if (e.target instanceof Node && bookingButtonsRef.current?.contains(e.target)) onClose()
            }
            window.addEventListener("click", closeOnBookingClick, true)
            return () => window.removeEventListener("click", closeOnBookingClick, true)
        }, [isOpen, onClose])

        return (
            <Popup isOpen={isOpen} onClose={onClose} className={className}>
                
                <header className="flex flex-column flex-justifyContent-center flex-alignItems-center">
                    <h3 className="git-title">Welcome to Studio Within Salon!</h3>
                    <img src={publicUrl('/logos/CurlyLogo.svg')} alt="Curly Logo" className="my-20"/>
                    <h4>We're so happy you're here!</h4>
                    <p className="git-description">Before booking your first visit, we'd love to share a few things to help make your experience as seamless and enjoyable as possible.</p>
                </header>

                <section className="new-client__things-to-know">
                    <h4 ref={thingsToDo} className={`${thingsToDoInView ? 'titleInView' : ''}`}>A Few Things to Know Before Your Visit</h4>
                    
                    <div className="flex flex-column few-things-subsec">
                        <h5>Booking and Cancellations</h5>
                        <p>
                            A valid credit or debit card is required on file to book any appointment or consultation. 
                            We kindly ask for at least 48 hours' notice for cancellations or rescheduling. 
                            Changes made within that window, including no shows, are subject to a charge of 100% of the reserved service total.
                        </p>
                    </div>
                    <div className="flex flex-column few-things-subsec">
                        <h5>Children & Guests</h5>
                        <p>
                            To maintain a peaceful, relaxing environment, we kindly ask that guests attend their appointments alone. 
                            Children under 13 must be accompanied by an adult who is not receiving a service unless prior arrangements have been approved. 
                            Please note that curly cuts are priced by service, not age.
                        </p>
                    </div>
                    <div className="flex flex-column few-things-subsec">
                        <h5>Your Experience</h5>
                        <p>
                            Your comfort and satisfaction are important to us! 
                            We offer complimentary beverages and light snacks during your visit. 
                            If you have any questions about our services or policies, we're always happy to help or answer any questions.  
                        </p>
                    </div>

                    <p className="bottom-desc">   
                        We can be reached at   
                        <span className="git-contact__phone mx-10">
                            <a href={PHONE_HREF}>773-348-9323</a>
                        </span>
                        or
                        <a href={`mailto:${EMAIL}`} className="ml-10">{EMAIL}</a>
                    </p>
                </section>

                <section className="new-client-hours mt-40" aria-labelledby="new-client-hours-title">
                    <div className="new-client-hours__table">
                        <h2 ref={salonHr} className={`new-client-hours__title ${salonHrInView ? 'titleInView' : ''}`} id="new-client-hours-title">SALON HOURS:</h2>
                        <table>
                            <tbody>
                                {hours.map(h => (
                                    <tr key={h.day}>
                                        <th scope="row">{h.day}</th>
                                        <td>{h.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="new-client-photo-container--storefront">
                        <Photo className="new-client-photo--storefront" src="get_in_touch2.webp" alt="Studio Within storefront with a colourful mural and planters on Western Avenue" />
                    </div>
                </section>

                {/* Salon photo + contact details */}
                <section className="new-client-contact mt-30" aria-label="Contact details">
                    <div className="new-client-contact__details flex flex-justifyContent-center">
                        <address>
                            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                                5720 N Western Ave<br />Chicago, IL 60659
                            </a>
                        </address>
                    </div>
                    <p className="text-center">
                        For additional questions, please visit our
                        <Link to="/faqs" className="mx-5">FAQ</Link>
                        page.
                    </p>
                    <p className="text-center">We look forward to welcoming you into our space and making your first visit a wonderful one!</p>
                    <p className="text-center">By continuing to book, you acknowledge that you have reviewed our salon policies.</p>
                </section>

                <section ref={bookingButtonsRef} className="new-client__actions">
                    <ButtonLink to={CONSULTATION_LINK}>Schedule a Consultation</ButtonLink>
                    <ButtonLink to={BOOKING_URL}>book An appointment</ButtonLink>
                </section>
            </Popup>
        )
}

export default NewClientPopup