export interface Event {
  id: string;
  title: string;
  datetime: string; // ISO format
  location: string;
  capacity: number; // 1-1000
  description?: string;
  registrations: Registration[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  user: User;
  registeredAt: string;
}

export interface EventStats {
  totalRegistrations: number;
  remainingCapacity: number;
  capacityUsedPercentage: number;
}

export interface CreateEventData {
  title: string;
  datetime: string;
  location: string;
  capacity: number;
  description?: string;
}

export interface RegisterUserData {
  name: string;
  email: string;
}