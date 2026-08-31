export const primaryNavigation = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Our Services", href: "/our-services" },
  { label: "Contractors", href: "/contractors" },
  { label: "The Team", href: "/the-team" },
  { label: "Contact Us", href: "/contact-us" },
] as const;

export const businessContact = {
  bookingsPhoneDisplay: "01623 238292",
  bookingsPhoneHref: "tel:+441623238292",
  bookingsEmail: "Bookings@car-movers.co.uk",
  bookingsEmailHref: "mailto:Bookings@car-movers.co.uk",
  recruitmentPhoneDisplay: "01623 259495",
  recruitmentPhoneHref: "tel:+441623259495",
  recruitmentEmail: "Recruitment@car-movers.co.uk",
  recruitmentEmailHref: "mailto:Recruitment@car-movers.co.uk",
  accountsPhoneDisplay: "01623 397944",
  accountsPhoneHref: "tel:+441623397944",
  accountsEmail: "accounts@car-movers.co.uk",
  accountsEmailHref: "mailto:accounts@car-movers.co.uk",
  quoteEmailHref:
    "mailto:Bookings@car-movers.co.uk?subject=Vehicle%20movement%20quote%20request",
  address: "1 Oakwood Court, Little Oak Drive, Annesley, NG15 0DR",
} as const;

export const legalLinks = {
  privacy: "https://www.responseablesolutions.co.uk/privacy-policy/",
  terms:
    "https://www.responseablesolutions.co.uk/wp-content/uploads/2025/07/Terms-Conditions-Logistics-2025.pdf",
} as const;
