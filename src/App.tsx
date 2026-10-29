import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import NavigationBar from './components/NavigationBar/NavigationBar';
import NavigationBarSmallScreen from './components/NavigationBarSmallScreen/NavigationBarSmallScreen';
import Footer from './components/Footer/Footer';
import PageLoader from './components/PageLoader/PageLoader';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

import './style/App.scss';
import './pages/page.scss'; // shared .page layout, used by every page

const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const Landing = lazy(() => import('./pages/Landing/Landing'));
const Policies = lazy(() => import('./pages/Policies/Policies'));
const FAQs = lazy(() => import('./pages/FAQs/FAQs'));
const Careers = lazy(() => import('./pages/Careers/Careers'));
const GetInTouch = lazy(() => import('./pages/GetInTouch/GetInTouch'));
const MeetTheTeam = lazy(() => import('./pages/MeetTheTeam/MeetTheTeam'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <div className="App flex flex-column col-12">
      {/* Both menus are rendered; CSS in App.scss shows one per screen size, so nothing jumps */}
      <div className="nav-desktop"><NavigationBar/></div>
      <div className="nav-mobile"><NavigationBarSmallScreen/></div>

      <ScrollToTop />
      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home-page" element={<HomePage />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/get-in-touch" element={<GetInTouch />} />
            <Route path="/meet-the-team" element={<MeetTheTeam />} />
            <Route path="*"element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer/>
    </div>
  )
}

export default App
