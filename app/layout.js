import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import AnalyticsTracker from "./components/AnalyticsTracker";

export const metadata = {
  title: "0Machine Planner — Run Your Laser Business Smarter, Faster, Easier",
  description:
    "The all-in-one project planner for laser cutters and CNC makers. Track materials, costs, time, clients, and more. Start your free trial today.",
  keywords: [
    "laser cutting software",
    "CNC project management",
    "laser business planner",
    "material tracking",
    "cost calculator",
    "quote generator",
  ],
  openGraph: {
    title: "0Machine Planner — Run Your Laser Business Smarter",
    description:
      "All-in-one tool for laser cutter and CNC hobbyists. Track materials, costs, time, clients — all in one beautiful app.",
    url: "https://0machine.com",
    siteName: "0Machine",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          <AnalyticsTracker />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
