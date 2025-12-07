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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      deals: {
        Row: {
          accepted_at: string | null
          company_email: string | null
          company_name: string
          completion_date: string | null
          contact_phone: string | null
          created_at: string
          deal_type: string
          deal_value: number | null
          id: string
          last_update_at: string | null
          location: string | null
          milestones: Json | null
          notes: string | null
          progress: number | null
          project_id: string
          project_images: string[] | null
          project_status: string | null
          project_title: string
          provider_id: string
          provider_name: string
          provider_type: string
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          company_email?: string | null
          company_name: string
          completion_date?: string | null
          contact_phone?: string | null
          created_at?: string
          deal_type: string
          deal_value?: number | null
          id?: string
          last_update_at?: string | null
          location?: string | null
          milestones?: Json | null
          notes?: string | null
          progress?: number | null
          project_id: string
          project_images?: string[] | null
          project_status?: string | null
          project_title: string
          provider_id: string
          provider_name: string
          provider_type: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          company_email?: string | null
          company_name?: string
          completion_date?: string | null
          contact_phone?: string | null
          created_at?: string
          deal_type?: string
          deal_value?: number | null
          id?: string
          last_update_at?: string | null
          location?: string | null
          milestones?: Json | null
          notes?: string | null
          progress?: number | null
          project_id?: string
          project_images?: string[] | null
          project_status?: string | null
          project_title?: string
          provider_id?: string
          provider_name?: string
          provider_type?: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deals_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "engineer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      engineer_profiles: {
        Row: {
          availability: string
          avatar_url: string | null
          bio: string | null
          certifications: string[]
          company_name: string | null
          company_size: string | null
          created_at: string
          email: string
          founded_year: number | null
          full_name: string
          hourly_rate: number | null
          id: string
          location: string
          phone: string | null
          profile_type: string
          rating: number
          referral_code: string | null
          referred_by: string | null
          specialties: string[]
          total_projects: number
          updated_at: string
          wallet_balance: number
          website_url: string | null
          years_experience: number
        }
        Insert: {
          availability: string
          avatar_url?: string | null
          bio?: string | null
          certifications?: string[]
          company_name?: string | null
          company_size?: string | null
          created_at?: string
          email: string
          founded_year?: number | null
          full_name: string
          hourly_rate?: number | null
          id: string
          location: string
          phone?: string | null
          profile_type?: string
          rating?: number
          referral_code?: string | null
          referred_by?: string | null
          specialties?: string[]
          total_projects?: number
          updated_at?: string
          wallet_balance?: number
          website_url?: string | null
          years_experience?: number
        }
        Update: {
          availability?: string
          avatar_url?: string | null
          bio?: string | null
          certifications?: string[]
          company_name?: string | null
          company_size?: string | null
          created_at?: string
          email?: string
          founded_year?: number | null
          full_name?: string
          hourly_rate?: number | null
          id?: string
          location?: string
          phone?: string | null
          profile_type?: string
          rating?: number
          referral_code?: string | null
          referred_by?: string | null
          specialties?: string[]
          total_projects?: number
          updated_at?: string
          wallet_balance?: number
          website_url?: string | null
          years_experience?: number
        }
        Relationships: []
      }
      referrals: {
        Row: {
          coins_awarded: number
          completed_at: string | null
          created_at: string
          id: string
          referral_code: string
          referred_profile_id: string
          referrer_profile_id: string
          status: string
        }
        Insert: {
          coins_awarded?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code: string
          referred_profile_id: string
          referrer_profile_id: string
          status?: string
        }
        Update: {
          coins_awarded?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_profile_id?: string
          referrer_profile_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_profile_id_fkey"
            columns: ["referred_profile_id"]
            isOneToOne: false
            referencedRelation: "engineer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_profile_id_fkey"
            columns: ["referrer_profile_id"]
            isOneToOne: false
            referencedRelation: "engineer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          case_study_url: string | null
          category: string
          created_at: string
          description: string
          duration_estimate: string | null
          features: string[]
          id: string
          image_url: string | null
          name: string
          price_model: string
          price_range: string | null
          profile_id: string
          rating: number | null
          total_completed: number | null
          updated_at: string
        }
        Insert: {
          case_study_url?: string | null
          category: string
          created_at?: string
          description: string
          duration_estimate?: string | null
          features?: string[]
          id?: string
          image_url?: string | null
          name: string
          price_model: string
          price_range?: string | null
          profile_id: string
          rating?: number | null
          total_completed?: number | null
          updated_at?: string
        }
        Update: {
          case_study_url?: string | null
          category?: string
          created_at?: string
          description?: string
          duration_estimate?: string | null
          features?: string[]
          id?: string
          image_url?: string | null
          name?: string
          price_model?: string
          price_range?: string | null
          profile_id?: string
          rating?: number | null
          total_completed?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "engineer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tools: {
        Row: {
          category: string
          created_at: string
          demo_url: string | null
          description: string
          documentation_url: string | null
          features: string[]
          id: string
          image_url: string | null
          name: string
          price_model: string
          price_range: string | null
          profile_id: string
          rating: number | null
          total_users: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          demo_url?: string | null
          description: string
          documentation_url?: string | null
          features?: string[]
          id?: string
          image_url?: string | null
          name: string
          price_model: string
          price_range?: string | null
          profile_id: string
          rating?: number | null
          total_users?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          demo_url?: string | null
          description?: string
          documentation_url?: string | null
          features?: string[]
          id?: string
          image_url?: string | null
          name?: string
          price_model?: string
          price_range?: string | null
          profile_id?: string
          rating?: number | null
          total_users?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tools_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "engineer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          profile_id: string
          transaction_type: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          profile_id: string
          transaction_type: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          profile_id?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "engineer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: { Args: never; Returns: string }
      process_referral: {
        Args: { new_profile_id: string; referral_code_used: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
