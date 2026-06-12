/**
 * Validate the request form.
 * @param {Object} data - { name, email, company, type, priority, message }
 * @returns {Object} field -> error message. Empty object = valid.
 */
export function validateRequestForm(data) {
  const errors = {};

  if (!data.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!data.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "That email doesn't look right.";
  }

  if (!data.company) {
    errors.company = "Please choose a product/company.";
  }

  if (!data.type) {
    errors.type = "Please choose a request type.";
  }

  if (!data.priority) {
    errors.priority = "Please choose a priority.";
  }

  if (!data.message.trim()) {
    errors.message = "Please describe your request.";
  } else if (data.message.trim().length < 5) {
    errors.message = "A few more words would help us a lot.";
  }

  return errors;
}

/** Format an ISO date string into something readable. */
export function formatDate(isoString) {
  const date = new Date(isoString);
  return (
    date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) +
    " · " +
    date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}
/**
 * Generate an auto-reply email preview for a resolved request.
 * Returns null if the request isn't resolved.
 */
export function getAutoReplyEmail(request) {
  if (request.status !== "Resolved") return null;

  return {
    subject: `Update: your request is now resolved`,
    body: `Hi ${request.name},\n\nGood news! Your request regarding "${request.type}" has been resolved. If you have any further questions, feel free to reach out again.\n\n— PhotoMed Support`,
  };
}
