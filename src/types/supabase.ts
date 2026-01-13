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
          full_name: string | null
          role: 'admin' | 'lawyer' | 'staff' | null
          settings: Json | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: 'admin' | 'lawyer' | 'staff' | null
          settings?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: 'admin' | 'lawyer' | 'staff' | null
          settings?: Json | null
          created_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          created_at: string
          full_name: string
          email: string | null
          phone: string | null
          ai_context_note: string | null
          total_cases: number | null
          status: 'active' | 'archived' | null
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          full_name: string
          email?: string | null
          phone?: string | null
          ai_context_note?: string | null
          total_cases?: number | null
          status?: 'active' | 'archived' | null
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string
          email?: string | null
          phone?: string | null
          ai_context_note?: string | null
          total_cases?: number | null
          status?: 'active' | 'archived' | null
          user_id?: string | null
        }
      }
      leads: {
        Row: {
          id: string
          created_at: string
          full_name: string | null
          phone: string | null
          email: string | null
          type: 'inbound_missed' | 'outbound' | 'web_form' | 'manual' | null
          status: 'new' | 'in_progress' | 'attempted' | 'contacted' | 'converted' | 'lost' | 'archived' | 'missed' | null
          source: string | null
          attempts_count: number | null
          last_attempt_at: string | null
          next_contact_date: string | null
          call_duration: number | null
          call_outcome: string | null
          transcription: string | null
          recording_url: string | null
          call_summary: string | null
          notes: string | null
          ai_score: number | null
          ai_summary: string | null
          ai_sentiment: string | null
          ai_urgency: string | null
          assigned_to: string | null
          converted_client_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          full_name?: string | null
          phone?: string | null
          email?: string | null
          type?: 'inbound_missed' | 'outbound' | 'web_form' | 'manual' | null
          status?: 'new' | 'in_progress' | 'attempted' | 'contacted' | 'converted' | 'lost' | 'archived' | 'missed' | null
          source?: string | null
          attempts_count?: number | null
          last_attempt_at?: string | null
          next_contact_date?: string | null
          call_duration?: number | null
          call_outcome?: string | null
          transcription?: string | null
          recording_url?: string | null
          call_summary?: string | null
          notes?: string | null
                  ai_score?: number | null
                  ai_summary?: string | null
                  ai_sentiment?: string | null
                  ai_urgency?: string | null
                  assigned_to?: string | null
          converted_client_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string | null
          phone?: string | null
          email?: string | null
          type?: 'inbound_missed' | 'outbound' | 'web_form' | 'manual' | null
          status?: 'new' | 'in_progress' | 'attempted' | 'contacted' | 'converted' | 'lost' | 'archived' | 'missed' | null
          source?: string | null
          attempts_count?: number | null
          last_attempt_at?: string | null
          next_contact_date?: string | null
          call_duration?: number | null
          call_outcome?: string | null
          transcription?: string | null
          recording_url?: string | null
          call_summary?: string | null
          notes?: string | null
                  ai_score?: number | null
                  ai_summary?: string | null
                  ai_sentiment?: string | null
                  ai_urgency?: string | null
                  assigned_to?: string | null
          converted_client_id?: string | null
        }
      }
      cases: {
        Row: {
          id: string
          created_at: string
          title: string
          client_id: string | null
          status: 'active' | 'pending' | 'closed' | null
          court: string | null
          signature: string | null
          next_hearing: string | null
          notes: string | null
          stage: string | null
          judge: string | null
          assigned_lawyer: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          client_id?: string | null
          status?: 'active' | 'pending' | 'closed' | null
          court?: string | null
          signature?: string | null
          next_hearing?: string | null
          notes?: string | null
          stage?: string | null
          judge?: string | null
          assigned_lawyer?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          client_id?: string | null
          status?: 'active' | 'pending' | 'closed' | null
          court?: string | null
          signature?: string | null
          next_hearing?: string | null
          notes?: string | null
          stage?: string | null
          judge?: string | null
          assigned_lawyer?: string | null
        }
      }
      calendar_events: {
        Row: {
          id: string
          created_at: string
          title: string
          start_time: string
          end_time: string
          type: 'hearing' | 'deadline' | 'meeting' | null
          description: string | null
          location: string | null
          client_id: string | null
          case_id: string | null
          lawyer_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          start_time: string
          end_time: string
          type?: 'hearing' | 'deadline' | 'meeting' | null
          description?: string | null
          location?: string | null
          client_id?: string | null
          case_id?: string | null
          lawyer_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          start_time?: string
          end_time?: string
          type?: 'hearing' | 'deadline' | 'meeting' | null
          description?: string | null
          location?: string | null
          client_id?: string | null
          case_id?: string | null
          lawyer_id?: string | null
        }
      }
      client_notes: {
        Row: {
          id: string
          client_id: string
          content: string
          created_at: string
          author: string | null
        }
        Insert: {
          id?: string
          client_id: string
          content: string
          created_at?: string
          author?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          content?: string
          created_at?: string
          author?: string | null
        }
      }
      documents: {
        Row: {
          id: string
          created_at: string
          title: string
          type: 'pdf' | 'docx' | 'image' | 'other' | null
          size: string | null
          url: string | null
          category: 'Sądowe' | 'Administracyjne' | 'Finansowe' | 'Inne' | null
          client_id: string | null
          case_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          type?: 'pdf' | 'docx' | 'image' | 'other' | null
          size?: string | null
          url?: string | null
          category?: 'Sądowe' | 'Administracyjne' | 'Finansowe' | 'Inne' | null
          client_id?: string | null
          case_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          type?: 'pdf' | 'docx' | 'image' | 'other' | null
          size?: string | null
          url?: string | null
          category?: 'Sądowe' | 'Administracyjne' | 'Finansowe' | 'Inne' | null
          client_id?: string | null
          case_id?: string | null
          uploaded_by?: string | null
        }
      }
    }
  }
}
