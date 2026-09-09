import { useEffect } from 'react';
import { appConfig, whatsappLink } from '@/lib/config';
import { LandingFooter, LandingHeader } from './landing/components/chrome';
import { HeroSection } from './landing/components/hero';
import {
  BenefitStrip,
  CommercialOfferSection,
  CustomerStepsSection,
  FAQSection,
  FinalCTASection,
  ImmersiveDemoSection,
  ImplementationProcessSection,
  ProblemComparisonSection,
  RestaurantBenefitsSection,
  RestaurantTypesSection,
} from './landing/components/sections';
import { SkipLink } from './landing/ui/primitives';
import './landing/landing.css';

export function LandingPage() {
  const contact = whatsappLink() ?? `mailto:${appConfig.contactEmail}`;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `Cardápio 3D e Realidade Aumentada para Restaurantes | ${appConfig.name}`;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute('content') ?? null;
    meta?.setAttribute(
      'content',
      'Transforme pratos estratégicos em experiências 3D e realidade aumentada, acessíveis por QR Code e sem necessidade de aplicativo.',
    );
    return () => {
      document.title = previousTitle;
      if (meta && previousDescription != null) meta.setAttribute('content', previousDescription);
    };
  }, []);

  return (
    <div className="landing-root min-h-screen">
      <SkipLink />
      <LandingHeader contactHref={contact} />
      <main id="conteudo-principal">
        <HeroSection contactHref={contact} />
        <BenefitStrip />
        <ImmersiveDemoSection />
        <ProblemComparisonSection />
        <CustomerStepsSection />
        <RestaurantBenefitsSection />
        <RestaurantTypesSection />
        <ImplementationProcessSection />
        <CommercialOfferSection contactHref={contact} />
        <FAQSection />
        <FinalCTASection contactHref={contact} />
      </main>
      <LandingFooter contactHref={contact} />
    </div>
  );
}
