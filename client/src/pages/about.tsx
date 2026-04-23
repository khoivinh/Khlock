import { SitePageLayout } from "@/components/site-page-layout";

export default function About() {
  return (
    <SitePageLayout title="About">
      <p className="text-[14px] leading-[22px] text-foreground">
        Happyhour is a world clock designed and developed by Khoi Vinh in Brooklyn, NY. Stay tuned for an iOS version. For more information, visit{" "}
        <a
          href="https://designdept.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold no-underline text-inherit hover:opacity-80 transition-opacity"
        >
          DesignDept.com
        </a>
        .
      </p>
    </SitePageLayout>
  );
}
