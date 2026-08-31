import { CalendarCheck2, ClipboardList, KeyRound, MapPinCheck } from "lucide-react";

const steps = [
  { icon: ClipboardList, number: "01", title: "Share the details", text: "Provide the vehicle, collection, delivery and preferred movement information." },
  { icon: CalendarCheck2, number: "02", title: "Office review", text: "The team reviews the requirement, availability and any information still needed." },
  { icon: KeyRound, number: "03", title: "Confirm the movement", text: "Final pricing and arrangements remain subject to office confirmation." },
  { icon: MapPinCheck, number: "04", title: "Collection and delivery", text: "The agreed driven or transported movement is completed through the approved process." },
];

export function ProcessSection() {
  return (
    <section className="process-section" aria-labelledby="process-title">
      <div className="page-container">
        <div className="section-intro section-intro--center">
          <p className="eyebrow">A clearer customer journey</p>
          <h2 id="process-title">From enquiry to vehicle movement</h2>
          <p>A simple route helps customers provide useful details while management retains operational control.</p>
        </div>
        <div className="process-grid">
          {steps.map(({ icon: Icon, number, title, text }) => (
            <article className="process-step" key={number}>
              <span className="process-step__number">{number}</span>
              <span className="process-step__icon"><Icon aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
