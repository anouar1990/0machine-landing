"use client";
import React from "react";
import Hero from "../components/Hero";
import DesignsVault from "../components/DesignsVault";
import LaserAiSection from "../components/LaserAiSection";
import Benefits from "../components/Benefits";
import FeatureShowcase from "../components/FeatureShowcase";
import Comparison from "../components/Comparison";
import Workflow from "../components/Workflow";
import ProductShowcase from "../components/ProductShowcase";
import SocialProof from "../components/SocialProof";
import Pricing from "../components/Pricing";
import FinalCTA from "../components/FinalCTA";

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

