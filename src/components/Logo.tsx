export default function Logo({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="9" fill="#d9ff43" />
      <path
        d="M8 21c2.5-6 5-10 7-10s-1 9 1.5 9S22 11 24.5 11"
        fill="none"
        stroke="#0c0c0e"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
