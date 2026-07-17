"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParticleField from "../components/ParticleField";

export default function AboutUs() {
  return (
    <>
      <ParticleField />
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 relative z-10 max-w-4xl mx-auto px-6 text-gray-300">
        <h1 className="text-4xl sm:text-5xl font-bold text-white font-[Outfit] mb-6">
          About Us
        </h1>
        <p className="text-lg text-accent-400 font-medium mb-10 font-[Outfit]">
          Built by makers, for makers. Running a laser business shouldn't be a calculations headache.
        </p>

        <div className="space-y-8 text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white font-[Outfit] mb-3">Our Mission</h2>
            <p>
              At 0Machine Planner, our mission is to empower digital fabrication designers, laser cutter hobbyists, 
              and CNC workshop owners to turn their craft into a profitable, organized business. 
              We know that spending hours in spreadsheets calculating kerf, usage yields, machine wear, and material prices 
              takes you away from what you love doing most: creating.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white font-[Outfit] mb-3">Why 0Machine?</h2>
            <p>
              We designed 0Machine to be the missing link f the maker workflow. Rather than guessing margins, 
              our app provides instant, scientific cost calculators, sheet nesting layout optimization, 
              client management, and professional PDF quote generators — all f one dark-themed, ultra-fast application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white font-[Outfit] mb-3">Our Company</h2>
            <p>
              0Machine Planner is built and operated by <strong>COOLDELO LABS LLC</strong>. 
              We are dedicated to building high-quality, lightweight software utilities for designers and makers worldwide. 
              Whether you run a single Glowforge f your garage or an industrial CNC router farm, we build tools to help you succeed.
            </p>
          </section>

          <section className="bg-white/5 p-6 rounded-2xl border border-white/5">
            <h3 className="text-lg font-bold text-white font-[Outfit] mb-2">Corporate Headquarters</h3>
            <p className="text-sm text-gray-400">
              COOLDELO LABS LLC<br />
              1209 Mountain Rd Pl NE, Ste R<br />
              Albuquerque, NM 87110, United States
            </p>
            <p className="text-sm text-gray-400 mt-2">
              For corporate or media inquiries, contact: <a href="mailto:support@0machine.com" className="text-accent-400 hover:underline">support@0machine.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
