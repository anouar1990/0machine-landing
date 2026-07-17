"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParticleField from "../components/ParticleField";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus("error");
      return;
    }
    // Mock submit success
    setStatus("success");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <>
      <ParticleField />
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 relative z-10 max-w-6xl mx-auto px-6 text-gray-300">
        <h1 className="text-4xl sm:text-5xl font-bold text-white font-[Outfit] mb-8 text-center sm:text-left">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-8">
          {/* Left Column: Form */}
          <div className="bg-white/5 p-8 rounded-2xl border border-white/5 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white font-[Outfit] mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2 font-medium">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2 font-medium">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2 font-medium">Message</label>
                <textarea
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500 transition-colors resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-400">Please fill out all the fields.</p>
              )}
              {status === "success" && (
                <p className="text-sm text-green-400">Thank you! Your message has been sent successfully.</p>
              )}

              <button
                type="submit"
                className="w-full glow-btn text-base py-3.5"
              >
                Send Message ✉️
              </button>
            </form>
          </div>

          {/* Right Column: Contact Details */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white font-[Outfit] mb-4">Get In Touch</h2>
              <p className="text-gray-400">
                Have questions about our project planners, pricing, or custom options? 
                Our support team is here to assist you. Drop us a line and we'll get back to you within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="text-2xl mt-1">📍</div>
                <div>
                  <h4 className="font-bold text-white font-[Outfit]">Address</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    COOLDELO LABS LLC<br />
                    1209 Mountain Rd Pl NE, Ste R<br />
                    Albuquerque, NM 87110, United States
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="text-2xl mt-1">✉️</div>
                <div>
                  <h4 className="font-bold text-white font-[Outfit]">Email</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    <a href="mailto:support@0machine.com" className="text-accent-400 hover:underline">
                      support@0machine.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="text-2xl mt-1">📞</div>
                <div>
                  <h4 className="font-bold text-white font-[Outfit]">Phone</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    <a href="tel:+19178143657" className="text-accent-400 hover:underline">
                      +1 (917) 814-3657
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="text-2xl mt-1">🕒</div>
                <div>
                  <h4 className="font-bold text-white font-[Outfit]">Working Hours</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    Monday - Friday: 9:00 AM - 5:00 PM MST
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
