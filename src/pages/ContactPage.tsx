import { FormEvent, useState } from "react";
import { Calculator, Mail, MapPin, MessageSquareText, Phone, UsersRound } from "lucide-react";

import { PageHero } from "../components/PageHero";
import { businessContact } from "../data/site";

const departments = [
  {
    icon: MessageSquareText,
    title: "Bookings & enquiries",
    phone: businessContact.bookingsPhoneDisplay,
    phoneHref: businessContact.bookingsPhoneHref,
    email: businessContact.bookingsEmail,
    emailHref: businessContact.bookingsEmailHref,
  },
  {
    icon: UsersRound,
    title: "Driver recruitment",
    phone: businessContact.recruitmentPhoneDisplay,
    phoneHref: businessContact.recruitmentPhoneHref,
    email: businessContact.recruitmentEmail,
    emailHref: businessContact.recruitmentEmailHref,
  },
  {
    icon: Calculator,
    title: "Accounts",
    phone: businessContact.accountsPhoneDisplay,
    phoneHref: businessContact.accountsPhoneHref,
    email: businessContact.accountsEmail,
    emailHref: businessContact.accountsEmailHref,
  },
];

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="Speak with the right team"
        description="Use the direct contact details below or complete the demonstration enquiry form."
        icon={Phone}
      />

      <section className="content-section">
        <div className="page-container contact-card-grid">
          {departments.map(({ icon: Icon, title, phone, phoneHref, email, emailHref }) => (
            <article className="contact-card" key={title}>
              <span><Icon aria-hidden="true" /></span>
              <h2>{title}</h2>
              <a href={phoneHref}><Phone aria-hidden="true" />{phone}</a>
              <a href={emailHref}><Mail aria-hidden="true" />{email}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section content-section--muted">
        <div className="page-container contact-layout">
          <div className="contact-form-panel">
            <p className="eyebrow">Send an enquiry</p>
            <h2>Tell us how we can help</h2>
            <p className="form-demo-notice">Demonstration only. This form does not send or store information.</p>

            {submitted ? (
              <div className="form-success" role="status">
                <h3>Demonstration complete</h3>
                <p>No message was sent. On a live website, the office team would receive the enquiry here.</p>
                <button type="button" onClick={() => setSubmitted(false)}>Create another enquiry</button>
              </div>
            ) : (
              <form className="enquiry-form" onSubmit={handleSubmit}>
                <label>
                  Enquiry type
                  <select name="enquiryType" required defaultValue="">
                    <option value="" disabled>Select a department</option>
                    <option>Bookings and vehicle movements</option>
                    <option>Driver recruitment</option>
                    <option>Accounts</option>
                    <option>Other</option>
                  </select>
                </label>
                <div className="form-row">
                  <label>Full name<input name="name" autoComplete="name" required /></label>
                  <label>Email address<input name="email" autoComplete="email" required type="email" /></label>
                </div>
                <label>Phone number<input name="phone" autoComplete="tel" type="tel" /></label>
                <label>Your message<textarea name="message" required rows={6} /></label>
                <label className="checkbox-field">
                  <input name="contactConsent" required type="checkbox" />
                  <span>I agree to be contacted about this enquiry.</span>
                </label>
                <label className="checkbox-field">
                  <input name="marketingConsent" type="checkbox" />
                  <span>I would like to receive relevant service updates.</span>
                </label>
                <button className="quote-button" type="submit">Demonstrate submission</button>
              </form>
            )}
          </div>

          <aside className="office-panel">
            <MapPin aria-hidden="true" />
            <p className="eyebrow">Head office</p>
            <h2>Response-Able Solutions Ltd</h2>
            <p>{businessContact.address}</p>
            <a href="https://www.google.com/maps/search/?api=1&query=1+Oakwood+Court+Little+Oak+Drive+Annesley+NG15+0DR" rel="noreferrer" target="_blank">Open address in Google Maps</a>
            <small>Visits should be arranged with the office in advance.</small>
          </aside>
        </div>
      </section>
    </>
  );
}
