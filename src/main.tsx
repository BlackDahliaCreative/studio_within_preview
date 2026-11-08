import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { routerBasename } from './utils/publicUrl'
import ReactDOM from 'react-dom/client'
import React from 'react'
import App from './App'

import './style/fonts'
import './style/index.scss'
// import './style/mangomint.scss'

const container = document.getElementById('root') as HTMLElement

const app = (
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter basename={routerBasename}>
                <App />
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>
)

// Built pages already contain the page's HTML (see scripts/prerender.js): React just
// "hydrates" it, attaching clicks and animations. In `npm start` the page starts empty.
// If the HTML was built for a different URL (e.g. /home-page without the end slash got
// the landing page's file), hydrating would keep the wrong page's bits, like a hidden
// menu, so the page is drawn fresh instead.
const trimSlashes = (p: string) => p.replace(/\/+$/, '') || '/'
const currentPath = trimSlashes(window.location.pathname.slice(routerBasename.length))
const builtFor = container.dataset.path

if (container.firstElementChild && builtFor && trimSlashes(builtFor) === currentPath) {
    ReactDOM.hydrateRoot(container, app)
} else {
    container.replaceChildren() // drop any HTML built for another page
    ReactDOM.createRoot(container).render(app)
}
