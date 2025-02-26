export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      company_research: {
        Row: {
          company_name: string
          company_url: string | null
          created_at: string | null
          id: string
          report_content: Json
          report_type: string
          user_id: string
        }
        Insert: {
          company_name: string
          company_url?: string | null
          created_at?: string | null
          id?: string
          report_content: Json
          report_type: string
          user_id: string
        }
        Update: {
          company_name?: string
          company_url?: string | null
          created_at?: string | null
          id?: string
          report_content?: Json
          report_type?: string
          user_id?: string
        }
        Relationships: []
      }
      formatted_documents: {
        Row: {
          created_at: string
          formatted_filename: string
          id: string
          original_filename: string
          reference_filename: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          formatted_filename: string
          id?: string
          original_filename: string
          reference_filename?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          formatted_filename?: string
          id?: string
          original_filename?: string
          reference_filename?: string | null
          user_id?: string
        }
        Relationships: []
      }
      hashtag_generations: {
        Row: {
          created_at: string | null
          generated_hashtags: Json | null
          id: string
          input_text: string | null
          language: string | null
          length_preference: string | null
          num_hashtags: number | null
          platform: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          generated_hashtags?: Json | null
          id?: string
          input_text?: string | null
          language?: string | null
          length_preference?: string | null
          num_hashtags?: number | null
          platform?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          generated_hashtags?: Json | null
          id?: string
          input_text?: string | null
          language?: string | null
          length_preference?: string | null
          num_hashtags?: number | null
          platform?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      hired_agents: {
        Row: {
          agent_description: string
          agent_name: string
          agent_path: string
          hired_at: string
          id: string
          user_id: string
        }
        Insert: {
          agent_description: string
          agent_name: string
          agent_path: string
          hired_at?: string
          id?: string
          user_id: string
        }
        Update: {
          agent_description?: string
          agent_name?: string
          agent_path?: string
          hired_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applied_at: string | null
          company_name: string
          id: string
          job_description: string | null
          job_title: string
          job_url: string | null
          last_updated: string | null
          status: string
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          company_name: string
          id?: string
          job_description?: string | null
          job_title: string
          job_url?: string | null
          last_updated?: string | null
          status?: string
          user_id: string
        }
        Update: {
          applied_at?: string | null
          company_name?: string
          id?: string
          job_description?: string | null
          job_title?: string
          job_url?: string | null
          last_updated?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          company_website: string | null
          country: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          linkedin_profile: string | null
          notification_new_follower: boolean | null
          notification_new_rating: boolean | null
          role: string | null
          title: string | null
          writing_style: string | null
        }
        Insert: {
          city?: string | null
          company_website?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          linkedin_profile?: string | null
          notification_new_follower?: boolean | null
          notification_new_rating?: boolean | null
          role?: string | null
          title?: string | null
          writing_style?: string | null
        }
        Update: {
          city?: string | null
          company_website?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          linkedin_profile?: string | null
          notification_new_follower?: boolean | null
          notification_new_rating?: boolean | null
          role?: string | null
          title?: string | null
          writing_style?: string | null
        }
        Relationships: []
      }
      resume_templates: {
        Row: {
          created_at: string | null
          display_name: string
          id: string
          industry: string | null
          name: string
          preview_image_url: string | null
        }
        Insert: {
          created_at?: string | null
          display_name: string
          id?: string
          industry?: string | null
          name: string
          preview_image_url?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string
          id?: string
          industry?: string | null
          name?: string
          preview_image_url?: string | null
        }
        Relationships: []
      }
      resumes: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          is_public: boolean | null
          language: string | null
          share_token: string | null
          style_preferences: Json | null
          template_name: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          language?: string | null
          share_token?: string | null
          style_preferences?: Json | null
          template_name: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          language?: string | null
          share_token?: string | null
          style_preferences?: Json | null
          template_name?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          company_name: string
          id: string
          job_description: string | null
          job_title: string
          job_url: string | null
          saved_at: string | null
          user_id: string
        }
        Insert: {
          company_name: string
          id?: string
          job_description?: string | null
          job_title: string
          job_url?: string | null
          saved_at?: string | null
          user_id: string
        }
        Update: {
          company_name?: string
          id?: string
          job_description?: string | null
          job_title?: string
          job_url?: string | null
          saved_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      style_preferences: {
        Row: {
          created_at: string | null
          id: string
          preferences: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          preferences?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          preferences?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      wardrobe_items: {
        Row: {
          category: string
          created_at: string | null
          id: string
          image_url: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          id?: string
          image_url: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          image_url?: string
          user_id?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
