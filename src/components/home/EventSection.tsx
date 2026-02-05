import ButtonLink from "../Button";
import InfoCard from "../InfoCard";
import { eventsTableItems } from "../../constants/eventsTableItems";
import { events } from "../../constants/events";

export default function EventSection() {
  return (
    <section className="py-20 bg-transparent text-white">
      <div className="xl:container mx-auto xl:px-20 px-4">
        <h2 className="md:text-4xl text-3xl font-bold mb-8 text-center text-pub-blue">
          Nadolazeći događaji
        </h2>

        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 md:hidden place-items-center">
          {events.map((event) => (
            <InfoCard
              key={event.id}
              title={event.name}
              fields={[
                { label: "Tema", value: event.theme },
                { label: "Lokacija", value: event.location },
                {
                  label: "Datum",
                  value: new Date(event.event_date).toLocaleString("sr-RS"),
                },
                { label: "Kapacitet", value: event.capacity },
              ]}
              action={
                <ButtonLink href={`/events/${event.id}`} label="Detalji" />
              }
            />
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-pub-blue">
              <tr>
                {eventsTableItems.map((item) => (
                  <th
                    key={item.key}
                    className="px-4 py-3 text-left text-sm font-semibold text-white"
                  >
                    {item.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-pub-blue text-pub-blue"
                >
                  {eventsTableItems.map((item) => (
                    <td key={item.key} className="px-4 py-4">
                      {item.key === "event_date" &&
                        new Date(event.event_date).toLocaleString("sr-RS")}

                      {item.key === "action" && (
                        <ButtonLink
                          href={`/events/${event.id}`}
                          label="Detalji"
                        />
                      )}

                      {["name", "theme", "location", "capacity"].includes(
                        item.key,
                      ) && (event as any)[item.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
