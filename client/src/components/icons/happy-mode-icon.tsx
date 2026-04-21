/** Happy mode icon — stroked smile with no eyes and no fill.
 *  Used in the sidebar's Appearance cycle for the "Happy" theme (Figma node 198:1789).
 *  Stroke stays yellow (#FFCD05) across all themes, matching the brand mark. */
export function HappyModeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 22 22"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10.9998 1.04375C16.4984 1.04375 20.9557 5.50121 20.9558 10.9998C20.9558 16.4985 16.4985 20.9559 10.9998 20.9559C5.50117 20.9558 1.04371 16.4984 1.04371 10.9998C1.04382 5.50127 5.50124 1.04386 10.9998 1.04375Z"
        stroke="#FFCD05"
        strokeWidth="1.5"
      />
      <path
        d="M16.1727 12.1139C16.1973 12.0087 16.2994 11.9437 16.4061 11.9664C16.5109 11.9909 16.5759 12.094 16.5535 12.1989C16.0069 14.6909 13.7531 16.5035 11.1981 16.5035C8.64336 16.5035 6.38958 14.6914 5.84259 12.1998H5.84357C5.8208 12.0949 5.88523 11.9921 5.99005 11.9674C6.08269 11.9473 6.1737 11.9951 6.21075 12.0787L6.22345 12.1168C6.73241 14.4343 8.82332 16.1148 11.1981 16.1149C13.5732 16.1149 15.6653 14.4353 16.1736 12.1149L16.1727 12.1139Z"
        fill="#FFCD05"
        stroke="#FFCD05"
        strokeWidth="0.884365"
      />
    </svg>
  );
}
