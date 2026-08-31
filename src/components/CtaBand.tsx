import { ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";

import { businessContact } from "../data/site";

type CtaBandProps = {
  title?: string;
  description?: string;
};

export function CtaBand({
  title = "Ready to discuss your next vehicle movement?",
  description = "Share the collection, delivery and vehicle details. The office team retains control of final pricing and availability.",
}: CtaBandProps) {
  return (
    <section className="cta-band">
      <div className="page-container cta-band__inner">
        <div>
          <p className="eyebrow">Your next step</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="cta-band__actions">
          <Link className="hero-button hero-button--primary" to="/request-a-quote">
            Request a Quote
            <ArrowRight aria-hidden="true" />
          </Link>
          <a className="hero-button hero-button--secondary" href={businessContact.bookingsPhoneHref}>
            <Phone aria-hidden="true" />
            Call the office
          </a>
        </div>
      </div>
    </section>
  );
}
