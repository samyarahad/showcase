import { ScreenshotSection } from './ScreenshotSection';

export function ServersSection() {
  return (
    <ScreenshotSection
      id="servers"
      eyebrow="SERVERS"
      headline="Your infrastructure, in view."
      subline="Register servers, assign endpoints, and watch them come alive."
      screenshot="./screenshot-servers.png"
      alt="Pixel & Ping — Servers registration screen"
      caption="Pixel & Ping · Servers"
      flip="left"
      features={[
        { title: 'One place for every server', desc: 'A single inventory of every machine under your network — registered, named, and ready.' },
        { title: 'Endpoints, attached', desc: 'Each server holds its endpoints, so the relationship between machines and routes is always visible.' },
        { title: 'Add-server flow stays calm', desc: 'No sprawling forms. A clean empty state invites intentional setup, not noise.' },
      ]}
    />
  );
}
