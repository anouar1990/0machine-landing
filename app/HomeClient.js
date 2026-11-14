"use client";
import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import ParticleField from "./components/ParticleField";
import Footer from "./components/Footer";
import dynamic from "next/dynamic";
import { ExperimentProvider, useExperiment } from "./context/ExperimentContext";
import VariantA from "./variants/VariantA";
import { trackPageView } from "./lib/analytics";

const VariantB = dynamic(() => import("./variants/VariantB"));
const VariantC = dynamic(() => import("./variants/VariantC"));
const VariantD = dynamic(() => import("./variants/VariantD"));
const VariantE = dynamic(() => import("./variants/VariantE"));

function ExperimentContent() {
  const { variant } = useExperiment();

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, [variant]);

  return (
    <>
      <ParticleField />
      <Navbar />
      <main className="min-h-screen">
        {variant === "B" && <VariantB />}
        {variant === "C" && <VariantC />}
        {variant === "D" && <VariantD />}
        {variant === "E" && <VariantE />}
        {(variant === "A" || !["B", "C", "D", "E"].includes(variant)) && <VariantA />}
      </main>
      <Footer />
    </>
  );
}

export default function HomeClient({ initialVariant = "A" }) {
  return (
    <ExperimentProvider initialVariant={initialVariant}>
      <ExperimentContent />
    </ExperimentProvider>
  );
}

