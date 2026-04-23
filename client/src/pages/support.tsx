import { SitePageLayout } from "@/components/site-page-layout";

export default function Support() {
  return (
    <SitePageLayout title="Support">
      <p className="text-[14px] leading-[22px] text-foreground">
        For questions, comments and suggestions,{" "}
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
