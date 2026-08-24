// Single source of truth for the business WhatsApp number. Every place in
// the app that needs a WhatsApp link (this homepage banner now, checkout
// and booking confirmations later) imports getWhatsAppLink() from here
// instead of typing the number directly - so if the number ever changes,
// it only has to change in one place.
//
// Once Supabase is connected (Phase 8+) this will read from the
// "settings" table instead, so the owner could update it from the admin
// dashboard without a code change. For now it reads an env var, falling
// back to the number confirmed in the project brief.
const FALLBACK_WHATSAPP_NUMBER = "14372676919";

export function getWhatsAppNumber() {
  return import.meta.env.VITE_WHATSAPP_NUMBER || FALLBACK_WHATSAPP_NUMBER;
}

// Builds a "click to chat" WhatsApp link with a pre-filled message.
// Example: getWhatsAppLink("Hi! I have a question.")
export function getWhatsAppLink(message) {
  const number = getWhatsAppNumber();
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encodedMessage}`;
}
