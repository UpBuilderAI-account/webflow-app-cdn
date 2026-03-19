const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  width: 16,
  height: 16,
} as const;

export function CheckIcon(props: { className?: string }) {
  return (
    <svg {...iconProps} strokeWidth={2.5} className={props.className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function SpinnerIcon(props: { className?: string }) {
  return (
    <svg {...iconProps} strokeWidth={2} className={props.className} style={{ animation: 'spin 1s linear infinite' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

export function WaitIcon(props: { className?: string }) {
  return (
    <svg {...iconProps} strokeWidth={2} className={props.className}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export function ErrorIcon(props: { className?: string }) {
  return (
    <svg {...iconProps} strokeWidth={2} className={props.className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function SkipIcon(props: { className?: string }) {
  return (
    <svg {...iconProps} strokeWidth={2} className={props.className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
  );
}

export function PausedIcon(props: { className?: string }) {
  return (
    <svg {...iconProps} strokeWidth={2} className={props.className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function ChevronDownIcon(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width={18} height={18} className={props.className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export function WarningIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width={14} height={14}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}
