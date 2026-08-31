import { CarFront, CheckCircle2, Route, Truck } from "lucide-react";
import { Link } from "react-router-dom";

import { CtaBand } from "../components/CtaBand";
import { PageHero } from "../components/PageHero";

const serviceDetails = [
  {
    icon: Route,
    title: "Driven Vehicle Movements",
    intro: "A professional driver collects the vehicle and delivers it by road using the agreed movement process.",
    points: ["Dealer-to-dealer and dealer-to-customer movements", "Fleet and customer collection requirements", "Nationwide planning and office support"],
  },
  {
    icon: CarFront,
    title: "Single Vehicle Transport",
    intro: "A single vehicle transporter supports movements where the vehicle should be carried rather than driven.",
    points: ["Avoids adding driven mileage", "Dedicated vehicle transport option", "Final suitability confirmed by the office"],
  },
  {
    icon: Truck,
    title: "Multi-Load Vehicle Transport",
    intro: "Multi-load transport supports planned movement of several vehicles between agreed sites.",
    points: ["Multiple vehicles within one planned movement", "Dealer, compound and customer-site requirements", "Movement planning subject to capacity and availability"],
  },
];

export function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Flexible options for vehicle movements"
        description="Driven and transported services arranged around the vehicle, route and customer requirement."
        icon={Truck}
      />

      <section className="content-section">
        <div className="page-container service-detail-list">
          {serviceDetails.map(({ icon: Icon, title, intro, points }, index) => (
            <article className="service-detail" key={title}>
              <div className="service-detail__icon"><Icon aria-hidden="true" /></div>
              <div>
                <span className="service-detail__number">0{index + 1}</span>
                <h2>{title}</h2>
                <p>{intro}</p>
                <ul>
                  {points.map((point) => <li key={point}><CheckCircle2 aria-hidden="true" />{point}</li>)}
                </ul>
                <Link to="/request-a-quote">Request this service</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section content-section--muted">
        <div className="page-container decision-panel">
          <div>
            <p className="eyebrow">Choosing a service</p>
            <h2>Not sure which movement type fits?</h2>
            <p>
              Provide the vehicle condition, route and preferred date. The office team reviews
              the details before confirming the suitable service, final price and availability.
            </p>
          </div>
          <Link className="quote-button" to="/request-a-quote">Start a quote request</Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
