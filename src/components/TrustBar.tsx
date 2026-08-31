import { Building2, CalendarDays, MapPinned, UsersRound } from "lucide-react";

const trustFacts = [
  {
    icon: CalendarDays,
    value: "Since 2006",
    label: "Established experience",
  },
  {
    icon: UsersRound,
    value: "100+ drivers",
    label: "Nationwide driver network",
  },
  {
    icon: Building2,
    value: "25-person team",
    label: "Head office support",
  },
  {
    icon: MapPinned,
    value: "UK-wide",
    label: "Vehicle movement coverage",
  },
];

export function TrustBar() {
  return (
    <section className="trust-bar" aria-label="Response-Able Solutions at a glance">
      <div className="page-container trust-bar__grid">
        {trustFacts.map(({ icon: Icon, value, label }) => (
          <div className="trust-fact" key={value}>
            <span className="trust-fact__icon">
              <Icon aria-hidden="true" />
            </span>
            <span>
              <strong>{value}</strong>
              <small>{label}</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
