export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          display_name: string | null
          avatar_url: string | null
          phone: string | null
          birth_date: string | null
          address: string | null
          professional_title: string | null
          company: string | null
          area_of_expertise: string | null
          bio: string | null
          notification_preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          display_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          birth_date?: string | null
          address?: string | null
          professional_title?: string | null
          company?: string | null
          area_of_expertise?: string | null
          bio?: string | null
          notification_preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          display_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          birth_date?: string | null
          address?: string | null
          professional_title?: string | null
          company?: string | null
          area_of_expertise?: string | null
          bio?: string | null
          notification_preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      farms: {
        Row: {
          id: string
          user_id: string
          name: string
          area: number
          location: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          name: string
          area: number
          location: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          area?: number
          location?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}