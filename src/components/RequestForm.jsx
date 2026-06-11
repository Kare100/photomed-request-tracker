import { useState } from "react";
import { PRODUCTS, REQUEST_TYPES, PRIORITIES } from "../data/options";
import { validateRequestForm } from "../utils/validation";

const initialFormState = {
  name: "",
  email: "",
  company: "",
  type: "",
  priority: "",
  message: "",
};

export default function RequestForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateRequestForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatusMessage("");
      return;
    }

    setErrors({});
    onSubmit(formData);
    setFormData(initialFormState);

    setStatusMessage("Thanks! Your request has been submitted.");
    setTimeout(() => setStatusMessage(""), 3500);
  }

  return (
    <section className="form-card" aria-labelledby="form-heading">
      <h2 id="form-heading">New request</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="e.g. Asha Mwangi"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "invalid" : ""}
          />
          <span className="error-msg">{errors.name}</span>
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "invalid" : ""}
          />
          <span className="error-msg">{errors.email}</span>
        </div>

        <div className="field">
          <label htmlFor="company">Product / Company</label>
          <select
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={errors.company ? "invalid" : ""}
          >
            <option value="" disabled>
              Choose one…
            </option>
            {PRODUCTS.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
          <span className="error-msg">{errors.company}</span>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="type">Request type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={errors.type ? "invalid" : ""}
            >
              <option value="" disabled>
                Select…
              </option>
              {REQUEST_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <span className="error-msg">{errors.type}</span>
          </div>

          <div className="field">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={errors.priority ? "invalid" : ""}
            >
              <option value="" disabled>
                Select…
              </option>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
            <span className="error-msg">{errors.priority}</span>
          </div>
        </div>

        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            placeholder="Tell us what's going on..."
            value={formData.message}
            onChange={handleChange}
            className={errors.message ? "invalid" : ""}
          />
          <span className="error-msg">{errors.message}</span>
        </div>

        <button type="submit" className="submit-btn">
          <span>Submit request</span>
        </button>

        <p className="form-status" role="status">
          {statusMessage}
        </p>
      </form>
    </section>
  );
}
