import { BadgeCheck, Headphones, Map, ShieldCheck } from "lucide-react";

const reasons = [
  { icon: BadgeCheck, title: "Established experience", text: "A vehicle logistics business with a history dating from 2006." },
  { icon: Map, title: "Nationwide coverage", text: "A UK-wide driver network supported by vehicle transport capability." },
  { icon: Headphones, title: "Office support", text: "Dedicated booking, planning, driver and customer support functions." },
  { icon: ShieldCheck, title: "Clear confirmation", text: "Final pricing, availability and operational decisions remain under company control." },
];

export function WhySection() {
  return (
    <section className="why-section" aria-labelledby="why-title">
      <div className="page-container why-section__layout">
        <div className="why-section__lead">
          <p className="eyebrow">Why Response-Able</p>
          <h2 id="why-title">Built around reliable working relationships</h2>
          <p>
            The redesign brings the company history, nationwide capability and service support
            into one clear customer message.
          </p>
          <blockquote>“Driven to perfection” reflects both vehicle movements and the relationships behind them.</blockquote>
        </div>
        <div className="why-grid">
          {reasons.map(({ icon: Icon, title, text }) => (
            <article className="why-card" key={title}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
