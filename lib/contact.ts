/** Call-to-action destinations, kept in one place. */

/** WhatsApp number for wa.me: country code first, digits only. */
export const WHATSAPP_NUMBER = "918590371761";

/** Pre-filled chat message. Keep it short and first-person. */
export const WHATSAPP_MESSAGE =
  "Hi Shahi Solutions — I'd like to get started on a project.";

/** wa.me link with the message pre-filled. Works on mobile and desktop. */
export function whatsappHref(message: string = WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Target for "get started" buttons. */
export const START_HREF = whatsappHref();

/** Target for "Book a demo": the #contact section. */
export const DEMO_HREF = "#contact";
