export type UserRole = 'admin' | 'driver' | 'guest';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
}

export interface Note {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  timestamp: number;
}

export type SiteStatus = 'planned' | 'active' | 'completed' | 'issue';

export interface ConstructionSite {
  id: string;
  name: string; // Client Name or Site Name
  address: string;
  lat: number;
  lng: number;
  date: string; // ISO Date YYYY-MM-DD
  time: string; // HH:mm
  volume: number; // m3
  pumpType: string;
  status: SiteStatus;
  notes: Note[];
  images: string[]; // Base64 or URLs
  color: string;
  createdBy: string;
}

export interface AppState {
  user: User | null;
  sites: ConstructionSite[];
  theme: 'light' | 'dark';
  view: 'map' | 'list' | 'login';
}
