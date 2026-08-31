import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { Link } from "react-router-dom";

import { businessContact } from "../data/site";

const servicePoints = [
  "Driven and transported vehicle movements",
  "Supported by an experienced operations team",
  "Professional nationwide coverage",
];

export function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <img
        className="home-hero__image"
        src={`${import.meta.env.VITE_BASE_URL as string}images/response-able-vehicle-logistics-hero.webp`}
        alt="Professional vehicle logistics driver beside a vehicle transporter at a dealership"
      />
      <div className="home-hero__overlay" />

      <div className="page-container home-hero__inner">
        <div className="home-hero__copy">
          <p className="eyebrow">Nationwide vehicle movement specialists</p>
          <h1 id="home-hero-title">Vehicle logistics. Done right.</h1>
          <p className="home-hero__lead">
            Professional driven and transported vehicle movements across the UK,
            supported by an experienced team focused on reliable service.
          </p>

          <div className="home-hero__actions">
            <Link className="hero-button hero-button--primary" to="/request-a-quote">
              Request a Quote
              <ArrowRight aria-hidden="true" />
            </Link>
            <a className="hero-button hero-button--secondary" href={businessContact.bookingsPhoneHref}>
              <Phone aria-hidden="true" />
              Call {businessContact.bookingsPhoneDisplay}
            </a>
          </div>

          <ul className="home-hero__points" aria-label="Service highlights">
            {servicePoints.map((point) => (
              <li key={point}>
                <CheckCircle2 aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
