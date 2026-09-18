import { ProceduralSection } from './ProceduralSection';

export function CloudflareSection() {
  return (
    <ProceduralSection
      id="cloudflare"
      eyebrow="CLOUDFLARE"
      headline="Built around modern infrastructure."
      subline="Designed around Cloudflare integration for routing and resilience."
      variant="cloud"
      flip="left"
      chips={['CF', 'WORKER', 'TLS', 'SNICFRONT']}
      features={[
        { title: 'Designed around Cloudflare infrastructure', desc: 'Cloudflare integration is part of how Pixel & Ping routes traffic — not an afterthought.' },
        { title: 'No endorsement implied', desc: 'Pixel & Ping uses Cloudflare as a tool. This is a visual explanation, not a partnership claim.' },
        { title: 'No credentials shown', desc: 'No API tokens, no account credentials, no real integration is performed on this showcase page.' },
      ]}
    />
  );
}
