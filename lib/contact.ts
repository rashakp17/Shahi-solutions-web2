/**
 * Where the calls-to-action actually go.
 *
 * One file, because these were four buttons pointing at `#start` and `#demo`
 * — anchors that exist nowhere in the document, so every primary action on
 * the site was a no-op. Putting the destinations in one place is what stops
 * that happening again quietly: a dead `href` buried in a component reads
 * exactly like a live one.
 */

/**
 * The WhatsApp number, in the form wa.me wants: country code first, no `+`,
 * no spaces, no punctuation. Anything else and the link opens WhatsApp on a
 * "phone number is invalid" screen rather than on a chat.
 *
 * This is the number the site already publishes as its own, in the contact
 * section and again in the footer. If the business takes WhatsApp on a
 * different line, this constant is the only place that has to change.
 */
export const WHATSAPP_NUMBER = "918590371761";

/**
 * The message the chat opens with, already typed.
 *
 * Worth keeping short and first-person. This lands in the visitor's compose
 * box with the cursor after it, and they are the one who appears to have
 * written it — a long marketing sentence in their own outbox reads as a
 * script being put in their mouth, and the first thing they do is delete it.
 */
export const WHATSAPP_MESSAGE =
  "Hi Shahi Solutions — I'd like to get started on a project.";

/**
 * A wa.me link with the message pre-filled.
 *
 * `wa.me` rather than `api.whatsapp.com`: it is the form WhatsApp documents
 * for exactly this, and it resolves on its own to the app on a phone and to
 * WhatsApp Web on a desktop, so one link covers both without sniffing the
 * user agent.
 *
 * The text is encoded rather than interpolated raw. The default message
 * contains an apostrophe and an em dash today, and would break on the first
 * `&` or `#` anyone adds later — `encodeURIComponent` makes that a non-issue
 * permanently instead of a bug waiting for a copy change.
 */
export function whatsappHref(message: string = WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** The destination for every "get started" action on the page. */
export const START_HREF = whatsappHref();

/**
 * The destination for "Book a demo" — the contact section on this page.
 *
 * `#contact` is a real id: ContactSection carries it, and globals.css already
 * gives it `scroll-margin-top` so it lands clear of the fixed navbar rather
 * than under it.
 */
export const DEMO_HREF = "#contact";
