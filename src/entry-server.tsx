// Build-time only: renders one page of the app to an HTML string.
// scripts/prerender.js calls render() for every page in site.config.json.
// Nothing here runs in the visitor's browser.

import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider, HelmetServerState } from 'react-helmet-async'
import { Writable } from 'node:stream'
import App from './App'
import { routerBasename } from './utils/publicUrl'
import { stylist_info } from './pages/MeetTheTeam/stylists_info'

export type RenderResult = { html: string; head: string }

// Pages built from data rather than listed in site.config.json: one per stylist.
// scripts/prerender.js renders these too and adds them to the sitemap, so each
// bio is a real HTML file (otherwise GitHub Pages would answer with a 404).
export const extraPages = stylist_info.map((s) => ({
    path: `/meet-the-team/${s.stylist_id}`,
    changefreq: 'monthly',
    priority: '0.6',
}))

export const render = (path: string): Promise<RenderResult> =>
    new Promise((resolve, reject) => {
        const helmetContext: { helmet?: HelmetServerState } = {}
        let html = ''

        const sink = new Writable({
            write(chunk, _encoding, done) {
                html += chunk.toString()
                done()
            },
        })

        sink.on('finish', () => {
            const h = helmetContext.helmet
            const head = h
                ? [h.title.toString(), h.meta.toString(), h.link.toString(), h.script.toString()].join('\n    ')
                : ''
            resolve({ html, head })
        })

        const stream = renderToPipeableStream(
            <React.StrictMode>
                <HelmetProvider context={helmetContext}>
                    <StaticRouter location={routerBasename + path} basename={routerBasename}>
                        <App />
                    </StaticRouter>
                </HelmetProvider>
            </React.StrictMode>,
            {
                // Wait until lazy-loaded pages are ready, so the HTML has the full page, not the spinner
                onAllReady() {
                    stream.pipe(sink)
                },
                onShellError: reject,
                onError: reject,
            }
        )
    })
