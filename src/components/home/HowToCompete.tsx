"use client";

import Button from "@/components/Button";
import { steps } from "@/constants/competeSteps";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { getHref } from "@/constants/menuItems";

export default function HowItWorks() {
  const { status, user } = useAuth();
  const router = useRouter();
  return (
    <section className="py-20 bg-transparent text-white z-10 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-pub-orange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pub-blue/10 rounded-full blur-3xl"></div>
      </div>

      <div className="xl:container mx-auto xl:px-20 px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="md:text-5xl text-4xl font-bold mb-4">
            Kako funkcioniše?
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Samo četiri jednostavna koraka te dele od tvoje prve kviz večeri!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-linear-to-r from-pub-orange/50 to-transparent z-0"></div>
              )}

              <div className="relative bg-white/10 backdrop-blur-sm border-2 border-pub-orange/30 rounded-2xl p-6 hover:border-pub-orange hover:shadow-2xl hover:shadow-pub-orange/20 transition-all duration-300 hover:-translate-y-2 z-10">
                <div
                  className={`absolute -top-4 -right-4 w-12 h-12 bg-linear-to-br ${step.color} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300`}
                >
                  {step.number}
                </div>

                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-pub-orange transition-colors">
                  {step.title}
                </h3>

                <p className="text-white/70 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:hidden flex justify-center mb-12">
          <div className="flex flex-col items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-8 bg-pub-orange/30 rounded-full"
              ></div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-linear-to-br from-pub-orange/20 to-pub-blue/20 backdrop-blur-sm border-2 border-pub-orange rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Spreman za akciju?
          </h3>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Pridruži se zajednici kviz entuzijasta i započni svoje takmičarsko
            putovanje već danas!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {status === "authenticated" ? (
              <Button
                onClick={() => {
                  router.push(getHref("/team", user));
                }}
                label="Pronađi tim →"
              />
            ) : (
              <Button
                onClick={() => {
                  router.push("/register");
                }}
                label="Registruj se →"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <h4 className="font-bold mb-2">Brza registracija</h4>
            <p className="text-sm text-white/70">
              Proces traje manje od 2 minuta
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <h4 className="font-bold mb-2">Potpuno besplatno</h4>
            <p className="text-sm text-white/70">Bez skrivenih troškova</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <h4 className="font-bold mb-2">Osvoji nagrade</h4>
            <p className="text-sm text-white/70">Vredne nagrade za pobednike</p>
          </div>
        </div>
      </div>
    </section>
  );
}
