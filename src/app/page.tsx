import EventSection from "../components/home/EventSection";
import TeamSection from "../components/home/TeamSection";

export default function Home() {
  return (
    <>
      <div className="relative h-screen">
        <img
          src="/images/home/pub-hero.jpeg"
          alt="Pub Hero Image"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/70"></div>
        <div className="xl:container mx-auto self-center h-full flex items-center justify-center">
          <div className="relative z-10 flex flex-col gap-10 h-full items-center justify-center text-white">
            <h1
              className="text-4xl md:text-7xl font-extrabold text-center px-4 
               bg-linear-to-r from-white via-pub-blue to-white
               bg-clip-text text-transparent"
            >
              Dobrodošli na Pub Quiz
            </h1>

            <h2 className="mt-4 text-xl md:text-2xl font-medium text-center px-4">
              Testirajte svoje znanje i zabavite se sa prijateljima!
            </h2>
            <TeamSection team={null} />
          </div>
        </div>
      </div>
      <EventSection />
    </>
  );
}
