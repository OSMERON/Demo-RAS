import {
  Calculator,
  Headphones,
  Network,
  Route,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import { CtaBand } from "../components/CtaBand";
import { PageHero } from "../components/PageHero";
import { businessContact } from "../data/site";

const teams = [
  { icon: Network, title: "Management", text: "Company direction, service standards and operational oversight." },
  { icon: Route, title: "Planning", text: "Route planning, movement coordination and capacity management." },
  { icon: Headphones, title: "Driver operations", text: "Day-to-day driver support, updates and movement communication." },
  { icon: TrendingUp, title: "Sales and bookings", text: "Customer enquiries, service requirements and booking support." },
  { icon: Calculator, title: "Accounts", text: "Invoice, payment and approved contractor expense enquiries." },
];

export function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="The team"
        title="People behind every movement"
        description="A 25-person head office team supports customers, drivers and transport operations across the UK."
        icon={UsersRound}
      />

      <section className="content-section">
        <div className="page-container">
          <div className="section-intro">
            <p className="eyebrow">Head office support</p>
            <h2>Specialist functions working as one team</h2>
            <p>
              Clear ownership across planning, driver operations, sales and accounts helps
              keep customers informed and vehicle movements coordinated.
            </p>
          </div>

          <div className="team-grid">
            {teams.map(({ icon: Icon, title, text }) => (
              <article className="team-card" key={title}>
                <span><Icon aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section content-section--blue">
        <div className="page-container department-contacts">
          <div>
            <p className="eyebrow">Contact the right team</p>
            <h2>Direct routes for common enquiries</h2>
          </div>
          <div className="department-contact-grid">
            <article>
              <strong>Bookings</strong>
              <a href={businessContact.bookingsPhoneHref}>{businessContact.bookingsPhoneDisplay}</a>
              <a href={businessContact.bookingsEmailHref}>{businessContact.bookingsEmail}</a>
            </article>
            <article>
              <strong>Recruitment</strong>
              <a href={businessContact.recruitmentPhoneHref}>{businessContact.recruitmentPhoneDisplay}</a>
              <a href={businessContact.recruitmentEmailHref}>{businessContact.recruitmentEmail}</a>
            </article>
            <article>
              <strong>Accounts</strong>
              <a href={businessContact.accountsPhoneHref}>{businessContact.accountsPhoneDisplay}</a>
              <a href={businessContact.accountsEmailHref}>{businessContact.accountsEmail}</a>
            </article>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
