import { ScreenshotSection } from './ScreenshotSection';

export function SettingsSection() {
  return (
    <ScreenshotSection
      id="settings"
      eyebrow="SETTINGS"
      headline="Make the\nexperience yours."
      subline="Profile, appearance, language, panel — every detail in your control."
      screenshot="./screenshot-settings.png"
      alt="Pixel & Ping — Settings screen with profile, appearance, general and change-password sections"
      url="app.pixel-ping.io/settings"
      caption="Settings · Profile & appearance"
      flip="left"
      features={[
        { title: 'Profile', desc: 'Choose an avatar from the included set, or upload your own image to make the panel feel personal.' },
        { title: 'Appearance', desc: 'Four themes — Pixel Neon (brand), Dark, Light, and Midnight — to match your workspace and mood.' },
        { title: 'General', desc: 'Switch language and inspect the active panel — the regional basics, kept deliberately simple.' },
        { title: 'Change password', desc: 'A secure, deliberate flow — your new password is stored as a hash, never shown back to the browser.' },
      ]}
    />
  );
}
