import { Link } from "react-router-dom";

import { businessContact, legalLinks, primaryNavigation } from "../data/site";
import { BrandMark } from "./BrandMark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-container site-footer__grid site-footer__grid--expanded">
        <div>
          <BrandMark />
          <p className="site-footer__statement">
            Professional nationwide vehicle movement services. Driven to perfection.
          </p>
          <p className="site-footer__address">{businessContact.address}</p>
        </div>

        <div className="site-footer__links">
          <p>Website</p>
          {primaryNavigation.map((item) => (
            <Link key={item.href} to={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="site-footer__contact">
          <p>Bookings &amp; enquiries</p>
          <a href={businessContact.bookingsPhoneHref}>
            {businessContact.bookingsPhoneDisplay}
          </a>
          <a href={businessContact.bookingsEmailHref}>
            {businessContact.bookingsEmail}
          </a>
          <Link className="site-footer__quote" to="/request-a-quote">
            Request a Quote
          </Link>
        </div>

        <div className="site-footer__notice">
          <p>Concept demonstration</p>
          <span>No production systems or customer records are connected.</span>
          <a href={legalLinks.terms} rel="noreferrer" target="_blank">
            Terms &amp; Conditions
          </a>
          <a href={legalLinks.privacy} rel="noreferrer" target="_blank">
            Privacy Policy
          </a>
        </div>
      </div>

      <div className="site-footer__base">
        <div className="page-container">
          <span>Response-Able Solutions Ltd. website redesign concept</span>
          <span>Prepared for management review</span>
        </div>
      </div>
    </footer>
  );
}
