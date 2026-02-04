import Link from "next/link";
import Button from "./Button";

type Team = {
  id: string;
  name: string;
};

type Props = {
  team: Team | null;
};

export default function TeamSection({ team }: Props) {
  return (
    <div className="border shadow-xl shadow-white/30 border-neutral-200 bg-transparent p-6 mt-20 w-full">
      <h2 className="mb-4 text-lg font-semibold">
        Želiš da učestvuješ u kvizu?
      </h2>

      {team ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">
              Pogledaj detalje o svom timu
            </p>
            <p className="text-xl font-medium">{team.name}</p>
          </div>

          <Link
            href="/my-team"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 transition"
          >
            Moj tim
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-white m-4">Još nisi deo nijednog tima.</p>

          <Button href="/create-team" label="Kreiraj tim" />
        </div>
      )}
    </div>
  );
}
