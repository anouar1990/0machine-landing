"use client";
import React from "react";
import dynamic from "next/dynamic";
import Hero from "../components/Hero";

const DesignsVault = dynamic(() => import("../components/DesignsVault"), { ssr: true });
const LaserAiSection = dynamic(() => import("../components/LaserAiSection"), {
  ssr: false,
  loading: () => (
    <div className="py-20 bg-[#0D0E11] flex items-center justify-center min-h-[300px]">
      <div className="w-8 h-8 rounded-full border-2 border-[#FE7733] border-t-transparent animate-spin" />
    </div>
  ),
});
const Benefits = dynamic(() => import("../components/Benefits"), { ssr: true });
const FeatureShowcase = dynamic(() => import("../components/FeatureShowcase"), { ssr: true });
const Comparison = dynamic(() => import("../components/Comparison"), { ssr: true });
const Workflow = dynamic(() => import("../components/Workflow"), { ssr: true });
const ProductShowcase = dynamic(() => import("../components/ProductShowcase"), { ssr: true });
const SocialProof = dynamic(() => import("../components/SocialProof"), { ssr: true });
const Pricing = dynamic(() => import("../components/Pricing"), { ssr: true });
const FinalCTA = dynamic(() => import("../components/FinalCTA"), { ssr: true });

/**
 * VARIANT A — Baseline / Control
 * Preserves the exact original landing page structure, copy, and components.
 */
export default function VariantA() {
  return (
    <>
      <Hero />
      <DesignsVault />
      <LaserAiSection />
      <Benefits />
      <FeatureShowcase />
      <Comparison />
      <Workflow />
      <ProductShowcase />
      <SocialProof />
      <Pricing />
      <FinalCTA />
    </>
  );
}

