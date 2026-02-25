import Team from "@/components/teams/Team";
import { use } from "react";

export default function TeamsPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = use(params);
  return <Team teamId={teamId} />;
}
