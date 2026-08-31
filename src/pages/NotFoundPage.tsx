import { ArrowLeft, MapPinOff } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="not-found">
      <div className="page-container not-found__inner">
        <MapPinOff aria-hidden="true" />
        <p className="eyebrow">Page not found</p>
        <h1>This route is not part of the demonstration</h1>
        <p>Return to the homepage to explore the completed website concept.</p>
        <Link className="quote-button" to="/"><ArrowLeft aria-hidden="true" /> Return home</Link>
      </div>
    </section>
  );
}
