import Link from "next/link";
import Button from "../Button";

type Team = {
  id: string;
  name: string;
};

type Props = {
  team: Team | null;
};

export default function TeamSection({ team }: Props) {
  return (
    <div className="border shadow-xl flex flex-col items-center justify-center shadow-white/20 border-pub-orange bg-white/10 p-6 mt-20 w-full">
      <h2 className="mb-4 xl:text-4xl text-2xl font-semibold">
        Želiš da učestvuješ u kvizu?
      </h2>

      {team ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">
              Pogledaj detalje o svom timu i prati kako napredujete u kvizovima.
            </p>
            <p className="text-xl font-medium">{team.name}</p>
          </div>

          <Button href="/my-team" label="Moj tim" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between">
          <p className="text-white m-4">
            Još nisi deo nijednog tima. Pridruži se sada i počni da učestvuješ u
            kvizovima sa prijateljima!
          </p>
          <Button href="/my-team" label="Pridruži se timu" />
        </div>
      )}
    </div>
  );
}
