import { lazy, ComponentType } from 'react'

// How long a page waits for its top images before showing anyway (slow connections)
export const IMAGE_WAIT_MS = 1500

export type PreloadImage = string | { src: string; srcSet?: string; sizes?: string }

// Starts downloading one image. Resolves when it's ready, fails, or after `maxWait`,
// so a broken or slow image never blocks the page.
// Pass srcSet/sizes when the <img> has them, so the browser picks (and caches) the same file.
export const preloadImage = (image: PreloadImage, maxWait = IMAGE_WAIT_MS): Promise<void> =>
    new Promise(resolve => {
        if (typeof window === 'undefined') return resolve() // build-time render: nothing to load

        const { src, srcSet, sizes } = typeof image === 'string' ? { src: image } : image
        const img = new Image()
        const done = () => {
            clearTimeout(timer)
            resolve()
        }
        const timer = setTimeout(done, maxWait)
        img.onload = done
        img.onerror = done
        if (sizes) img.sizes = sizes
        if (srcSet) img.srcset = srcSet
        img.src = src
    })

// Like React's lazy(), but the page also waits for its top images, so it appears with
// them already in place instead of popping them in a moment later. Until then the
// <Suspense> fallback (the page loader) shows.
// `images` can be a function (sync or async), for pages whose images depend on the URL
// or on data that should stay out of the main bundle.
export const lazyWithImages = <T extends ComponentType<any>>(
    load: () => Promise<{ default: T }>,
    images: PreloadImage[] | (() => PreloadImage[] | Promise<PreloadImage[]>),
) =>
    lazy(async () => {
        const waitForImages = async () => {
            if (typeof window === 'undefined') return // build-time render
            const list = typeof images === 'function' ? await images() : images
            await Promise.all(list.map(img => preloadImage(img)))
        }
        const [page] = await Promise.all([load(), waitForImages().catch(() => undefined)])
        return page
    })
