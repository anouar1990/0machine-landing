"use client";
import { useState } from "react";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import ParticleField from "./components/ParticleField";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import FeatureShowcase from "./components/FeatureShowcase";
import Comparison from "./components/Comparison";
import Workflow from "./components/Workflow";
import ProductShowcase from "./components/ProductShowcase";
import SocialProof from "./components/SocialProof";
import Pricing from "./components/Pricing";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      
      {loaded && (
        <>
          <ParticleField />
          <Navbar />
          <main>
            <Hero />
            <Benefits />
            <FeatureShowcase />
            <Comparison />
            <Workflow />
            <ProductShowcase />
            <SocialProof />
            <Pricing />
            <FinalCTA />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
