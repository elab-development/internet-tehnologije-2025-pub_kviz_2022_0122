"use client";
import { useEffect, useState } from "react";

type EventItem = {
	id: string | number;
	name: string;
	date: string;
	location?: string;
};

export default function Events() {
	const [events, setEvents] = useState<EventItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		fetch("/api/events")
			.then((res) => {
				if (!res.ok) throw new Error("Failed to load events");
				return res.json();
			})
			.then((data) => {
				if (mounted) setEvents(Array.isArray(data) ? data : data?.events ?? []);
			})
			.catch((e) => mounted && setError(e.message))
			.finally(() => mounted && setLoading(false));
		return () => {
			mounted = false;
		};
	}, []);

	const onSignUp = async (eventId: EventItem["id"]) => {
		// Adjust endpoint/method to match your API
		await fetch(`/api/events/${eventId}/signup`, { method: "POST" });
	};

	const formatDate = (value: string) => {
		const d = new Date(value);
		if (Number.isNaN(d.getTime())) return "";
		const yyyy = d.getFullYear();
		const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
		const mmm = months[d.getMonth()];
		const dd = String(d.getDate()).padStart(2, "0");
		return `${yyyy}-${mmm}-${dd}`;
	};

	const formatTime = (value: string) => {
		const d = new Date(value);
		if (Number.isNaN(d.getTime())) return "";
		const hh = String(d.getHours()).padStart(2, "0");
		const mm = String(d.getMinutes()).padStart(2, "0");
		return `${hh}:${mm}h`;
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;

	return (
        <div className="relative h-screen">
            <img
                src="/images/home/pub-hero.jpeg"
                alt="Pub Hero Image"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/70"></div>
            <div className="xl:container mx-auto self-center h-full flex items-center justify-center mt-[50px]">
                <div className="z-10 max-w-5xl mx-auto overflow-x-auto rounded-lg border border-pub-gray bg-pub-beige">
                    <table className="min-w-full border-collapse text-left">
                        <thead className="bg-pub-blue text-white">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Event</th>
                                <th className="px-4 py-3 font-semibold">Date</th>
                                <th className="px-4 py-3 font-semibold">Location</th>
                                <th className="px-4 py-3 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-pub-blue">
                            {events.map((ev) => (
                                <tr key={ev.id} className="border-t border-pub-gray">
                                    <td className="px-4 py-3">{ev.name}</td>
                                    <td className="px-4 py-3">
										{formatDate(ev.date)} {formatTime(ev.date)}
									</td>
                                    <td className="px-4 py-3">{ev.location ?? "-"}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            type="button"
                                            onClick={() => onSignUp(ev.id)}
                                            className="rounded-md bg-pub-orange px-3 py-2 text-sm font-semibold text-pub-blue hover:opacity-90"
                                        >
                                            Sign up
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
		
	);
}
