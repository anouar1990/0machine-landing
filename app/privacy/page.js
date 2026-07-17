"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParticleField from "../components/ParticleField";

export default function PrivacyPolicy() {
  return (
    <>
      <ParticleField />
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 relative z-10 max-w-4xl mx-auto px-6 text-gray-300">
        <h1 className="text-4xl sm:text-5xl font-bold text-white font-[Outfit] mb-8">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: July 17, 2026</p>

        <div className="space-y-6 text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white font-[Outfit] mb-3">1. Introduction</h2>
            <p>
              Welcome to 0Machine Planner (the "Service"), operated by COOLDELO LABS LLC ("we," "our," or "us"). 
              We respect your privacy and are committed to protecting the personal data you share with us. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web and mobile applications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white font-[Outfit] mb-3">2. Information We Collect</h2>
            <p>
              We collect information to provide a better service to all our users. This includes:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Account Information:</strong> When you sign up, we collect your email address, password, and settings.</li>
              <li><strong>App Data:</strong> Project parameters, laser presets, materials inventory, and client names that you input into the Service. This data is stored securely in our database.</li>
              <li><strong>Billing Information:</strong> All payment transactions are processed securely through Stripe. We do not store your credit card information on our servers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white font-[Outfit] mb-3">3. How We Use Your Information</h2>
            <p>
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>To provide, operate, and maintain the Service.</li>
              <li>To process transactions and manage your subscription via Stripe.</li>
              <li>To improve user experience, optimize app performance, and fix bugs.</li>
              <li>To communicate with you regarding updates, security alerts, and support requests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white font-[Outfit] mb-3">4. Data Sharing and Third Parties</h2>
            <p>
              We do not sell your personal data. We share information only with trusted service providers necessary to run the Service:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Supabase:</strong> For cloud hosting, database management, and authentication.</li>
              <li><strong>Stripe:</strong> For payment processing and billing management.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white font-[Outfit] mb-3">5. Data Security</h2>
            <p>
              We implement industry-standard security measures, including HTTPS encryption and secure database access control via Supabase Row-Level Security (RLS) policies, to protect your data from unauthorized access or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white font-[Outfit] mb-3">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
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
