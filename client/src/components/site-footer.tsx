import { Link } from "wouter";

/** Universal footer shown on the home page and all content pages.
 *  Copyright line + About/Privacy/Support nav. Per Figma 272:4560. */
export function SiteFooter() {
  return (
    <footer className="px-6 md:px-12 lg:px-24 py-[20px]">
      <div className="mx-auto max-w-4xl px-[10px]">
        <p className="text-[12px] leading-[22px] tracking-[-0.43px] text-foreground capitalize">
          <span className="font-medium">©2026 </span>
          <a
            href="https://designdept.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold no-underline text-inherit hover:opacity-80 transition-opacity"
          >
            Design Dept Partners LLC
          </a>
        </p>
        <nav className="mt-[4px] flex items-center gap-[10px] text-[12px] leading-[22px] text-muted-foreground">
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          <span aria-hidden="true">•</span>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <span aria-hidden="true">•</span>
          <Link href="/support" className="hover:text-foreground transition-colors">Support</Link>
        </nav>
      </div>
    </footer>
  );
}
