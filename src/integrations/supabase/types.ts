export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          admin_notes: string | null
          affiliation: Database["public"]["Enums"]["affiliation_type"]
          akamai_pillars: string[] | null
          attendees_count: number | null
          created_at: string
          duration_minutes: number | null
          external_attendees: number | null
          fabrication_description: string | null
          fabrication_quantity: number | null
          file_url: string | null
          id: string
          institution_name: string | null
          institution_type:
            | Database["public"]["Enums"]["institution_type"]
            | null
          purpose: string | null
          requested_date: string
          requester_email: string
          requester_name: string
          requester_phone: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          safety_agreed: boolean
          service_type: Database["public"]["Enums"]["service_type"]
          status: Database["public"]["Enums"]["request_status"]
          target_age_group: string | null
          updated_at: string
          waiver_agreed: boolean
          workshop_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          affiliation: Database["public"]["Enums"]["affiliation_type"]
          akamai_pillars?: string[] | null
          attendees_count?: number | null
          created_at?: string
          duration_minutes?: number | null
          external_attendees?: number | null
          fabrication_description?: string | null
          fabrication_quantity?: number | null
          file_url?: string | null
          id?: string
          institution_name?: string | null
          institution_type?:
            | Database["public"]["Enums"]["institution_type"]
            | null
          purpose?: string | null
          requested_date: string
          requester_email: string
          requester_name: string
          requester_phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          safety_agreed?: boolean
          service_type: Database["public"]["Enums"]["service_type"]
          status?: Database["public"]["Enums"]["request_status"]
          target_age_group?: string | null
          updated_at?: string
          waiver_agreed?: boolean
          workshop_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          affiliation?: Database["public"]["Enums"]["affiliation_type"]
          akamai_pillars?: string[] | null
          attendees_count?: number | null
          created_at?: string
          duration_minutes?: number | null
          external_attendees?: number | null
          fabrication_description?: string | null
          fabrication_quantity?: number | null
          file_url?: string | null
          id?: string
          institution_name?: string | null
          institution_type?:
            | Database["public"]["Enums"]["institution_type"]
            | null
          purpose?: string | null
          requested_date?: string
          requester_email?: string
          requester_name?: string
          requester_phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          safety_agreed?: boolean
          service_type?: Database["public"]["Enums"]["service_type"]
          status?: Database["public"]["Enums"]["request_status"]
          target_age_group?: string | null
          updated_at?: string
          waiver_agreed?: boolean
          workshop_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workshops: {
        Row: {
          age_max: number
          age_min: number
          capacity: number
          category: Database["public"]["Enums"]["workshop_category"]
          created_at: string
          description: string
          duration_minutes: number
          id: string
          is_archived: boolean
          title: string
          updated_at: string
        }
        Insert: {
          age_max?: number
          age_min?: number
          capacity?: number
          category?: Database["public"]["Enums"]["workshop_category"]
          created_at?: string
          description?: string
          duration_minutes?: number
          id?: string
          is_archived?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          age_max?: number
          age_min?: number
          capacity?: number
          category?: Database["public"]["Enums"]["workshop_category"]
          created_at?: string
          description?: string
          duration_minutes?: number
          id?: string
          is_archived?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      affiliation_type: "akamai" | "external"
      app_role: "admin" | "staff"
      institution_type: "school" | "university"
      request_status: "pending" | "approved" | "rescheduled" | "rejected"
      service_type: "lab_space" | "workshop" | "fabrication" | "institutional"
      workshop_category: "3d_design" | "electronics" | "programming" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      affiliation_type: ["akamai", "external"],
      app_role: ["admin", "staff"],
      institution_type: ["school", "university"],
      request_status: ["pending", "approved", "rescheduled", "rejected"],
      service_type: ["lab_space", "workshop", "fabrication", "institutional"],
      workshop_category: ["3d_design", "electronics", "programming", "other"],
    },
  },
} as const
