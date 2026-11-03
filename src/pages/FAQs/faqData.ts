// FAQ content, grouped like the Figma "FAQ's" frame.
// Each answer is a list of paragraphs. Links use [label](href):
// "/..." goes to a page on the site, "tel:..." opens the phone app.

export type Faq = { q: string, a: string[] }
export type FaqGroup = { title: string, items: Faq[] }

export const PHONE_DISPLAY = '(773) 348-9323'
export const PHONE_HREF = 'tel:+17733489323'

export const faqGroups: FaqGroup[] = [
    {
        title: 'Booking + Payments',
        items: [
            {
                q: 'Do I need a deposit to book?',
                a: ['No deposit is required to book. However, we do require an active card on file (debit or credit) to reserve your appointment. This card will only be charged in the case of a late cancellation, reschedule, or no show. (See our [cancellation policy](/policies/) for details.)'],
            },
            {
                q: 'Do you charge a credit card processing fee?',
                a: ['Yes — a 3% processing fee applies only to credit card payments. This fee does not apply to debit cards or cash.'],
            },
            {
                q: 'How do I know what a service will cost?',
                a: ['Our online booking displays starting prices for each service by stylist, so you can see pricing before you book. Final pricing may vary based on hair length, density, and the specific techniques used, and will always be confirmed with you during your consultation.'],
            },
            {
                q: 'How do I book an appointment?',
                // Placeholder: the Figma answer just repeats the question. Confirm with the salon.
                a: [`You can book online any time using the Book Now button, or call or text us at [${PHONE_DISPLAY}](${PHONE_HREF}) and we'll help you find the right service and stylist.`],
            },
        ],
    },
    {
        title: 'Before Your Visit',
        items: [
            {
                q: "What if I'm running late?",
                a: ["Please call or text us as soon as you know you'll be late. Depending on how late you are, your stylist may not be able to take you, and your appointment may need to be rescheduled for a later time."],
            },
            {
                q: 'Where do I park?',
                a: ['The block of Western the salon is on has free street parking. The blocks immediately before and after are pay to park. There are also residential blocks behind the salon with non permit free parking.'],
            },
            {
                q: 'What should I know for my first visit?',
                a: ['First time guests should arrive with clean, dry, detangled hair, and plan to spend a little extra time with us for a full consultation. Please avoid bringing friends or guests along unless necessary, as space is limited. If your hair requires detangling before your service, an additional charge may apply.'],
            },
            {
                q: 'Can I bring my child to my appointment?',
                a: ["Children accompanying a parent or guardian for their own haircut must stay with them for the full duration of service, and we appreciate your understanding as space is limited. If you're bringing a child who is not receiving a service, please reach out beforehand — we may not always be able to accommodate this depending on how busy we are."],
            },
        ],
    },
    {
        title: 'At the Salon',
        items: [
            {
                q: 'How should I prepare my hair for my appointment?',
                a: ['Please arrive with clean, dry and detangled hair. You should arrive with your curls in their natural state. No buns, clips or hair ties please, as they alter the natural curl pattern.'],
            },
            {
                q: 'How long will my appointment take?',
                a: [
                    'Appointment times vary depending on the service, stylist, hair length, density, and the amount of detangling or additional care needed. Express cuts typically take about 45 minutes, while custom curl cuts may take 1–1½ hours. Tight-curl services can take approximately 2½–3 hours.',
                    'Color services generally range from 2–3½ hours, while more involved appointments—such as highlights with a haircut or corrective color—may take 4–6 hours. Your stylist can give you a more personalized time estimate when booking.',
                ],
            },
            {
                q: 'What should I bring with me?',
                a: ['Please bring a list of products that you currently use on your hair so that your stylist may better understand your current daily routine.'],
            },
            {
                q: 'What if I need to reschedule?',
                a: ["We kindly ask for 48 hours' notice to cancel or reschedule your appointment. Cancellations or changes made within that window will be charged 100% of the reserved service total using the card on file. We understand things come up, and we appreciate your understanding as this policy helps us respect our stylists' time and other guests waiting for appointments."],
            },
        ],
    },
    {
        title: 'Curl Services',
        items: [
            {
                q: 'How do I know which stylist or technique is right for my curls?',
                a: ["Every stylist at Studio Within is trained in curly cutting, with varying levels of advanced education reflected in their stylist level. During your consultation, your stylist will recommend the best technique for you based on your curl type, routine, product habits, and goals — you're in great hands with anyone on our team. Want to browse our stylists? [Click here](/meet-the-team/) to meet everyone."],
            },
            {
                q: 'Do you offer men’s curly cuts?',
                a: ['Of course! At Studio Within, curly cuts are listed as Short, Medium, or Long rather than men’s or women’s cuts. That’s because every curl cut is customized to the individual — your curl pattern, density, shape, routine, and goals all play a part. It’s less about fitting into a standard haircut category and more about creating a cut that works for your curls.'],
            },
            {
                q: 'What should I expect at my curly haircut experience?',
                a: ['Your stylist will have a full consultation with you before starting. You will receive a dry curly haircut, wash and conditioning, a personalized step-by-step tutorial on how to style your curls, drying time, and a refined cut at the end if needed.'],
            },
            {
                q: 'Do you offer gift cards?',
                a: [`Yes! Please call, text, or ask us during your next visit if you'd like to purchase one for yourself or someone else: [${PHONE_DISPLAY}](${PHONE_HREF}).`],
            },
        ],
    },
]

// Answer text without link markup, for the FAQ structured data Google reads
export const plainAnswer = (a: string[]) => a.join(' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
