import { ProceduralSection } from './ProceduralSection';

export function EndpointsSection() {
  return (
    <ProceduralSection
      id="endpoints"
      eyebrow="ENDPOINTS"
      headline="Every endpoint\nhas a place."
      subline="Connections converge into a clear, organized map."
      variant="network"
      flip="left"
      chips={['NODE', 'ROUTE', 'POOL']}
      features={[
        { title: 'A clear map, not a list', desc: 'Each endpoint lives on the network as a node — visible, named, and connected to its server.' },
        { title: 'Routes are first-class', desc: 'See the path from user to endpoint to server as part of the structure, not buried in a config file.' },
        { title: 'Presentation only', desc: 'This view explains the relationship — it does not perform live routing operations on this page.' },
      ]}
    />
  );
}
