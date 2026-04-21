/** Happyhour brand mark — smiley with a checkmark-inspired eye sweep.
 *  Derived from design/User Interface Designs/favicon.svg (omitting the rounded square background).
 *
 *  Variants:
 *   - default: yellow circle (#FFCD05), black face — used in light + dark modes
 *   - happy:   white circle, black face — used on the #FFD900 Happy Mode background
 */
export type HappyhourLogoVariant = "default" | "happy";

export function HappyhourLogo({ className, variant = "default" }: { className?: string; variant?: HappyhourLogoVariant }) {
  const circleFill = variant === "happy" ? "#FFFFFF" : "#FFCD05";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="512"
      height="512"
      className={className}
      aria-hidden="true"
    >
      <circle cx="256" cy="256" r="161.08" fill={circleFill} />
      <path d="M255.624 267.165L197.238 221.898C193.184 218.742 192.442 212.925 195.598 208.872C198.754 204.818 204.571 204.076 208.624 207.232L254.077 242.474L324.066 172.485C327.686 168.865 333.565 168.865 337.185 172.485C340.805 176.105 340.805 181.984 337.185 185.604L255.624 267.165Z" fill="#000000" />
      <path d="M254.85 355.626C207.85 355.626 166.45 322.333 156.395 276.478C155.126 270.63 158.808 264.875 164.656 263.576C170.504 262.307 176.259 265.989 177.558 271.837C185.448 307.822 217.968 333.967 254.85 333.967C291.732 333.967 324.251 307.853 332.141 271.837C333.441 265.989 339.165 262.307 345.044 263.576C350.892 264.875 354.574 270.63 353.305 276.478C343.249 322.333 301.85 355.626 254.85 355.626Z" fill="#000000" />
    </svg>
  );
}
