import { Building2, Handshake, MapPinned, Network, UsersRound } from "lucide-react";

import { CtaBand } from "../components/CtaBand";
import { PageHero } from "../components/PageHero";

const timeline = [
  { year: "2006", title: "A focused beginning", text: "The company began with a single set of trade plates and a commitment to first-class vehicle logistics." },
  { year: "Growth", title: "Expanded capability", text: "Response-Able developed a nationwide driver network, vehicle transport capacity and specialist office support." },
  { year: "Today", title: "A nationwide operation", text: "More than 100 trade plate drivers are supported by a 25-person head office team and three service divisions." },
];

const values = [
  { icon: Handshake, title: "Working relationships", text: "Professional service for customers, dealerships and delivery recipients." },
  { icon: MapPinned, title: "Nationwide reach", text: "Vehicle movements supported across the United Kingdom." },
  { icon: UsersRound, title: "Experienced people", text: "Drivers and office teams working together around each requirement." },
  { icon: Network, title: "Coordinated support", text: "Planning, bookings, driver operations, sales and accounts functions." },
];

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Response-Able"
        title="Vehicle logistics built through experience"
        description="An established UK vehicle movement specialist with nationwide capability and a practical focus on customer relationships."
        icon={Building2}
      />

      <section className="content-section">
        <div className="page-container split-intro">
          <div>
            <p className="eyebrow">Our story</p>
            <h2>From one set of trade plates to nationwide coverage</h2>
          </div>
          <div className="prose-copy">
            <p>
              Response-Able Solutions started in 2006 with the purpose of providing
              professional vehicle collection and delivery services.
            </p>
            <p>
              The business has grown into a nationwide operation with driven and transported
              vehicle movement options, supported by dedicated office teams.
            </p>
          </div>
        </div>
      </section>

      <section className="timeline-section">
        <div className="page-container timeline-grid">
          {timeline.map((item) => (
            <article className="timeline-card" key={item.year}>
              <span>{item.year}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section content-section--blue">
        <div className="page-container">
          <div className="section-intro section-intro--center">
            <p className="eyebrow">What supports the service</p>
            <h2>People, planning and nationwide capability</h2>
          </div>
          <div className="values-grid">
            {values.map(({ icon: Icon, title, text }) => (
              <article className="value-card" key={title}>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
