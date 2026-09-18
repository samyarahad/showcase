import { ProceduralSection } from './ProceduralSection';

export function AnalyticsSection() {
  return (
    <ProceduralSection
      id="analytics"
      eyebrow="ANALYTICS"
      headline="See the patterns."
      subline="Charts emerge from noise — trends become legible."
      variant="analytics"
      flip="right"
      chips={['7D', '30D', '90D']}
      features={[
        { title: 'Lines slowly form', desc: 'A chart doesn\'t appear instantly — it builds, line by line, until the pattern emerges.' },
        { title: 'Clearly visual presentation', desc: 'These charts illustrate what analytics looks like inside the product. They are not live data.' },
        { title: 'Patterns over numbers', desc: 'The goal is recognition, not measurement. You should see the shape of your network at a glance.' },
      ]}
    />
  );
}
