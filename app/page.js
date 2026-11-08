"use client";
import React, { useState, useEffect } from "react";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import ParticleField from "./components/ParticleField";
import Footer from "./components/Footer";
import { ExperimentProvider, useExperiment } from "./context/ExperimentContext";
import VariantA from "./variants/VariantA";
import VariantB from "./variants/VariantB";
import VariantC from "./variants/VariantC";
import VariantD from "./variants/VariantD";
import VariantE from "./variants/VariantE";
import { trackPageView } from "./lib/analytics";

function ExperimentContent() {
  const { variant } = useExperiment();

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, [variant]);

  return (
    <>
      <ParticleField />
      <Navbar />
      <main>
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

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <ExperimentProvider>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      {loaded && <ExperimentContent />}
    </ExperimentProvider>
  );
}
