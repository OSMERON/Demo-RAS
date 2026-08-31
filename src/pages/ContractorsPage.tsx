import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Fuel,
  Smartphone,
} from "lucide-react";

import { PageHero } from "../components/PageHero";
import { businessContact } from "../data/site";

const requirements = [
  "Aged 25 or over for insurance purposes",
  "A full UK driving licence held for at least two years",
  "No more than six penalty points, subject to approved endorsements",
  "Secure off-road parking at your home address",
  "Availability for at least three consecutive weekdays",
  "Comfortable working on a self-employed contractor basis",
];

const support = [
  { icon: BadgeCheck, title: "Familiarisation", text: "An introduction to the movement process and expected professional standards." },
  { icon: Fuel, title: "Working equipment", text: "Trade plates and fuel support are provided where appropriate for approved work." },
  { icon: Smartphone, title: "Digital reporting", text: "A mobile process supports vehicle condition reports and movement updates." },
  { icon: CalendarDays, title: "Operations support", text: "A dedicated office team coordinates movements and approved travel expenses." },
];

export function ContractorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Contract driver opportunities"
        title="Join a nationwide driver network"
        description="Explore the core requirements and support available to self-employed trade plate drivers working with Response-Able."
        icon={BriefcaseBusiness}
      />

      <section className="content-section">
        <div className="page-container contractor-layout">
          <div>
            <p className="eyebrow">Before you apply</p>
            <h2>Core contractor requirements</h2>
            <p className="contractor-layout__intro">
              Vehicle movement work suits confident, professional drivers who communicate well
              and take care when collecting and delivering customer vehicles.
            </p>
            <ul className="requirements-list">
              {requirements.map((requirement) => (
                <li key={requirement}>
                  <CheckCircle2 aria-hidden="true" />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="application-panel">
            <p className="eyebrow">Recruitment enquiries</p>
            <h2>Interested in working with us?</h2>
            <p>
              Contact the recruitment team for current opportunities, the full application
              process and confirmation of all eligibility requirements.
            </p>
            <a className="quote-button" href={businessContact.recruitmentEmailHref}>Email recruitment</a>
            <a href={businessContact.recruitmentPhoneHref}>{businessContact.recruitmentPhoneDisplay}</a>
            <small>Requirements shown here are a website demonstration and remain subject to company confirmation.</small>
          </aside>
        </div>
      </section>

      <section className="content-section content-section--muted">
        <div className="page-container">
          <div className="section-intro section-intro--center">
            <p className="eyebrow">Contractor support</p>
            <h2>Tools and people to support the working day</h2>
          </div>
          <div className="contractor-support-grid">
            {support.map(({ icon: Icon, title, text }) => (
              <article className="contractor-support-card" key={title}>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
