import { lazy, Suspense, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import NavigationBar from './components/NavigationBar/NavigationBar';
import NavigationBarSmallScreen from './components/NavigationBarSmallScreen/NavigationBarSmallScreen';
import Footer from './components/Footer/Footer';
import PageLoader from './components/PageLoader/PageLoader';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import { publicUrl } from './utils/publicUrl';
import { lazyWithImages } from './utils/preloadImages';
import { useMangomintSameTab } from './utils/useMangomintSameTab';

import './style/App.scss';
import './pages/page.scss'; // shared .page layout, used by every page

// Each page waits (up to 1.5s) for the images at its top, so it shows up with them
// already there. Keep these lists in sync with the first image(s) on each page,
// and keep them short: only what's visible without scrolling.
const LOGO = publicUrl('/logos/white_primary_logo-840.webp')
const stylistPic = (file: string) => publicUrl(`/images/meet_the_team/${file}`)

const HomePage = lazyWithImages(() => import('./pages/HomePage/HomePage'), [
  LOGO,
  { // same src/srcSet/sizes as the hero <img> in HomePage.tsx
    src: publicUrl('/images/homepage/homepage_HERO.webp'),
    srcSet: `${publicUrl('/images/homepage/homepage_HERO-800.webp')} 800w, ${publicUrl('/images/homepage/homepage_HERO.webp')} 1400w`,
    sizes: '100vw',
  },
]);
const Landing = lazyWithImages(() => import('./pages/Landing/Landing'), async () => [
  LOGO,
  (await import('./pages/Landing/landing_video.jpg')).default, // the video's poster
]);
const Policies = lazyWithImages(() => import('./pages/Policies/Policies'), [publicUrl('/images/policies/policies3.webp')]);
const Products = lazyWithImages(() => import('./pages/Products/Products'), [publicUrl('/images/product/product1.webp')]);
const FAQs = lazy(() => import('./pages/FAQs/FAQs'));
const Careers = lazy(() => import('./pages/Careers/Careers'));
const GetInTouch = lazyWithImages(() => import('./pages/GetInTouch/GetInTouch'), [publicUrl('/images/get_in_touch/get_in_touch1.webp')]);
const Services = lazyWithImages(() => import('./pages/Services/Services'), [publicUrl('/images/services/services1.webp')]);
// First row of stylist cards
const MeetTheTeam = lazyWithImages(() => import('./pages/MeetTheTeam/MeetTheTeam'), async () => {
  const { stylist_info } = await import('./pages/MeetTheTeam/stylists_info')
  return stylist_info.slice(0, 4).map(s => stylistPic(s.stylist_info_body.body_stylist_pic))
});
// The stylist comes from the URL (/meet-the-team/<stylist_id>)
const SingleStylist = lazyWithImages(() => import('./pages/MeetTheTeam/StylistPage'), async () => {
  const { stylist_info } = await import('./pages/MeetTheTeam/stylists_info')
  const id = decodeURIComponent(window.location.pathname.replace(/\/+$/, '').split('/').pop() ?? '')
  const stylist = stylist_info.find(s => s.stylist_id === id)
  return stylist ? [stylistPic(stylist.stylist_info_body.body_stylist_pic)] : []
});
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  // Each new page fades in softly. Not the first page shown: on the live site that one
  // arrives already drawn (pre-rendered), and fading it in would only hide it longer.
  const { pathname } = useLocation()
  const firstPath = useRef(pathname)
  const hasNavigated = useRef(false)
  if (pathname !== firstPath.current) hasNavigated.current = true

  // Phones: "Book now" opens Mangomint in the same tab instead of a new one
  useMangomintSameTab()

  return (
    <div className="App flex flex-column col-12">
      {/* Both menus are rendered; CSS in App.scss shows one per screen size, so nothing jumps */}
      <div className="nav-desktop"><NavigationBar/></div>
      <div className="nav-mobile"><NavigationBarSmallScreen/></div>

      <ScrollToTop />
      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          {/* key: a new wrapper per page, so the fade replays on every page change */}
          <div key={pathname} className={hasNavigated.current ? 'page-fade-in' : undefined}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home-page" element={<HomePage />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/products" element={<Products />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact-us" element={<GetInTouch />} />
            <Route path="/meet-the-team" element={<MeetTheTeam />} />
            <Route path="/meet-the-team/:stylistId" element={<SingleStylist />} />
            <Route path="/services" element={<Services />} />
            <Route path="*"element={<NotFound />} />
          </Routes>
          </div>
        </Suspense>
      </main>

      <Footer/>
    </div>
  )
}

export default App
