type Event = {
  id: number;
  season_id: number;
  name: string;
  theme?: string;
  location: string;
  event_date: string;
  capacity: number;
};
export const events: Event[] = [
  {
    id: 1,
    season_id: 1,
    name: "PubQuiz Novi Sad",
    theme: "Film & TV",
    location: "Pub XYZ",
    event_date: "2026-02-10T19:00:00",
    capacity: 60,
  },
  {
    id: 2,
    season_id: 1,
    name: "PubQuiz Beograd",
    theme: "Opšte znanje",
    location: "Bar ABC",
    event_date: "2026-02-12T20:00:00",
    capacity: 80,
  },
];
