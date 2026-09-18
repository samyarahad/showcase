import { ProceduralSection } from './ProceduralSection';

export function FailoverSection() {
  return (
    <ProceduralSection
      id="failover"
      eyebrow="FAILOVER"
      headline="Built for\nchanging paths."
      subline="Primary, alternate, connected — resilience as a story."
      variant="failover"
      flip="left"
      chips={['PRIMARY', 'ALTERNATE', 'CONNECTED']}
      features={[
        { title: 'A visual explanation of resilience', desc: 'Watch as the primary route hands off to an alternate path, then reconnects. Educational, not operational.' },
        { title: 'No real failover occurs', desc: 'This animation explains the concept. The product itself performs failover — this page does not.' },
        { title: 'The story of staying up', desc: 'Resilience is not a feature you toggle — it is a story about how the network keeps moving when something breaks.' },
      ]}
    />
  );
}
