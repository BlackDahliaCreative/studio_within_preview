"use strict";
exports.__esModule = true;
exports.navLinksDropdown = exports.navLinks = exports.HOME_PATH = void 0;
// Menu links shared by the desktop and phone menus. The logo is the home link.
exports.HOME_PATH = '/home-page/';
exports.navLinks = [
    { to: '/home-page/', label: 'Home' },
    { to: '/meet-the-team/', label: 'Meet the Team' },
    { to: '/product/', label: 'Product' },
    { to: '/services/', label: 'Services' },
];
// Links under "Get In Touch" (a dropdown on desktop, listed after the others on phones)
exports.navLinksDropdown = [
    { to: '/contact-us/', label: 'Contact Us' },
    { to: '/faqs/', label: 'FAQs' },
    { to: '/policies/', label: 'Policies' },
    { to: '/careers/', label: 'Careers' },
];
