import { use } from "react";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  return (
    <div className="h-screen text-white p-30">
      Event Details Page for Event ID: {eventId}
    </div>
  );
}
