// Simple line-art icons for service categories. We use hand-drawn SVGs
// here (not real photos) because we don't have real portfolio photos of
// Nayaé Beauty's work yet - using stock/other-brand photos to represent
// her services would be misleading. These get replaced by her real
// portfolio photos once she uploads them via the admin dashboard.
const ICONS = {
  makeup: (
    <path
      d="M9 32c0-9 4.5-15 9-15s9 6 9 15M9 32h18M14 17c0-4 2-8 4-8s4 4 4 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  bridal: (
    <path
      d="M20 10v6M12 32c0-8 3.5-13 8-13s8 5 8 13M14 24h12M20 10a3 3 0 100-6 3 3 0 000 6z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  lashes: (
    <path
      d="M8 22c4-6 8-9 12-9s8 3 12 9c-4 6-8 9-12 9s-8-3-12-9z M20 22a3 3 0 100-0.01"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
};

function ServiceIcon({ name }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      {ICONS[name] ?? ICONS.makeup}
    </svg>
  );
}

export default ServiceIcon;
