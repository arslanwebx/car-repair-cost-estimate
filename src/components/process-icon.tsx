type ProcessIconProps = {
  kind: "vehicle" | "damage" | "photos" | "report";
};

export function ProcessIcon({ kind }: ProcessIconProps) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  return (
    <div className={`process-icon process-icon-${kind}`} aria-hidden="true">
      {kind === "vehicle" && (
        <svg {...common}>
          <path d="M8 29.5h32l-3.4-9.1a4 4 0 0 0-3.8-2.6H16.2a4 4 0 0 0-3.8 2.6L9 29.5Z" />
          <path d="M12 29.5v6.8M36 29.5v6.8M12 33h24M17 22h14" />
          <circle cx="15.5" cy="34.5" r="2.5" />
          <circle cx="32.5" cy="34.5" r="2.5" />
        </svg>
      )}
      {kind === "damage" && (
        <svg {...common}>
          <path d="M8 31h32l-3.5-9.5a4 4 0 0 0-3.7-2.6H16.2a4 4 0 0 0-3.7 2.6L9 31Z" />
          <path d="M15 31v5M33 31v5M13 34h22" />
          <circle cx="27" cy="23" r="6.5" className="icon-accent" />
          <path d="m27 19.5-1.5 3 2.6 1.1-2 3.1" className="icon-accent" />
        </svg>
      )}
      {kind === "photos" && (
        <svg {...common}>
          <rect x="8" y="13" width="32" height="25" rx="4" />
          <path d="m14 33 7.5-8 5.5 5 3.5-3.5L36 33" />
          <circle cx="31.5" cy="20.5" r="3" className="icon-accent" />
          <path d="M18 13.2 20 10h8l2 3.2" />
        </svg>
      )}
      {kind === "report" && (
        <svg {...common}>
          <path d="M13 7h16l7 7v27H13z" />
          <path d="M29 7v8h7M18 23h13M18 29h8" />
          <circle cx="29.5" cy="34" r="6.5" className="icon-accent-fill" />
          <path d="m27 34 1.8 1.8 3.4-4" className="icon-check" />
        </svg>
      )}
    </div>
  );
}
