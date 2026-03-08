export type TeamMember = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type TeamPoints = {
  teamId: number;
  teamName: string;
  registrationDate?: string;
  points?: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  teamId: number | null;
  captain: boolean;
  createdAt: string;
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

export interface League {
  id: number;
  name: string;
  seasonCount?: number;
}

export interface Season {
  id: number;
  leagueId: number;
  name: string;
  isActive: boolean;
}

export interface SpecificLeague {
  id: number;
  name: string;
  seasons: Season[];
}

export interface Standing {
  totalPoints: number;
  teamId: number;
  teamName: string;
}

export type EventItem = {
  id: string | number;
  name: string;
  date: string;
  location?: string;
  capacity: number;
  theme?: string;
  price: number;
};
