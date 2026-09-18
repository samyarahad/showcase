import { ProceduralSection } from './ProceduralSection';

export function NotificationsSection() {
  return (
    <ProceduralSection
      id="notifications"
      eyebrow="NOTIFICATIONS"
      headline="Stay\ninformed."
      subline="A quiet, deliberate channel for what matters."
      variant="notifications"
      flip="left"
      chips={['BELL', 'PULSE', 'SIGNAL']}
      features={[
        { title: 'Quiet by design', desc: 'Notifications should not shout. A pulse, a ring, a soft signal — enough to notice, never to alarm.' },
        { title: 'Transition from logs', desc: 'Notifications are the human-readable summary of what logs record mechanically.' },
        { title: 'No fake alerts', desc: 'The pulse you see is illustrative. No real alerts are triggered on this showcase page.' },
      ]}
    />
  );
}
