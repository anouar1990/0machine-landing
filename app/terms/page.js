"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParticleField from "../components/ParticleField";

export default function TermsOfService() {
  return (
    <>
      <ParticleField />
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 relative z-10 max-w-4xl mx-auto px-6 text-gray-300">
        <h1 className="text-4xl sm:text-5xl font-bold text-white font-[Outfit] mb-8">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: July 17, 2026</p>

        <div className="space-y-6 text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white font-[Outfit] mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using 0Machine Planner (the "Service"), provided by COOLDELO LABS LLC ("we," "our," or "us"), 
              you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white font-[Outfit] mb-3">2. Subscriptions & Billing</h2>
            <p>
              0Machine Planner offers a 3-day free trial, after which you will be billed $9 per month. 
              Subscriptions are billed f advance on a recurring monthly basis and are processed securely via Stripe. 
              You can cancel your subscription at any time through the app account settings portal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white font-[Outfit] mb-3">3. Acceptable Use</h2>
            <p>
              You agree to use the Service only for lawful purposes related to planning, calculating, and organizing your laser cutting or CNC projects. 
              You must not attempt to disrupt the Service, bypass security controls, upload malicious code, or scrape data from our database.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white font-[Outfit] mb-3">4. Intellectual Property</h2>
            <p>
              The Service, including its UI design, code, graphics, and algorithms, is the property of COOLDELO LABS LLC. 
              Any materials or project details you upload to your private account remain your intellectual property.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white font-[Outfit] mb-3">5. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "as is" and "as available" without any warranties of any kind. 
              We do not guarantee that the cost calculations or nesting estimations will be 100% accurate for every hardware machine setup. 
              Users are encouraged to verify project parameters prior to cutting materials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white font-[Outfit] mb-3">6. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of New Mexico, United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white font-[Outfit] mb-3">7. Contact Information</h2>
            <p>
              If you have any questions or concerns about these Terms, please reach out to us:
            </p>
            <div className="mt-3 bg-white/5 p-4 rounded-xl border border-white/5 space-y-1 text-sm">
              <p className="font-semibold text-white">COOLDELO LABS LLC</p>
              <p>Address: 1209 Mountain Rd Pl NE, Ste R, Albuquerque, NM 87110, United States</p>
              <p>Email: support@0machine.com</p>
              <p>Phone: +1 (917) 814-3657</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
