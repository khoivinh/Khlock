import { SitePageLayout } from "@/components/site-page-layout";

/** Privacy copy derived from Figma 250:4243, adjusted in the 2026-04-23 batch
 *  to reflect Google Analytics + cookie consent (the original Figma copy was
 *  drafted before GA was added). */
export default function Privacy() {
  return (
    <SitePageLayout title="Privacy">
      <p className="text-[14px] leading-[22px] text-foreground">
        When you sign in to <strong>Happyhour</strong>, we store the cities you've added and your display preferences so they sync across your devices. We use <strong>Clerk</strong> for sign-in and <strong>Cloudflare D1</strong> for storage. With your consent we use <strong>Google Analytics</strong> to understand site usage — opt out anytime via the cookie banner. We don't sell or share your data, and we don't set advertising cookies. To delete your account and all associated data,{" "}
        <a
          href="mailto:hellodesigndept@gmail.com"
          className="font-bold underline text-inherit hover:opacity-80 transition-opacity"
        >
          send an email
        </a>
        .
      </p>
    </SitePageLayout>
  );
}
