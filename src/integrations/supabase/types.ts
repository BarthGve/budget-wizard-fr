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
      app_settings: {
        Row: {
          created_at: string
          description: string | null
          name: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          name: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          name?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      changelog_entries: {
        Row: {
          created_at: string
          date: string
          description: string
          id: string
          title: string
          type: Database["public"]["Enums"]["changelog_entry_type"]
          updated_at: string
          version: string
        }
        Insert: {
          created_at?: string
          date?: string
          description: string
          id?: string
          title: string
          type: Database["public"]["Enums"]["changelog_entry_type"]
          updated_at?: string
          version?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          id?: string
          title?: string
          type?: Database["public"]["Enums"]["changelog_entry_type"]
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      contributors: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_owner: boolean
          name: string
          percentage_contribution: number
          profile_id: string
          total_contribution: number
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_owner?: boolean
          name: string
          percentage_contribution?: number
          profile_id: string
          total_contribution?: number
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_owner?: boolean
          name?: string
          percentage_contribution?: number
          profile_id?: string
          total_contribution?: number
        }
        Relationships: [
          {
            foreignKeyName: "contributors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      credits: {
        Row: {
          created_at: string
          date_derniere_mensualite: string
          date_premiere_mensualite: string | null
          id: string
          logo_url: string | null
          montant_mensualite: number
          nom_credit: string
          nom_domaine: string
          profile_id: string
          statut: Database["public"]["Enums"]["credit_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_derniere_mensualite: string
          date_premiere_mensualite?: string | null
          id?: string
          logo_url?: string | null
          montant_mensualite: number
          nom_credit: string
          nom_domaine: string
          profile_id: string
          statut?: Database["public"]["Enums"]["credit_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_derniere_mensualite?: string
          date_premiere_mensualite?: string | null
          id?: string
          logo_url?: string | null
          montant_mensualite?: number
          nom_credit?: string
          nom_domaine?: string
          profile_id?: string
          statut?: Database["public"]["Enums"]["credit_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credits_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          comment: string | null
          created_at: string
          date: string
          id: string
          profile_id: string
          retailer_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          comment?: string | null
          created_at?: string
          date: string
          id?: string
          profile_id: string
          retailer_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          comment?: string | null
          created_at?: string
          date?: string
          id?: string
          profile_id?: string
          retailer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      feedbacks: {
        Row: {
          content: string
          created_at: string
          id: string
          profile_id: string
          rating: number | null
          status: Database["public"]["Enums"]["feedback_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          profile_id: string
          rating?: number | null
          status?: Database["public"]["Enums"]["feedback_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          profile_id?: string
          rating?: number | null
          status?: Database["public"]["Enums"]["feedback_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedbacks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_savings: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          is_project_saving: boolean | null
          logo_url: string | null
          name: string
          profile_id: string
          projet_id: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          is_project_saving?: boolean | null
          logo_url?: string | null
          name: string
          profile_id: string
          projet_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          is_project_saving?: boolean | null
          logo_url?: string | null
          name?: string
          profile_id?: string
          projet_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_savings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_savings_projet_id_fkey"
            columns: ["projet_id"]
            isOneToOne: false
            referencedRelation: "projets_epargne"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          credit_id: string | null
          date_envoi: string
          id: string
          message: string
          profile_id: string
          statut: Database["public"]["Enums"]["notification_status"]
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          credit_id?: string | null
          date_envoi?: string
          id?: string
          message: string
          profile_id: string
          statut?: Database["public"]["Enums"]["notification_status"]
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          credit_id?: string | null
          date_envoi?: string
          id?: string
          message?: string
          profile_id?: string
          statut?: Database["public"]["Enums"]["notification_status"]
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_credit_id_fkey"
            columns: ["credit_id"]
            isOneToOne: false
            referencedRelation: "credits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      page_permissions: {
        Row: {
          created_at: string
          feature_permissions: Json | null
          id: string
          page_name: string
          page_path: string
          required_profile: Database["public"]["Enums"]["user_profile_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          feature_permissions?: Json | null
          id?: string
          page_name: string
          page_path: string
          required_profile?: Database["public"]["Enums"]["user_profile_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          feature_permissions?: Json | null
          id?: string
          page_name?: string
          page_path?: string
          required_profile?: Database["public"]["Enums"]["user_profile_type"]
          updated_at?: string
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          profile_id: string
          status:
            | Database["public"]["Enums"]["password_reset_token_status"]
            | null
          token: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          profile_id: string
          status?:
            | Database["public"]["Enums"]["password_reset_token_status"]
            | null
          token: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          profile_id?: string
          status?:
            | Database["public"]["Enums"]["password_reset_token_status"]
            | null
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "password_reset_tokens_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          color_palette: string | null
          encryption_enabled: boolean | null
          full_name: string | null
          id: string
          notif_changelog: boolean | null
          notif_feedbacks: boolean | null
          notif_inscriptions: boolean | null
          profile_type: Database["public"]["Enums"]["user_profile_type"]
          savings_goal_percentage: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          color_palette?: string | null
          encryption_enabled?: boolean | null
          full_name?: string | null
          id: string
          notif_changelog?: boolean | null
          notif_feedbacks?: boolean | null
          notif_inscriptions?: boolean | null
          profile_type?: Database["public"]["Enums"]["user_profile_type"]
          savings_goal_percentage?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          color_palette?: string | null
          encryption_enabled?: boolean | null
          full_name?: string | null
          id?: string
          notif_changelog?: boolean | null
          notif_feedbacks?: boolean | null
          notif_inscriptions?: boolean | null
          profile_type?: Database["public"]["Enums"]["user_profile_type"]
          savings_goal_percentage?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projets_epargne: {
        Row: {
          added_to_recurring: boolean | null
          created_at: string
          date_estimee: string | null
          description: string | null
          id: string
          image_url: string | null
          mode_planification: Database["public"]["Enums"]["mode_planification_type"]
          montant_mensuel: number | null
          montant_total: number
          nom_projet: string
          nombre_mois: number | null
          profile_id: string
          statut: Database["public"]["Enums"]["projet_epargne_status"] | null
          updated_at: string
        }
        Insert: {
          added_to_recurring?: boolean | null
          created_at?: string
          date_estimee?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          mode_planification: Database["public"]["Enums"]["mode_planification_type"]
          montant_mensuel?: number | null
          montant_total: number
          nom_projet: string
          nombre_mois?: number | null
          profile_id: string
          statut?: Database["public"]["Enums"]["projet_epargne_status"] | null
          updated_at?: string
        }
        Update: {
          added_to_recurring?: boolean | null
          created_at?: string
          date_estimee?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          mode_planification?: Database["public"]["Enums"]["mode_planification_type"]
          montant_mensuel?: number | null
          montant_total?: number
          nom_projet?: string
          nombre_mois?: number | null
          profile_id?: string
          statut?: Database["public"]["Enums"]["projet_epargne_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projets_epargne_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          area: number
          created_at: string
          id: string
          investment_type: string | null
          latitude: number | null
          loan_payment: number | null
          longitude: number | null
          monthly_rent: number | null
          name: string
          photo_url: string | null
          profile_id: string
          purchase_value: number
          updated_at: string
        }
        Insert: {
          address: string
          area: number
          created_at?: string
          id?: string
          investment_type?: string | null
          latitude?: number | null
          loan_payment?: number | null
          longitude?: number | null
          monthly_rent?: number | null
          name: string
          photo_url?: string | null
          profile_id: string
          purchase_value: number
          updated_at?: string
        }
        Update: {
          address?: string
          area?: number
          created_at?: string
          id?: string
          investment_type?: string | null
          latitude?: number | null
          loan_payment?: number | null
          longitude?: number | null
          monthly_rent?: number | null
          name?: string
          photo_url?: string | null
          profile_id?: string
          purchase_value?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          id: string
          profile_id: string
          property_id: string
          updated_at: string
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          date?: string
          description: string
          id?: string
          profile_id: string
          property_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          profile_id?: string
          property_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_expenses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_expenses_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_expense_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurring_expense_categories_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          debit_day: number
          debit_month: number | null
          id: string
          logo_url: string | null
          name: string
          periodicity: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          debit_day?: number
          debit_month?: number | null
          id?: string
          logo_url?: string | null
          name: string
          periodicity?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          debit_day?: number
          debit_month?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          periodicity?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurring_expenses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      retailers: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "retailers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_investments: {
        Row: {
          amount: number
          created_at: string
          id: string
          investment_date: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          investment_date?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          investment_date?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_investments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      unsubscribe_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          notification_type: string
          profile_id: string
          status: string | null
          token: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          notification_type: string
          profile_id: string
          status?: string | null
          token: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          notification_type?: string
          profile_id?: string
          status?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "unsubscribe_tokens_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          role?: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_page: {
        Args: {
          user_id: string
          page_path: string
        }
        Returns: boolean
      }
      can_delete_account: {
        Args: {
          user_id_to_check: string
        }
        Returns: boolean
      }
      check_expired_credits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_admin_user: {
        Args: {
          email: string
          password: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Returns: Json
      }
      create_password_reset_token: {
        Args: {
          user_email: string
        }
        Returns: {
          success: boolean
          message: string
          token: string
        }[]
      }
      delete_own_account: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_user: {
        Args: {
          user_id_to_delete: string
        }
        Returns: undefined
      }
      force_verify_user: {
        Args: {
          target_user_id: string
        }
        Returns: undefined
      }
      get_credits_stats_current_month: {
        Args: {
          p_profile_id: string
        }
        Returns: {
          credits_rembourses_count: number
          total_mensualites_remboursees: number
        }[]
      }
      get_non_admin_user_emails: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
        }[]
      }
      get_total_users: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_yearly_expenses_stats: {
        Args: {
          p_profile_id: string
        }
        Returns: {
          year: number
          total_amount: number
        }[]
      }
      handle_expired_savings_projects: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      list_admins: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
        }[]
      }
      list_users: {
        Args: {
          page_number?: number
          page_size?: number
        }
        Returns: {
          id: string
          email: string
          created_at: string
          avatar_url: string
          is_verified: boolean
        }[]
      }
      register_edge_function: {
        Args: {
          function_name: string
        }
        Returns: undefined
      }
      retailer_has_expenses: {
        Args: {
          p_retailer_id: string
        }
        Returns: boolean
      }
      update_contributor_percentages: {
        Args: {
          profile_id_param: string
        }
        Returns: undefined
      }
      update_user_profile: {
        Args: {
          target_user_id: string
          new_profile: Database["public"]["Enums"]["user_profile_type"]
        }
        Returns: undefined
      }
      verify_reset_token: {
        Args: {
          reset_token: string
        }
        Returns: {
          is_valid: boolean
          profile_id: string
          email: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      changelog_entry_type: "new" | "improvement" | "bugfix"
      credit_status: "actif" | "remboursé" | "dépassé"
      feedback_status: "pending" | "read" | "published"
      mode_planification_type: "par_date" | "par_mensualite"
      notification_status: "non_lu" | "lu"
      notification_type: "credit_echeance" | "autre"
      password_reset_token_status: "active" | "used" | "expired"
      projet_epargne_status: "actif" | "en_attente" | "dépassé"
      user_profile_type: "basic" | "pro"
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
