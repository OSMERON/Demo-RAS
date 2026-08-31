import { Quote, Star } from "lucide-react";

const reviews = [
  "Customers highlight professional drivers who understand the needs of busy dealerships.",
  "Public feedback repeatedly mentions reliable service and helpful office communication.",
  "Long-term customers describe the company as professional, consistent and dependable.",
];

export function ReviewsSection() {
  return (
    <section className="reviews-section" aria-labelledby="reviews-title">
      <div className="page-container">
        <div className="section-intro">
          <p className="eyebrow">Customer confidence</p>
          <h2 id="reviews-title">Service recognised by customers</h2>
          <p>Representative presentation based on themes from existing public customer reviews.</p>
        </div>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review}>
              <Quote className="review-card__quote" aria-hidden="true" />
              <div className="review-card__stars" aria-label="Five star review">
                {Array.from({ length: 5 }).map((_, index) => <Star key={index} aria-hidden="true" />)}
              </div>
              <p>{review}</p>
              <span>Existing public review theme</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
