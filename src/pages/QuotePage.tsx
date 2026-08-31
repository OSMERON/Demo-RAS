import { FormEvent, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CarFront,
  CheckCircle2,
  ClipboardCheck,
  LoaderCircle,
  MapPinned,
  RefreshCcw,
  Search,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";

import { businessContact } from "../data/site";
import {
  calculateRouteDistanceMiles,
  formatUkPostcode,
  isValidUkPostcode,
} from "../services/distanceService";
import {
  formatRegistrationNumber,
  type VerifiedVehicle,
  verifyVehicleRegistration,
} from "../services/vehicleService";

type QuoteDetails = {
  customerType: "Private customer" | "Business customer";
  service: "Driven movement" | "Transported movement";
  movementType: string;
  collectionPostcode: string;
  deliveryPostcode: string;
  registrationNumber: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleColour: string;
  motStatus: string;
  motExpiryDate: string;
  vehicleCondition: "Running" | "Non-running";
  preferredDate: string;
  fullName: string;
  email: string;
  phone: string;
  contactConsent: boolean;
};

const initialDetails: QuoteDetails = {
  customerType: "Private customer",
  service: "Driven movement",
  movementType: "Dealer to customer",
  collectionPostcode: "",
  deliveryPostcode: "",
  registrationNumber: "",
  vehicleMake: "",
  vehicleModel: "",
  vehicleColour: "",
  motStatus: "",
  motExpiryDate: "",
  vehicleCondition: "Running",
  preferredDate: "",
  fullName: "",
  email: "",
  phone: "",
  contactConsent: false,
};

const steps = [
  { number: 1, label: "Journey", icon: MapPinned },
  { number: 2, label: "Vehicle", icon: CarFront },
  { number: 3, label: "Contact", icon: UserRound },
  { number: 4, label: "Summary", icon: ClipboardCheck },
];

type VerificationStatus = "idle" | "checking" | "review" | "accepted" | "rejected";

function roundToFive(value: number) {
  return Math.ceil(value / 5) * 5;
}

export function QuotePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [details, setDetails] = useState<QuoteDetails>(initialDetails);
  const [distanceMiles, setDistanceMiles] = useState<number | null>(null);
  const [distanceError, setDistanceError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [verifiedVehicle, setVerifiedVehicle] = useState<VerifiedVehicle | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("idle");
  const [verificationError, setVerificationError] = useState("");

  const estimate = useMemo(() => {
    if (distanceMiles === null) return null;
    const base = details.service === "Driven movement" ? 65 : 130;
    const mileageRate = details.service === "Driven movement" ? 1.15 : 1.75;
    const conditionMultiplier = details.vehicleCondition === "Non-running" ? 1.15 : 1;
    const lower = roundToFive((base + distanceMiles * mileageRate) * conditionMultiplier);
    return { lower, upper: roundToFive(lower * 1.18) };
  }, [details.service, details.vehicleCondition, distanceMiles]);

  function setField<Key extends keyof QuoteDetails>(key: Key, value: QuoteDetails[Key]) {
    setDetails((current) => ({ ...current, [key]: value }));
  }

  function handlePostcodeChange(key: "collectionPostcode" | "deliveryPostcode", value: string) {
    setField(key, value);
    setDistanceMiles(null);
    setDistanceError("");
  }

  function handleRegistrationChange(value: string) {
    setField("registrationNumber", formatRegistrationNumber(value));
    setVerifiedVehicle(null);
    setVerificationStatus("idle");
    setVerificationError("");
    if (verificationStatus === "accepted") {
      setDetails((current) => ({
        ...current,
        registrationNumber: formatRegistrationNumber(value),
        vehicleMake: "",
        vehicleModel: "",
        vehicleColour: "",
        motStatus: "",
        motExpiryDate: "",
      }));
    }
  }

  async function verifyRegistration() {
    setVerificationError("");
    setVerifiedVehicle(null);
    const registrationNumber = formatRegistrationNumber(details.registrationNumber);
    if (registrationNumber.length < 2) {
      setVerificationError("Enter a vehicle registration number first.");
      return;
    }

    setDetails((current) => ({ ...current, registrationNumber }));
    setVerificationStatus("checking");
    try {
      const vehicle = await verifyVehicleRegistration(registrationNumber);
      setVerifiedVehicle(vehicle);
      setVerificationStatus("review");
    } catch (error) {
      setVerificationStatus("idle");
      setVerificationError(
        error instanceof Error ? error.message : "Vehicle verification failed.",
      );
    }
  }

  function acceptVerifiedVehicle() {
    if (!verifiedVehicle) return;
    setDetails((current) => ({
      ...current,
      registrationNumber: verifiedVehicle.registrationNumber,
      vehicleMake: verifiedVehicle.make === "Not provided" ? "" : verifiedVehicle.make,
      vehicleModel: verifiedVehicle.model === "Not provided" ? "" : verifiedVehicle.model,
      vehicleColour: verifiedVehicle.colour === "Not provided" ? "" : verifiedVehicle.colour,
      motStatus: verifiedVehicle.motStatus,
      motExpiryDate: verifiedVehicle.motExpiryDate ?? "",
    }));
    setVerificationStatus("accepted");
  }

  function rejectVerifiedVehicle() {
    setVerifiedVehicle(null);
    setVerificationStatus("rejected");
    setDetails((current) => ({
      ...current,
      vehicleMake: "",
      vehicleModel: "",
      vehicleColour: "",
      motStatus: "",
      motExpiryDate: "",
    }));
  }

  function resetVerification() {
    setVerifiedVehicle(null);
    setVerificationStatus("idle");
    setVerificationError("");
    setDetails((current) => ({
      ...current,
      registrationNumber: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleColour: "",
      motStatus: "",
      motExpiryDate: "",
    }));
  }

  async function calculateDistance() {
    setDistanceError("");
    setDistanceMiles(null);
    if (!isValidUkPostcode(details.collectionPostcode) || !isValidUkPostcode(details.deliveryPostcode)) {
      setDistanceError("Enter two complete UK postcodes, for example NG15 0DR.");
      return;
    }

    const collectionPostcode = formatUkPostcode(details.collectionPostcode);
    const deliveryPostcode = formatUkPostcode(details.deliveryPostcode);
    setDetails((current) => ({
      ...current,
      collectionPostcode,
      deliveryPostcode,
    }));

    setIsCalculating(true);
    try {
      const miles = await calculateRouteDistanceMiles(
        collectionPostcode,
        deliveryPostcode,
      );
      setDistanceMiles(miles);
    } catch (error) {
      setDistanceError(error instanceof Error ? error.message : "The route could not be calculated.");
    } finally {
      setIsCalculating(false);
    }
  }

  function completeQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (details.contactConsent) setCurrentStep(4);
  }

  function restart() {
    setDetails(initialDetails);
    setDistanceMiles(null);
    setDistanceError("");
    setVerifiedVehicle(null);
    setVerificationStatus("idle");
    setVerificationError("");
    setCurrentStep(1);
  }

  const emailSubject = encodeURIComponent("Vehicle movement quote request");
  const emailBody = encodeURIComponent(
    `Please review this vehicle movement enquiry.\n\nCollection: ${details.collectionPostcode}\nDelivery: ${details.deliveryPostcode}\nService: ${details.service}\nRegistration: ${details.registrationNumber || "Not provided"}\nVehicle: ${details.vehicleMake} ${details.vehicleModel}\nColour: ${details.vehicleColour || "Not provided"}\nMOT status: ${details.motStatus || "Not verified"}\nPreferred date: ${details.preferredDate}\n\nPlease confirm final pricing and availability.`,
  );

  return (
    <section className="quote-page">
      <div className="page-container quote-page__heading">
        <p className="eyebrow">Demonstration quote journey</p>
        <h1>Plan a vehicle movement</h1>
        <p>
          Provide the core journey details and view a representative estimate. Final service,
          pricing and availability remain subject to confirmation by Response-Able Solutions.
        </p>
      </div>

      <div className="page-container quote-shell">
        <ol className="quote-progress" aria-label="Quote progress">
          {steps.map(({ number, label, icon: Icon }) => (
            <li className={number === currentStep ? "is-current" : number < currentStep ? "is-complete" : ""} key={number}>
              <span>{number < currentStep ? <CheckCircle2 aria-hidden="true" /> : <Icon aria-hidden="true" />}</span>
              <small>Step {number}</small>
              <strong>{label}</strong>
            </li>
          ))}
        </ol>

        <div className="quote-panel">
          {currentStep === 1 && (
            <div className="quote-step">
              <div className="quote-step__heading">
                <span><MapPinned aria-hidden="true" /></span>
                <div><p>Step 1</p><h2>Journey details</h2></div>
              </div>

              <div className="choice-grid">
                <fieldset>
                  <legend>Customer type</legend>
                  {(["Private customer", "Business customer"] as const).map((option) => (
                    <label className="choice-card" key={option}>
                      <input checked={details.customerType === option} name="customerType" onChange={() => setField("customerType", option)} type="radio" />
                      <span>{option}</span>
                    </label>
                  ))}
                </fieldset>
                <fieldset>
                  <legend>Preferred service</legend>
                  {(["Driven movement", "Transported movement"] as const).map((option) => (
                    <label className="choice-card" key={option}>
                      <input checked={details.service === option} name="service" onChange={() => setField("service", option)} type="radio" />
                      <span>{option}</span>
                    </label>
                  ))}
                </fieldset>
              </div>

              <label>
                Movement type
                <select value={details.movementType} onChange={(event) => setField("movementType", event.target.value)}>
                  <option>Dealer to dealer</option>
                  <option>Dealer to customer</option>
                  <option>Customer to dealer</option>
                  <option>Customer to customer</option>
                  <option>Auction movement</option>
                  <option>Fleet movement</option>
                  <option>Storage movement</option>
                  <option>Other</option>
                </select>
              </label>

              <div className="postcode-grid">
                <label>Collection postcode<input autoCapitalize="characters" autoComplete="postal-code" placeholder="NG15 0DR" value={details.collectionPostcode} onChange={(event) => handlePostcodeChange("collectionPostcode", event.target.value)} /></label>
                <span className="postcode-grid__line" aria-hidden="true"><ArrowRight /></span>
                <label>Delivery postcode<input autoCapitalize="characters" autoComplete="postal-code" placeholder="B1 1BB" value={details.deliveryPostcode} onChange={(event) => handlePostcodeChange("deliveryPostcode", event.target.value)} /></label>
              </div>

              <button className="distance-button" disabled={isCalculating} onClick={calculateDistance} type="button">
                {isCalculating ? <LoaderCircle className="spin" aria-hidden="true" /> : <MapPinned aria-hidden="true" />}
                {isCalculating ? "Calculating driven route..." : "Calculate driven distance"}
              </button>

              {distanceError && (
                <div className="distance-message distance-message--error" role="alert">
                  <AlertCircle aria-hidden="true" />
                  <span>{distanceError}</span>
                </div>
              )}
              {distanceMiles !== null && (
                <div className="distance-message distance-message--success" role="status">
                  <CheckCircle2 aria-hidden="true" />
                  <span><strong>{distanceMiles.toFixed(1)} miles</strong> estimated driving route</span>
                </div>
              )}

              <div className="quote-step__actions quote-step__actions--end">
                <button className="quote-next" disabled={distanceMiles === null} onClick={() => setCurrentStep(2)} type="button">Continue to vehicle <ArrowRight aria-hidden="true" /></button>
              </div>

              <p className="map-attribution">
                UK postcode lookup uses <a href="https://postcodes.io/" rel="noreferrer" target="_blank">Postcodes.io</a>.
                Driving routes use <a href="https://project-osrm.org/" rel="noreferrer" target="_blank"> OSRM</a> and data from
                <a href="https://www.openstreetmap.org/copyright" rel="noreferrer" target="_blank"> OpenStreetMap contributors</a>.
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="quote-step">
              <div className="quote-step__heading">
                <span><CarFront aria-hidden="true" /></span>
                <div><p>Step 2</p><h2>Vehicle details</h2></div>
              </div>

              <section className="vehicle-verification" aria-labelledby="vehicle-verification-title">
                <div className="vehicle-verification__heading">
                  <span><ShieldCheck aria-hidden="true" /></span>
                  <div>
                    <h3 id="vehicle-verification-title">Verify the vehicle registration</h3>
                    <p>Optional. You may skip verification and enter the vehicle details manually.</p>
                  </div>
                </div>

                <div className="vehicle-verification__search">
                  <label>
                    Registration number
                    <input
                      autoCapitalize="characters"
                      autoComplete="off"
                      disabled={verificationStatus === "checking" || verificationStatus === "review" || verificationStatus === "accepted"}
                      onChange={(event) => handleRegistrationChange(event.target.value)}
                      placeholder="For example AB12 CDE"
                      value={details.registrationNumber}
                    />
                  </label>
                  <button
                    disabled={verificationStatus === "checking" || verificationStatus === "review" || verificationStatus === "accepted" || details.registrationNumber.length < 2}
                    onClick={verifyRegistration}
                    type="button"
                  >
                    {verificationStatus === "checking" ? <LoaderCircle className="spin" aria-hidden="true" /> : <Search aria-hidden="true" />}
                    {verificationStatus === "checking" ? "Checking..." : "Verify vehicle"}
                  </button>
                </div>

                <p className="vehicle-verification__demo">
                  Use <strong>AA19AAA</strong> to preview the verification journey before live DVSA credentials are connected.
                </p>

                {verificationError && (
                  <div className="vehicle-verification__message vehicle-verification__message--error" role="alert">
                    <AlertCircle aria-hidden="true" />
                    <span>{verificationError}</span>
                  </div>
                )}

                {verifiedVehicle && (verificationStatus === "review" || verificationStatus === "accepted") && (
                  <div className="vehicle-result">
                    <div className="vehicle-result__status">
                      <CheckCircle2 aria-hidden="true" />
                      <div>
                        <strong>{verificationStatus === "accepted" ? "Vehicle details accepted" : "Vehicle found. Are these details correct?"}</strong>
                        <span>{verifiedVehicle.source === "demo" ? "Demonstration data" : "DVSA MOT History API"}</span>
                      </div>
                    </div>

                    <dl className="vehicle-result__grid">
                      <div><dt>Registration</dt><dd>{verifiedVehicle.registrationNumber}</dd></div>
                      <div><dt>Make</dt><dd>{verifiedVehicle.make}</dd></div>
                      <div><dt>Model</dt><dd>{verifiedVehicle.model}</dd></div>
                      <div><dt>Colour</dt><dd>{verifiedVehicle.colour}</dd></div>
                      <div><dt>Fuel</dt><dd>{verifiedVehicle.fuelType}</dd></div>
                      <div><dt>Year</dt><dd>{verifiedVehicle.yearOfManufacture ?? "Not provided"}</dd></div>
                      <div className="vehicle-result__mot">
                        <dt>MOT status</dt>
                        <dd className={verifiedVehicle.motStatus === "Valid" ? "is-valid" : "is-warning"}>{verifiedVehicle.motStatus}</dd>
                      </div>
                      <div><dt>MOT expiry</dt><dd>{verifiedVehicle.motExpiryDate ? new Date(`${verifiedVehicle.motExpiryDate}T12:00:00`).toLocaleDateString("en-GB") : "Not provided"}</dd></div>
                    </dl>

                    {verifiedVehicle.source === "demo" && (
                      <p className="vehicle-result__demo-notice">This preview uses demonstration vehicle data. It is not a live vehicle record.</p>
                    )}

                    {verificationStatus === "review" ? (
                      <div className="vehicle-result__actions">
                        <button className="vehicle-accept" onClick={acceptVerifiedVehicle} type="button"><CheckCircle2 aria-hidden="true" /> Yes, details are correct</button>
                        <button className="vehicle-reject" onClick={rejectVerifiedVehicle} type="button"><XCircle aria-hidden="true" /> No, enter manually</button>
                      </div>
                    ) : (
                      <button className="vehicle-change" onClick={resetVerification} type="button">Check a different registration</button>
                    )}
                  </div>
                )}

                {verificationStatus === "rejected" && (
                  <div className="vehicle-verification__message vehicle-verification__message--manual" role="status">
                    <XCircle aria-hidden="true" />
                    <span>The verification was not accepted. Enter the correct vehicle details manually below.</span>
                  </div>
                )}
              </section>

              <div className="manual-entry-divider"><span>Vehicle information</span></div>

              <div className="form-row">
                <label>Vehicle make<input readOnly={verificationStatus === "accepted" && Boolean(details.vehicleMake)} required value={details.vehicleMake} onChange={(event) => setField("vehicleMake", event.target.value)} placeholder="For example Ford" /></label>
                <label>Vehicle model<input readOnly={verificationStatus === "accepted" && Boolean(details.vehicleModel)} required value={details.vehicleModel} onChange={(event) => setField("vehicleModel", event.target.value)} placeholder="For example Focus" /></label>
              </div>
              <div className="form-row">
                <label>Vehicle colour<input readOnly={verificationStatus === "accepted" && Boolean(details.vehicleColour)} value={details.vehicleColour} onChange={(event) => setField("vehicleColour", event.target.value)} placeholder="For example Blue" /></label>
                <label>
                  Vehicle condition
                  <select value={details.vehicleCondition} onChange={(event) => setField("vehicleCondition", event.target.value as QuoteDetails["vehicleCondition"])}>
                    <option>Running</option>
                    <option>Non-running</option>
                  </select>
                </label>
              </div>
              <label>Preferred movement date<input min={new Date().toISOString().slice(0, 10)} required type="date" value={details.preferredDate} onChange={(event) => setField("preferredDate", event.target.value)} /></label>
              <p className="form-help">Non-running vehicles and specialist requirements need manual review before a service is confirmed.</p>
              <div className="quote-step__actions">
                <button className="quote-back" onClick={() => setCurrentStep(1)} type="button">Back</button>
                <button className="quote-next" disabled={!details.vehicleMake.trim() || !details.vehicleModel.trim() || !details.preferredDate || verificationStatus === "review" || verificationStatus === "checking"} onClick={() => setCurrentStep(3)} type="button">Continue to contact <ArrowRight aria-hidden="true" /></button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <form className="quote-step" onSubmit={completeQuote}>
              <div className="quote-step__heading">
                <span><UserRound aria-hidden="true" /></span>
                <div><p>Step 3</p><h2>Your contact details</h2></div>
              </div>
              <div className="form-row">
                <label>Full name<input autoComplete="name" required value={details.fullName} onChange={(event) => setField("fullName", event.target.value)} /></label>
                <label>Email address<input autoComplete="email" required type="email" value={details.email} onChange={(event) => setField("email", event.target.value)} /></label>
              </div>
              <label>Phone number<input autoComplete="tel" required type="tel" value={details.phone} onChange={(event) => setField("phone", event.target.value)} /></label>
              <label className="checkbox-field">
                <input checked={details.contactConsent} required type="checkbox" onChange={(event) => setField("contactConsent", event.target.checked)} />
                <span>I agree to be contacted about this vehicle movement enquiry.</span>
              </label>
              <p className="form-demo-notice">Demonstration only. Details entered here are not sent or stored.</p>
              <div className="quote-step__actions">
                <button className="quote-back" onClick={() => setCurrentStep(2)} type="button">Back</button>
                <button className="quote-next" type="submit">View summary <ArrowRight aria-hidden="true" /></button>
              </div>
            </form>
          )}

          {currentStep === 4 && estimate && (
            <div className="quote-step quote-result">
              <span className="quote-result__icon"><CheckCircle2 aria-hidden="true" /></span>
              <p className="eyebrow">Representative demonstration</p>
              <h2>Your movement summary</h2>
              <p className="quote-result__lead">This is not a confirmed booking or official Response-Able price.</p>

              <div className="estimate-card">
                <small>Illustrative estimate range</small>
                <strong>£{estimate.lower} to £{estimate.upper}</strong>
                <span>including a {distanceMiles?.toFixed(1)} mile driving route</span>
              </div>

              <dl className="quote-summary">
                <div><dt>Journey</dt><dd>{details.collectionPostcode} to {details.deliveryPostcode}</dd></div>
                <div><dt>Service</dt><dd>{details.service}</dd></div>
                <div><dt>Movement</dt><dd>{details.movementType}</dd></div>
                {details.registrationNumber && <div><dt>Registration</dt><dd>{details.registrationNumber}</dd></div>}
                <div><dt>Vehicle</dt><dd>{details.vehicleMake} {details.vehicleModel}{details.vehicleColour ? `, ${details.vehicleColour.toLowerCase()}` : ""}, {details.vehicleCondition.toLowerCase()}</dd></div>
                {details.motStatus && <div><dt>MOT</dt><dd>{details.motStatus}{details.motExpiryDate ? ` until ${new Date(`${details.motExpiryDate}T12:00:00`).toLocaleDateString("en-GB")}` : ""}</dd></div>}
                <div><dt>Preferred date</dt><dd>{new Date(`${details.preferredDate}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</dd></div>
              </dl>

              <div className="confirmation-notice">
                <AlertCircle aria-hidden="true" />
                <p><strong>Company confirmation required.</strong> Final price, service suitability and availability must be confirmed by the office team.</p>
              </div>

              <div className="quote-result__actions">
                <a className="quote-button" href={`mailto:${businessContact.bookingsEmail}?subject=${emailSubject}&body=${emailBody}`}>Email the enquiry</a>
                <button className="quote-back" onClick={restart} type="button"><RefreshCcw aria-hidden="true" /> Start again</button>
              </div>
              <p className="form-demo-notice">No live price tables, customer records or production systems are connected to this concept.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
