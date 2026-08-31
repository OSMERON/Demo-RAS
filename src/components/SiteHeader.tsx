import { Menu, Phone, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { Link, NavLink } from "react-router-dom";

import { businessContact, primaryNavigation } from "../data/site";
import { BrandMark } from "./BrandMark";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="concept-strip">
        <div className="page-container concept-strip__inner">
          <span>Website redesign concept</span>
          <span>Demonstration only. No live customer data.</span>
        </div>
      </div>

      <div className="contact-strip">
        <div className="page-container contact-strip__inner">
          <span>Nationwide vehicle movements</span>
          <a href={businessContact.bookingsPhoneHref}>
            <Phone aria-hidden="true" />
            Bookings &amp; enquiries: {businessContact.bookingsPhoneDisplay}
          </a>
        </div>
      </div>

      <div className="page-container site-header__main">
        <Link className="brand-link" to="/" aria-label="Response-Able Solutions home">
          <BrandMark />
        </Link>

        <nav className="desktop-navigation" aria-label="Primary navigation">
          {primaryNavigation.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
              end={item.href === "/"}
              key={item.href}
              to={item.href}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <Link className="quote-button" to="/request-a-quote">
            Request a Quote
          </Link>

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="mobile-menu-button" aria-label="Open navigation">
                <Menu aria-hidden="true" />
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="mobile-sheet__overlay" />
              <Dialog.Content className="mobile-sheet">
                <Dialog.Close className="mobile-sheet__close" aria-label="Close navigation">
                  <X aria-hidden="true" />
                </Dialog.Close>

                <div className="mobile-sheet__header">
                  <BrandMark />
                  <Dialog.Title>Website navigation</Dialog.Title>
                  <Dialog.Description>
                    Choose a page or start a representative quote request.
                  </Dialog.Description>
                </div>

                <nav className="mobile-navigation" aria-label="Mobile navigation">
                  {primaryNavigation.map((item) => (
                    <Dialog.Close asChild key={item.href}>
                      <NavLink
                        className={({ isActive }) => (isActive ? "is-active" : undefined)}
                        end={item.href === "/"}
                        to={item.href}
                      >
                        {item.label}
                      </NavLink>
                    </Dialog.Close>
                  ))}
                  <Dialog.Close asChild>
                    <Link className="mobile-navigation__quote" to="/request-a-quote">
                      Request a Quote
                    </Link>
                  </Dialog.Close>
                </nav>

                <div className="mobile-sheet__contact">
                  <p>Bookings &amp; enquiries</p>
                  <a href={businessContact.bookingsPhoneHref}>
                    {businessContact.bookingsPhoneDisplay}
                  </a>
                  <a href={businessContact.bookingsEmailHref}>
                    {businessContact.bookingsEmail}
                  </a>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
