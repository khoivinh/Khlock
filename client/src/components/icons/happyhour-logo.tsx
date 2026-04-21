import { forwardRef, type CSSProperties } from "react";

export type HappyhourLogoVariant = "default" | "happy";

/** Happyhour brand mark — filled smiley with a checkmark-inspired eye sweep.
 *  Geometry reproduces Figma node 182:1510 (`Light and Dark Mode`) / 214:2649 (`Happy Mode`).
 *  The circle fills the viewBox so it reaches its Figma visual size at a given `h`/`w`;
 *  the check + smile paths are embedded via transforms matching the Figma absolute-inset layout.
 *
 *  Circle fill varies per theme: `default` uses brand yellow (#FFCD05) for light + dark;
 *  `happy` uses white (#FFFFFF) so the mark stays legible against the #FFD900 page background.
 *  Face paths (check + smile) stay black in all variants. */
export const HappyhourLogo = forwardRef<
  SVGSVGElement,
  { className?: string; style?: CSSProperties; variant?: HappyhourLogoVariant }
>(function HappyhourLogo({ className, style, variant = "default" }, ref) {
  const circleFill = variant === "happy" ? "#FFFFFF" : "#FFCD05";
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 38 38"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Circle — Figma inset 1.34%, so offset 0.509 with diameter 36.98 */}
      <circle cx="19" cy="19" r="18.4926" fill={circleFill} />
      {/* Checkmark eye — Figma inset [24.1% 24.5% 46.48% 31.31%] → translate(11.898, 9.158), intrinsic 16.7911 × 11.1814 */}
      <g transform="translate(11.898 9.158)">
        <path
          d="M7.11589 11.1814L0.41294 5.98453C-0.0523949 5.6222 -0.137647 4.95439 0.224675 4.48906C0.586997 4.02373 1.25481 3.93847 1.72014 4.3008L6.93828 8.34672L14.9733 0.311703C15.3889 -0.103901 16.0638 -0.103901 16.4794 0.311703C16.895 0.727308 16.895 1.40222 16.4794 1.81783L7.11589 11.1814Z"
          fill="#000000"
        />
      </g>
      {/* Smile — Figma inset [52.36% 20.38% 19.75% 19.98%] → translate(7.592, 19.897), intrinsic 22.6634 × 10.5964 */}
      <g transform="translate(7.592 19.897)">
        <path
          d="M11.3317 10.5964C5.93597 10.5964 1.18316 6.77428 0.0287017 1.50996C-0.116937 0.838597 0.305771 0.177893 0.977131 0.0287017C1.64849 -0.116937 2.3092 0.305771 2.45839 0.977131C3.36419 5.10831 7.09753 8.1099 11.3317 8.1099C15.5659 8.1099 19.2992 5.11186 20.205 0.977131C20.3542 0.305771 21.0114 -0.116937 21.6863 0.0287017C22.3577 0.177893 22.7804 0.838597 22.6347 1.50996C21.4803 6.77428 16.7275 10.5964 11.3317 10.5964Z"
          fill="#000000"
        />
      </g>
    </svg>
  );
});
