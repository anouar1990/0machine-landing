import HomeClient from "./HomeClient";
import { cookies } from "next/headers";

export const metadata = {
  title: "0Machine Planner — Run Your Laser Business Smarter, Faster, Easier",
  description:
    "The all-in-one project planner for laser cutters and CNC makers. Track materials, costs, time, clients, and more. Start your free trial today.",
};

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  let serverVariant = "A";

  const urlVariant = sp?.variant ? String(sp.variant).toUpperCase() : null;
  if (urlVariant && ["A", "B", "C", "D", "E"].includes(urlVariant)) {
    serverVariant = urlVariant;
  } else {
    try {
      const cookieStore = await cookies();
      const cookieVariant = cookieStore.get("0machine_variant")?.value?.toUpperCase();
      if (cookieVariant && ["A", "B", "C", "D", "E"].includes(cookieVariant)) {
        serverVariant = cookieVariant;
      }
    } catch (e) {}
  }

  return <HomeClient initialVariant={serverVariant} />;
}
