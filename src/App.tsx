import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from './hooks/useReducedMotion';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Navigation } from './components/Navigation';
import { ScrollProgress } from './components/ScrollProgress';
import { CustomCursor } from './components/CustomCursor';
import { HeroSection } from './sections/HeroSection';
import { NetworkSection } from './sections/NetworkSection';
import { EmergeSection } from './sections/EmergeSection';
import { DashboardSection } from './sections/DashboardSection';
import { UsersSection } from './sections/UsersSection';
import { ServersSection } from './sections/ServersSection';
import { EndpointsSection } from './sections/EndpointsSection';
import { IPScannerSection } from './sections/IPScannerSection';
import { PortsSection } from './sections/PortsSection';
import { CloudflareSection } from './sections/CloudflareSection';
import { ConfigGeneratorSection } from './sections/ConfigGeneratorSection';
import { TrafficSection } from './sections/TrafficSection';
import { AnalyticsSection } from './sections/AnalyticsSection';
import { FailoverSection } from './sections/FailoverSection';
import { LogsSection } from './sections/LogsSection';
import { NotificationsSection } from './sections/NotificationsSection';
import { SettingsSection } from './sections/SettingsSection';
import { RevealSection } from './sections/RevealSection';
import { FinalSection } from './sections/FinalSection';
import { Footer } from './sections/Footer';

export default function App() {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  // ---- Smooth scroll (Lenis) ----
  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Anchor link interception
    const handleAnchor = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!target) return;
      const id = target.getAttribute('href')?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -60, duration: 1.4 });
    };
    document.addEventListener('click', handleAnchor);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      document.removeEventListener('click', handleAnchor);
    };
  }, [reducedMotion]);

  // ---- Refresh ScrollTrigger after layout settles ----
  useEffect(() => {
    const onLoad = () => window.dispatchEvent(new Event('resize'));
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <>
      <div className="bg-atmosphere" aria-hidden />
      <div className="bg-noise" aria-hidden />
      <BackgroundCanvas />
      <ScrollProgress />
      <Navigation />
      <CustomCursor />

      <main id="main">
        <HeroSection />
        <NetworkSection />
        <EmergeSection />
        <DashboardSection />
        <UsersSection />
        <ServersSection />
        <EndpointsSection />
        <IPScannerSection />
        <PortsSection />
        <CloudflareSection />
        <ConfigGeneratorSection />
        <TrafficSection />
        <AnalyticsSection />
        <FailoverSection />
        <LogsSection />
        <NotificationsSection />
        <SettingsSection />
        <RevealSection />
        <FinalSection />
      </main>

      <Footer />
    </>
  );
}
