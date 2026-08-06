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
      chat_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          sender: string
          session_id: string
          staff_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender: string
          session_id: string
          staff_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender?: string
          session_id?: string
          staff_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          assigned_staff: string | null
          created_at: string
          id: string
          ip_address: string | null
          lead_id: string | null
          location: string | null
          status: string
          updated_at: string
          visitor_email: string
          visitor_name: string
          visitor_phone: string
          visitor_token: string
        }
        Insert: {
          assigned_staff?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          lead_id?: string | null
          location?: string | null
          status?: string
          updated_at?: string
          visitor_email: string
          visitor_name: string
          visitor_phone: string
          visitor_token?: string
        }
        Update: {
          assigned_staff?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          lead_id?: string | null
          location?: string | null
          status?: string
          updated_at?: string
          visitor_email?: string
          visitor_name?: string
          visitor_phone?: string
          visitor_token?: string
        }
        Relationships: []
      }
      crm_notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          target_roles: Json
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          target_roles?: Json
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          target_roles?: Json
          type?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          assigned_to: string | null
          chat_history: Json
          created_at: string
          created_at_text: string | null
          email: string
          id: string
          ip_address: string | null
          last_contact: string | null
          location: string | null
          name: string
          notes: string | null
          phone: string
          project_id: string | null
          service_interest: Json
          source: string
          status: string
        }
        Insert: {
          assigned_to?: string | null
          chat_history?: Json
          created_at?: string
          created_at_text?: string | null
          email: string
          id: string
          ip_address?: string | null
          last_contact?: string | null
          location?: string | null
          name: string
          notes?: string | null
          phone: string
          project_id?: string | null
          service_interest?: Json
          source?: string
          status?: string
        }
        Update: {
          assigned_to?: string | null
          chat_history?: Json
          created_at?: string
          created_at_text?: string | null
          email?: string
          id?: string
          ip_address?: string | null
          last_contact?: string | null
          location?: string | null
          name?: string
          notes?: string | null
          phone?: string
          project_id?: string | null
          service_interest?: Json
          source?: string
          status?: string
        }
        Relationships: []
      }
      portal_files: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
          project_id: string
          size: string | null
          storage_path: string | null
          uploaded_by: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          name: string
          project_id: string
          size?: string | null
          storage_path?: string | null
          uploaded_by?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
          project_id?: string
          size?: string | null
          storage_path?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          project_id: string
          read: boolean
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          project_id: string
          read?: boolean
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          project_id?: string
          read?: boolean
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          department: string | null
          email: string | null
          id: string
          joined_date: string | null
          name: string
          phone: string | null
          project_id: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          id: string
          joined_date?: string | null
          name?: string
          phone?: string | null
          project_id?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          joined_date?: string | null
          name?: string
          phone?: string | null
          project_id?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          amount_paid: number
          assigned_manager: string | null
          assigned_production: Json
          book_title: string
          client_email: string
          client_id_text: string | null
          client_name: string
          client_user_id: string | null
          contract_signed: boolean
          contract_signed_at: string | null
          contract_signed_by: string | null
          created_at: string
          estimated_completion: string | null
          genre: string
          health: string
          id: string
          internal_notes: Json
          invoices: Json
          messages: Json
          nda_signed: boolean
          nda_signed_at: string | null
          nda_signed_by: string | null
          outstanding: number
          stages: Json
          start_date: string | null
          tasks: Json
          total_value: number
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          assigned_manager?: string | null
          assigned_production?: Json
          book_title: string
          client_email: string
          client_id_text?: string | null
          client_name: string
          client_user_id?: string | null
          contract_signed?: boolean
          contract_signed_at?: string | null
          contract_signed_by?: string | null
          created_at?: string
          estimated_completion?: string | null
          genre?: string
          health?: string
          id: string
          internal_notes?: Json
          invoices?: Json
          messages?: Json
          nda_signed?: boolean
          nda_signed_at?: string | null
          nda_signed_by?: string | null
          outstanding?: number
          stages?: Json
          start_date?: string | null
          tasks?: Json
          total_value?: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          assigned_manager?: string | null
          assigned_production?: Json
          book_title?: string
          client_email?: string
          client_id_text?: string | null
          client_name?: string
          client_user_id?: string | null
          contract_signed?: boolean
          contract_signed_at?: string | null
          contract_signed_by?: string | null
          created_at?: string
          estimated_completion?: string | null
          genre?: string
          health?: string
          id?: string
          internal_notes?: Json
          invoices?: Json
          messages?: Json
          nda_signed?: boolean
          nda_signed_at?: string | null
          nda_signed_by?: string | null
          outstanding?: number
          stages?: Json
          start_date?: string | null
          tasks?: Json
          total_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wise_recipients: {
        Row: {
          account_details: Json | null
          account_holder_name: string | null
          country: string | null
          created_at: string
          currency: string | null
          id: string
          user_id: string | null
          wise_account_id: string | null
        }
        Insert: {
          account_details?: Json | null
          account_holder_name?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          user_id?: string | null
          wise_account_id?: string | null
        }
        Update: {
          account_details?: Json | null
          account_holder_name?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          user_id?: string | null
          wise_account_id?: string | null
        }
        Relationships: []
      }
      wise_transfers: {
        Row: {
          created_at: string
          id: string
          quote_id: string | null
          recipient_id: string | null
          reference: string | null
          source_amount: number | null
          source_currency: string | null
          status: string | null
          target_amount: number | null
          target_currency: string | null
          transfer_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          quote_id?: string | null
          recipient_id?: string | null
          reference?: string | null
          source_amount?: number | null
          source_currency?: string | null
          status?: string | null
          target_amount?: number | null
          target_currency?: string | null
          transfer_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          quote_id?: string | null
          recipient_id?: string | null
          reference?: string | null
          source_amount?: number | null
          source_currency?: string | null
          status?: string | null
          target_amount?: number | null
          target_currency?: string | null
          transfer_id?: string | null
          updated_at?: string
          user_id?: string | null
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
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "project_manager"
        | "salesperson"
        | "production"
        | "client"
        | "admin"
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
      app_role: [
        "project_manager",
        "salesperson",
        "production",
        "client",
        "admin",
      ],
    },
  },
} as const
