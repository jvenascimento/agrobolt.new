export interface Farm {
  id: string;
  user_id: string;
  name: string;
  area: number;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  display_name: string | null;
  avatar_url: string | null;
  cover_image: string | null;
  phone: string | null;
  birth_date: string | null;
  address: string | null;
  professional_title: string | null;
  company: string | null;
  area_of_expertise: string | null;
  bio: string | null;
  notification_preferences: {
    email: boolean;
    push: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainChance: number;
}

export interface MetricsData {
  totalArea: number;
  avgProductivity: number;
  totalRevenue: number;
  totalCosts: number;
  weatherAlerts: number;
  activeProjects: number;
}