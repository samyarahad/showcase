/**
 * Section catalog — single source of truth for navigation + scroll spy.
 * Order matters and follows the spec's story arc exactly.
 */
export interface SectionMeta {
  id: string;
  /** Navigation label (uppercase) */
  nav?: string;
  /** Eyebrow label shown above the headline inside the section */
  eyebrow: string;
  /** Main headline */
  headline: string;
  /** Short supporting copy */
  subline: string;
}

export const SECTIONS: SectionMeta[] = [
  { id: 'hero',          nav: 'HOME',     eyebrow: 'PIXEL & PING',                  headline: 'Control your network.\nSee everything.',                       subline: 'A modern network management experience.' },
  { id: 'network',       nav: 'NETWORK',  eyebrow: 'THE NETWORK',                   headline: 'Everything connected.',                                         subline: 'One place to understand the moving parts of your network.' },
  { id: 'emerge',        nav: 'PRODUCT',  eyebrow: 'THE PRODUCT EMERGES',           headline: 'From signal to surface.',                                       subline: 'The abstract network becomes the interface.' },
  { id: 'dashboard',     eyebrow: 'DASHBOARD',           headline: 'See everything at a glance.',         subline: 'A single panoramic view of users, servers, traffic and infrastructure health.' },
  { id: 'users',         eyebrow: 'USERS',               headline: 'Designed around your users.',          subline: 'Organize the people and access that matter to your network.' },
  { id: 'servers',       eyebrow: 'SERVERS',             headline: 'Your infrastructure, in view.',         subline: 'Register servers, assign endpoints, and watch them come alive.' },
  { id: 'endpoints',     eyebrow: 'ENDPOINTS',           headline: 'Every endpoint has a place.',           subline: 'Connections converge into a clear, organized map.' },
  { id: 'ip-scanner',    eyebrow: 'IP SCANNER',          headline: 'Find the signal.',                      subline: 'Explore network intelligence through a focused interface.' },
  { id: 'ports',         eyebrow: 'PORTS',               headline: 'Every connection, organized.',          subline: 'A clear technical visualization of how every path is routed.' },
  { id: 'cloudflare',    eyebrow: 'CLOUDFLARE',          headline: 'Built around modern infrastructure.',    subline: 'Designed around Cloudflare integration for routing and resilience.' },
  { id: 'config',        eyebrow: 'CONFIG GENERATOR',    headline: 'Complexity, organized.',                subline: 'Parameters flow into a single, organized configuration object.' },
  { id: 'traffic',       eyebrow: 'TRAFFIC',             headline: 'Watch the network move.',               subline: 'Thousands of subtle paths visualize the flow of data.' },
  { id: 'analytics',     eyebrow: 'ANALYTICS',           headline: 'See the patterns.',                     subline: 'Charts emerge from noise — trends become legible.' },
  { id: 'failover',      eyebrow: 'FAILOVER',            headline: 'Built for changing paths.',             subline: 'Primary, alternate, connected — resilience as a story.' },
  { id: 'logs',          eyebrow: 'LOGS',                headline: 'See what happened.',                    subline: 'A cinematic stream of system events, organized by time.' },
  { id: 'notifications', eyebrow: 'NOTIFICATIONS',       headline: 'Stay informed.',                        subline: 'A quiet, deliberate channel for what matters.' },
  { id: 'settings',      eyebrow: 'SETTINGS',            headline: 'Make the experience yours.',             subline: 'Profile, appearance, language, panel — every detail in your control.' },
  { id: 'reveal',        nav: 'EXPERIENCE', eyebrow: 'THE FULL SYSTEM',           headline: 'Everything is connected.',                                       subline: 'One product. One view. One network.' },
  { id: 'final',         eyebrow: 'PIXEL & PING',        headline: 'One view.\nOne network.',                subline: '' },
];

export const NAV_ITEMS = SECTIONS.filter((s) => s.nav).map((s) => ({
  id: s.id,
  label: s.nav!,
}));

export const SOCIAL_LINKS = {
  telegram: 'https://t.me/Pixel_Ping',
  youtube: 'https://www.youtube.com/channel/ShadowDrop-024',
};
