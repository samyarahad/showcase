import { ScreenshotSection } from './ScreenshotSection';

export function UsersSection() {
  return (
    <ScreenshotSection
      id="users"
      eyebrow="USERS"
      headline="Designed around\nyour users."
      subline="Organize the people and access that matter to your network."
      screenshot="./screenshot-users.png"
      alt="Pixel & Ping — Users management screen"
      url="app.pixel-ping.io/users"
      caption="Users · VPN identity & access"
      flip="right"
      features={[
        { title: 'A focused list, not a database', desc: 'Search and filter surface the right person in seconds — no scroll fatigue, no overload.' },
        { title: 'Create-user flow, deliberately empty', desc: 'A clean canvas keeps the focus on what matters: adding the right person, the right way.' },
        { title: 'Built around real workflows', desc: 'Designed for the way small teams actually manage VPN users — not for mass provisioning.' },
      ]}
    />
  );
}
