import EventSection from "@/components/home/EventSection";
import HomeHero from "@/components/home/HomeHero";

export default function Home() {
  return (
    <div
      className="bg-white min-h-screen"
      style={{
        backgroundImage:
          "radial-gradient(circle at center, rgba(255,255,255,0.85) 0%, transparent 65%)",
      }}
    >
      <HomeHero />
      <EventSection />
    </div>
  );
}
