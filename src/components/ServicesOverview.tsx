import { ArrowRight, CarFront, CheckCircle2, Route, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Route,
    number: "01",
    title: "Driven Vehicle Movements",
    description:
      "A professional trade plate driver collects and delivers the vehicle by road, supported by the operations team.",
    benefits: ["Nationwide collection and delivery", "Dealer, fleet and customer movements"],
  },
  {
    icon: CarFront,
    number: "02",
    title: "Single Vehicle Transport",
    description:
      "A dedicated transporter carries one vehicle when the movement should avoid adding driven mileage.",
    benefits: ["Vehicle carried on a transporter", "Planned around the movement requirements"],
  },
  {
    icon: Truck,
    number: "03",
    title: "Multi-Load Transport",
    description:
      "Multi-load transport supports planned movement of several vehicles between dealerships, compounds or customer sites.",
    benefits: ["Several vehicles moved together", "Planned site-to-site movements"],
  },
];

export function ServicesOverview() {
  return (
    <section className="services-overview" aria-labelledby="services-overview-title">
      <div className="page-container">
        <div className="services-heading">
          <div>
            <p className="eyebrow">Our services</p>
            <h2 id="services-overview-title">The right vehicle movement for each requirement</h2>
          </div>
          <p className="services-heading__description">
            From professional driven delivery to transported movements, Response-Able supports
            vehicle movements across the UK.
          </p>
        </div>

        <div className="services-grid">
          {services.map(({ icon: Icon, number, title, description, benefits }) => (
            <article className="service-card" key={title}>
              <div className="service-card__top">
                <span className="service-card__icon"><Icon aria-hidden="true" /></span>
                <span className="service-card__number">{number}</span>
              </div>
              <h3>{title}</h3>
              <p className="service-card__description">{description}</p>
              <ul className="service-card__benefits">
                {benefits.map((benefit) => (
                  <li key={benefit}><CheckCircle2 aria-hidden="true" /><span>{benefit}</span></li>
                ))}
              </ul>
              <Link className="service-card__link" to="/our-services">
                Explore this service <ArrowRight aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
