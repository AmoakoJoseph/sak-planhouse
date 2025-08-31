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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      downloads: {
        Row: {
          created_at: string
          download_count: number
          id: string
          last_downloaded: string | null
          order_id: string
          plan_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          download_count?: number
          id?: string
          last_downloaded?: string | null
          order_id: string
          plan_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          download_count?: number
          id?: string
          last_downloaded?: string | null
          order_id?: string
          plan_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "downloads_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downloads_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_intent_id: string | null
          plan_id: string
          status: Database["public"]["Enums"]["order_status"]
          tier: Database["public"]["Enums"]["plan_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          payment_intent_id?: string | null
          plan_id: string
          status?: Database["public"]["Enums"]["order_status"]
          tier: Database["public"]["Enums"]["plan_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_intent_id?: string | null
          plan_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          tier?: Database["public"]["Enums"]["plan_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          area_sqft: number | null
          basic_price: number
          bathrooms: number | null
          bedrooms: number | null
          created_at: string
          description: string | null
          featured: boolean
          gallery_images: string[] | null
          id: string
          image_url: string | null
          plan_files: Json | null
          plan_type: Database["public"]["Enums"]["plan_type"]
          premium_price: number
          standard_price: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          area_sqft?: number | null
          basic_price?: number
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          featured?: boolean
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          plan_files?: Json | null
          plan_type: Database["public"]["Enums"]["plan_type"]
          premium_price?: number
          standard_price?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          area_sqft?: number | null
          basic_price?: number
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          featured?: boolean
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          plan_files?: Json | null
          plan_type?: Database["public"]["Enums"]["plan_type"]
          premium_price?: number
          standard_price?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      promote_user_to_admin: {
        Args: { user_email: string }
        Returns: undefined
      }
    }
    Enums: {
      DownloadStatus: "PENDING" | "READY" | "EXPIRED" | "FAILED"
      order_status: "pending" | "completed" | "cancelled" | "refunded"
      OrderStatus:
        | "PENDING"
        | "PROCESSING"
        | "COMPLETED"
        | "CANCELLED"
        | "REFUNDED"
      PaymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
      plan_tier: "basic" | "standard" | "premium"
      plan_type:
        | "villa"
        | "bungalow"
        | "townhouse"
        | "duplex"
        | "apartment"
        | "commercial"
      PlanStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED"
      PlanType:
        | "VILLA"
        | "BUNGALOW"
        | "TOWNHOUSE"
        | "COTTAGE"
        | "FARMHOUSE"
        | "APARTMENT"
        | "PENTHOUSE"
        | "DUPLEX"
        | "TINYHOUSE"
        | "MANSION"
      TierType: "BASIC" | "STANDARD" | "PREMIUM"
      user_role: "user" | "admin" | "super_admin"
      UserRole: "USER" | "ADMIN" | "SUPER_ADMIN"
      UserStatus: "ACTIVE" | "SUSPENDED" | "BANNED"
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
      DownloadStatus: ["PENDING", "READY", "EXPIRED", "FAILED"],
      order_status: ["pending", "completed", "cancelled", "refunded"],
      OrderStatus: [
        "PENDING",
        "PROCESSING",
        "COMPLETED",
        "CANCELLED",
        "REFUNDED",
      ],
      PaymentStatus: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      plan_tier: ["basic", "standard", "premium"],
      plan_type: [
        "villa",
        "bungalow",
        "townhouse",
        "duplex",
        "apartment",
        "commercial",
      ],
      PlanStatus: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      PlanType: [
        "VILLA",
        "BUNGALOW",
        "TOWNHOUSE",
        "COTTAGE",
        "FARMHOUSE",
        "APARTMENT",
        "PENTHOUSE",
        "DUPLEX",
        "TINYHOUSE",
        "MANSION",
      ],
      TierType: ["BASIC", "STANDARD", "PREMIUM"],
      user_role: ["user", "admin", "super_admin"],
      UserRole: ["USER", "ADMIN", "SUPER_ADMIN"],
      UserStatus: ["ACTIVE", "SUSPENDED", "BANNED"],
    },
  },
} as const
