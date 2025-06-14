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
          is_visible: boolean
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
          is_visible?: boolean
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
          is_visible?: boolean
          title?: string
          type?: Database["public"]["Enums"]["changelog_entry_type"]
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      contributions: {
        Row: {
          content: string
          created_at: string
          id: string
          profile_id: string
          status: Database["public"]["Enums"]["contribution_status"]
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          profile_id: string
          status?: Database["public"]["Enums"]["contribution_status"]
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          profile_id?: string
          status?: Database["public"]["Enums"]["contribution_status"]
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contributions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      credit_expense_logs: {
        Row: {
          credit_id: string
          generation_date: string
          id: string
          notes: string | null
          status: string
          vehicle_expense_id: string | null
        }
        Insert: {
          credit_id: string
          generation_date?: string
          id?: string
          notes?: string | null
          status?: string
          vehicle_expense_id?: string | null
        }
        Update: {
          credit_id?: string
          generation_date?: string
          id?: string
          notes?: string | null
          status?: string
          vehicle_expense_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_expense_logs_credit_id_fkey"
            columns: ["credit_id"]
            isOneToOne: false
            referencedRelation: "credits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_expense_logs_vehicle_expense_id_fkey"
            columns: ["vehicle_expense_id"]
            isOneToOne: false
            referencedRelation: "vehicle_expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      credits: {
        Row: {
          auto_generate_vehicle_expense: boolean | null
          created_at: string
          date_derniere_mensualite: string
          date_premiere_mensualite: string | null
          id: string
          is_early_settlement: boolean | null
          logo_url: string | null
          montant_mensualite: number
          nom_credit: string
          nom_domaine: string
          profile_id: string
          statut: Database["public"]["Enums"]["credit_status"]
          updated_at: string
          vehicle_expense_type: string | null
          vehicle_id: string | null
        }
        Insert: {
          auto_generate_vehicle_expense?: boolean | null
          created_at?: string
          date_derniere_mensualite: string
          date_premiere_mensualite?: string | null
          id?: string
          is_early_settlement?: boolean | null
          logo_url?: string | null
          montant_mensualite: number
          nom_credit: string
          nom_domaine: string
          profile_id: string
          statut?: Database["public"]["Enums"]["credit_status"]
          updated_at?: string
          vehicle_expense_type?: string | null
          vehicle_id?: string | null
        }
        Update: {
          auto_generate_vehicle_expense?: boolean | null
          created_at?: string
          date_derniere_mensualite?: string
          date_premiere_mensualite?: string | null
          id?: string
          is_early_settlement?: boolean | null
          logo_url?: string | null
          montant_mensualite?: number
          nom_credit?: string
          nom_domaine?: string
          profile_id?: string
          statut?: Database["public"]["Enums"]["credit_status"]
          updated_at?: string
          vehicle_expense_type?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credits_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credits_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
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
      fuel_companies: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
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
      notification_logs: {
        Row: {
          details: Json | null
          id: string
          notification_type: string
          recipients_count: number | null
          sent_at: string | null
          success: boolean
        }
        Insert: {
          details?: Json | null
          id?: string
          notification_type: string
          recipients_count?: number | null
          sent_at?: string | null
          success: boolean
        }
        Update: {
          details?: Json | null
          id?: string
          notification_type?: string
          recipients_count?: number | null
          sent_at?: string | null
          success?: boolean
        }
        Relationships: []
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
          dashboard_preferences: Json | null
          encryption_enabled: boolean | null
          full_name: string | null
          id: string
          notif_changelog: boolean | null
          notif_credits: boolean | null
          notif_expenses: boolean | null
          notif_feedbacks: boolean | null
          notif_inscriptions: boolean | null
          onboarding_completed: boolean | null
          profile_type: Database["public"]["Enums"]["user_profile_type"]
          savings_goal_percentage: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          color_palette?: string | null
          dashboard_preferences?: Json | null
          encryption_enabled?: boolean | null
          full_name?: string | null
          id: string
          notif_changelog?: boolean | null
          notif_credits?: boolean | null
          notif_expenses?: boolean | null
          notif_feedbacks?: boolean | null
          notif_inscriptions?: boolean | null
          onboarding_completed?: boolean | null
          profile_type?: Database["public"]["Enums"]["user_profile_type"]
          savings_goal_percentage?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          color_palette?: string | null
          dashboard_preferences?: Json | null
          encryption_enabled?: boolean | null
          full_name?: string | null
          id?: string
          notif_changelog?: boolean | null
          notif_credits?: boolean | null
          notif_expenses?: boolean | null
          notif_feedbacks?: boolean | null
          notif_inscriptions?: boolean | null
          onboarding_completed?: boolean | null
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
          heating_type: string | null
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
          heating_type?: string | null
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
          heating_type?: string | null
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
      property_recurring_expenses: {
        Row: {
          created_at: string
          id: string
          property_id: string
          recurring_expense_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          recurring_expense_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          recurring_expense_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_recurring_expenses_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_recurring_expenses_recurring_expense_id_fkey"
            columns: ["recurring_expense_id"]
            isOneToOne: false
            referencedRelation: "recurring_expenses"
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
      recurring_expense_logs: {
        Row: {
          generation_date: string
          id: string
          notes: string | null
          recurring_expense_id: string
          status: string
          vehicle_expense_id: string | null
        }
        Insert: {
          generation_date?: string
          id?: string
          notes?: string | null
          recurring_expense_id: string
          status?: string
          vehicle_expense_id?: string | null
        }
        Update: {
          generation_date?: string
          id?: string
          notes?: string | null
          recurring_expense_id?: string
          status?: string
          vehicle_expense_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recurring_expense_logs_recurring_expense_id_fkey"
            columns: ["recurring_expense_id"]
            isOneToOne: false
            referencedRelation: "recurring_expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_expense_logs_vehicle_expense_id_fkey"
            columns: ["vehicle_expense_id"]
            isOneToOne: false
            referencedRelation: "vehicle_expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_expenses: {
        Row: {
          amount: number
          auto_generate_vehicle_expense: boolean | null
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
          vehicle_expense_type: string | null
          vehicle_id: string | null
        }
        Insert: {
          amount?: number
          auto_generate_vehicle_expense?: boolean | null
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
          vehicle_expense_type?: string | null
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          auto_generate_vehicle_expense?: boolean | null
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
          vehicle_expense_type?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recurring_expenses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_expenses_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
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
      stock_assets: {
        Row: {
          asset_type: string
          created_at: string | null
          current_price: number | null
          id: string
          name: string
          profile_id: string
          purchase_date: string
          purchase_price: number
          quantity: number
          symbol: string
          updated_at: string | null
        }
        Insert: {
          asset_type: string
          created_at?: string | null
          current_price?: number | null
          id?: string
          name: string
          profile_id: string
          purchase_date?: string
          purchase_price?: number
          quantity?: number
          symbol: string
          updated_at?: string | null
        }
        Update: {
          asset_type?: string
          created_at?: string | null
          current_price?: number | null
          id?: string
          name?: string
          profile_id?: string
          purchase_date?: string
          purchase_price?: number
          quantity?: number
          symbol?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      stock_investments: {
        Row: {
          amount: number
          asset_id: string | null
          created_at: string
          id: string
          investment_date: string
          notes: string | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          amount?: number
          asset_id?: string | null
          created_at?: string
          id?: string
          investment_date?: string
          notes?: string | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          asset_id?: string | null
          created_at?: string
          id?: string
          investment_date?: string
          notes?: string | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_investments_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "stock_assets"
            referencedColumns: ["id"]
          },
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
      vehicle_document_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicle_documents: {
        Row: {
          category_id: string | null
          content_type: string | null
          created_at: string | null
          description: string | null
          file_path: string
          file_size: number | null
          id: string
          name: string
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          category_id?: string | null
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          name: string
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          category_id?: string | null
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          name?: string
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "vehicle_document_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_documents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_expense_types: {
        Row: {
          category: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      vehicle_expenses: {
        Row: {
          amount: number
          comment: string | null
          created_at: string | null
          date: string
          expense_type: string
          fuel_company_id: string | null
          fuel_volume: number | null
          id: string
          maintenance_type: string | null
          mileage: number | null
          repair_type: string | null
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          amount: number
          comment?: string | null
          created_at?: string | null
          date: string
          expense_type: string
          fuel_company_id?: string | null
          fuel_volume?: number | null
          id?: string
          maintenance_type?: string | null
          mileage?: number | null
          repair_type?: string | null
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          amount?: number
          comment?: string | null
          created_at?: string | null
          date?: string
          expense_type?: string
          fuel_company_id?: string | null
          fuel_volume?: number | null
          id?: string
          maintenance_type?: string | null
          mileage?: number | null
          repair_type?: string | null
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_expenses_fuel_company_id_fkey"
            columns: ["fuel_company_id"]
            isOneToOne: false
            referencedRelation: "fuel_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_expenses_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          acquisition_date: string
          brand: string
          created_at: string | null
          fuel_type: string
          id: string
          model: string | null
          photo_url: string | null
          profile_id: string
          registration_number: string
          status: string
          updated_at: string | null
        }
        Insert: {
          acquisition_date: string
          brand: string
          created_at?: string | null
          fuel_type: string
          id?: string
          model?: string | null
          photo_url?: string | null
          profile_id: string
          registration_number: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          acquisition_date?: string
          brand?: string
          created_at?: string | null
          fuel_type?: string
          id?: string
          model?: string | null
          photo_url?: string | null
          profile_id?: string
          registration_number?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      are_contribution_notifications_enabled: {
        Args: { admin_id: string }
        Returns: boolean
      }
      can_access_page: {
        Args: { user_id: string; page_path: string }
        Returns: boolean
      }
      can_delete_account: {
        Args: { user_id_to_check: string }
        Returns: boolean
      }
      check_and_generate_vehicle_expenses: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_expired_credits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_notification_sent: {
        Args: {
          notification_type_param: string
          start_date: string
          end_date: string
        }
        Returns: boolean
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
        Args: { user_email: string }
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
        Args: { user_id_to_delete: string }
        Returns: undefined
      }
      export_financial_stats: {
        Args: { period?: string; start_date?: string; end_date?: string }
        Returns: Json
      }
      force_verify_user: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      generate_vehicle_expenses_from_credits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_vehicle_expenses_from_recurring: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_credits_stats_current_month: {
        Args: { p_profile_id: string }
        Returns: {
          credits_rembourses_count: number
          total_mensualites_remboursees: number
        }[]
      }
      get_expense_distribution: {
        Args: { period?: string; start_date?: string; end_date?: string }
        Returns: Json
      }
      get_financial_stats: {
        Args: { period?: string; start_date?: string; end_date?: string }
        Returns: Json
      }
      get_financial_trends: {
        Args: { period?: string; start_date?: string; end_date?: string }
        Returns: Json
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
      get_user_segmentation: {
        Args: { period?: string; start_date?: string; end_date?: string }
        Returns: Json
      }
      get_user_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_users_with_credit_notifications_enabled: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          profile_id: string
          credits_count: number
        }[]
      }
      get_users_with_expense_notifications_enabled: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          profile_id: string
        }[]
      }
      get_yearly_expenses_stats: {
        Args: { p_profile_id: string }
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
        Args: { user_id: string; role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      list_admins: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
        }[]
      }
      list_users: {
        Args: { page_number?: number; page_size?: number }
        Returns: {
          id: string
          email: string
          created_at: string
          avatar_url: string
          is_verified: boolean
        }[]
      }
      register_edge_function: {
        Args: { function_name: string }
        Returns: undefined
      }
      retailer_has_expenses: {
        Args: { p_retailer_id: string }
        Returns: boolean
      }
      update_contributor_percentages: {
        Args: { profile_id_param: string }
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
        Args: { reset_token: string }
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
      contribution_status: "pending" | "in_progress" | "completed"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      changelog_entry_type: ["new", "improvement", "bugfix"],
      contribution_status: ["pending", "in_progress", "completed"],
      credit_status: ["actif", "remboursé", "dépassé"],
      feedback_status: ["pending", "read", "published"],
      mode_planification_type: ["par_date", "par_mensualite"],
      notification_status: ["non_lu", "lu"],
      notification_type: ["credit_echeance", "autre"],
      password_reset_token_status: ["active", "used", "expired"],
      projet_epargne_status: ["actif", "en_attente", "dépassé"],
      user_profile_type: ["basic", "pro"],
    },
  },
} as const
