import { ProceduralSection } from './ProceduralSection';

export function PortsSection() {
  return (
    <ProceduralSection
      id="ports"
      eyebrow="PORTS"
      headline="Every connection, organized."
      subline="A clear technical visualization of how every path is routed."
      variant="grid-scan"
      flip="right"
      chips={['80', '443', '8080', '8443']}
      features={[
        { title: 'Multiple connection paths', desc: 'Different port types appear as different visual rhythms — each path legible at a glance.' },
        { title: 'Visually sophisticated', desc: 'Designed to be readable by humans, not just machines. No dense tables, no clutter.' },
        { title: 'Part of the network story', desc: 'Ports are not an isolated screen — they fit into the larger flow from endpoints to traffic.' },
      ]}
    />
  );
}
