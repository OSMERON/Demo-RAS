import type { LucideIcon } from "lucide-react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon?: LucideIcon;
};

export function PageHero({ eyebrow, title, description, icon: Icon }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-container page-hero__inner">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {Icon && (
          <span className="page-hero__icon">
            <Icon aria-hidden="true" />
          </span>
        )}
      </div>
    </section>
  );
}
