import { ProceduralSection } from './ProceduralSection';

export function TrafficSection() {
  return (
    <ProceduralSection
      id="traffic"
      eyebrow="TRAFFIC"
      headline="Watch the network move."
      subline="Thousands of subtle paths visualize the flow of data."
      variant="traffic"
      flip="left"
      chips={['REQUESTS', 'BANDWIDTH', 'LATENCY']}
      features={[
        { title: 'Subtle, beautiful motion', desc: 'Particles drift along their paths — calm, not chaotic. The network moves like a living system.' },
        { title: 'No fabricated live values', desc: 'The visualization is illustrative. It does not display fabricated request counts or bandwidth numbers.' },
        { title: 'The story of flow', desc: 'Traffic is the bloodstream of the network — here you see it moving, not just counted.' },
      ]}
    />
  );
}
