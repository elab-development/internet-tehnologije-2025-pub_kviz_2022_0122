export type TeamMember = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type TeamResponse = {
  id: number;
  name: string;
  createdAt: string;
  captain: {
    id: number;
    name: string;
  };
};

export type TeamJoinRequest = {
  teamId: number;
  userId: number;
  name: string;
  email: string;
  createdAt: string;
};