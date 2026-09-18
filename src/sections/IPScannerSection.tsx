import { ScreenshotSection } from './ScreenshotSection';

export function IPScannerSection() {
  return (
    <ScreenshotSection
      id="ip-scanner"
      eyebrow="IP SCANNER"
      headline="Find the signal."
      subline="Explore network intelligence through a focused interface."
      screenshot="./screenshot-ip-scanner.png"
      alt="Pixel & Ping — IP Scanner screen with clean IP pool and endpoint health"
      caption="Pixel & Ping · IP Scanner"
      flip="right"
      features={[
        { title: 'Clean IP pool', desc: 'A curated list of addresses to use when generating configs — kept separate from your live inventory.' },
        { title: 'Endpoint health', desc: 'Scan the endpoints already registered in your own server inventory to see how each one is doing.' },
        { title: 'Export & sort', desc: 'Filter, sort by score, and export results — the table is yours to interrogate.' },
      ]}
    />
  );
}
