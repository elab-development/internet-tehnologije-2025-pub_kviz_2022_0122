import ButtonLink from "../Button";

export default function EventSection() {
  const events = [
    {
      id: 1,
      name: "PubQuiz Novi Sad",
      date: "10.02.2026",
      time: "19:00",
      duration: "60 min",
    },
    {
      id: 2,
      name: "PubQuiz Beograd",
      date: "12.02.2026",
      time: "20:00",
      duration: "90 min",
    },
    {
      id: 3,
      name: "PubQuiz Niš",
      date: "15.02.2026",
      time: "18:30",
      duration: "75 min",
    },
  ];
  return (
    <section className="py-20 bg-pub-gray text-white">
      <div className="xl:container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Pogledaj naše nadolazeće događaje
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700 text-left">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold">Naziv kviza</th>
                <th className="px-6 py-3 text-sm font-semibold">Datum</th>
                <th className="px-6 py-3 text-sm font-semibold">Vreme</th>
                <th className="px-6 py-3 text-sm font-semibold">Trajanje</th>
                <th className="px-6 py-3 text-sm font-semibold">Akcija</th>
              </tr>
            </thead>
            <tbody>
              {events.map((quiz) => (
                <tr key={quiz.id} className="border-b border-gray-700">
                  <td className="px-6 py-4">{quiz.name}</td>
                  <td className="px-6 py-4">{quiz.date}</td>
                  <td className="px-6 py-4">{quiz.time}</td>
                  <td className="px-6 py-4">{quiz.duration}</td>
                  <td className="px-6 py-4">
                    <ButtonLink href="/register" label="Detalji" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
