import './footer.scss'
import { useLocation } from 'react-router-dom'

const Footer = () => {
    const pageShowing = useLocation().pathname
    return (
        <footer className={ pageShowing === '/' ? 'hide': 'footer'}>
            <h1 className="m-0">FOOTER</h1>
        </footer>
    )
}

export default Footer