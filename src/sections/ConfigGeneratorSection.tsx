import { ProceduralSection } from './ProceduralSection';

export function ConfigGeneratorSection() {
  return (
    <ProceduralSection
      id="config"
      eyebrow="CONFIG GENERATOR"
      headline="Complexity, organized."
      subline="Parameters flow into a single, organized configuration object."
      variant="config"
      flip="right"
      chips={['PARAM', 'OBJECT', 'OUT']}
      features={[
        { title: 'Abstract parameters become form', desc: 'Watch as scattered inputs converge into a single, organized configuration object at the center.' },
        { title: 'No actual generation happens here', desc: 'This is a visual explanation of the concept. The Config Generator itself lives in the product.' },
        { title: 'Lines connect meaningfully', desc: 'Each parameter has a destination — the diagram shows intent, not random connection.' },
      ]}
    />
  );
}
