import { ProceduralSection } from './ProceduralSection';

export function LogsSection() {
  return (
    <ProceduralSection
      id="logs"
      eyebrow="LOGS"
      headline="See what\nhappened."
      subline="A cinematic stream of system events, organized by time."
      variant="logs"
      flip="right"
      chips={['INFO', 'OK', 'WARN']}
      features={[
        { title: 'A stream, not a wall', desc: 'Rows of abstract activity appear and flow upward — calm, not overwhelming. The camera moves through them.' },
        { title: 'Levels are visual', desc: 'INFO, OK, WARN are color-coded chips — you scan for color first, then read.' },
        { title: 'No fake events masquerading as real', desc: 'These rows illustrate the experience of looking at logs, not actual production events.' },
      ]}
    />
  );
}
