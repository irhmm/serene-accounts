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
      franchise_orders: {
        Row: {
          catatan: string | null
          catatan_handover: string | null
          created_at: string | null
          deadline: string | null
          detail_order: string
          id: string
          nomor_order: string
          pj_franchisee: string
          pj_mentor: string
          status_kelengkapan: string
          status_pengerjaan: string
          tanggal_masuk: string
          tanggal_selesai: string | null
          total_pembayaran: number
          updated_at: string | null
        }
        Insert: {
          catatan?: string | null
          catatan_handover?: string | null
          created_at?: string | null
          deadline?: string | null
          detail_order: string
          id?: string
          nomor_order: string
          pj_franchisee: string
          pj_mentor: string
          status_kelengkapan?: string
          status_pengerjaan?: string
          tanggal_masuk?: string
          tanggal_selesai?: string | null
          total_pembayaran?: number
          updated_at?: string | null
        }
        Update: {
          catatan?: string | null
          catatan_handover?: string | null
          created_at?: string | null
          deadline?: string | null
          detail_order?: string
          id?: string
          nomor_order?: string
          pj_franchisee?: string
          pj_mentor?: string
          status_kelengkapan?: string
          status_pengerjaan?: string
          tanggal_masuk?: string
          tanggal_selesai?: string | null
          total_pembayaran?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      franchises: {
        Row: {
          alamat: string
          catatan: string | null
          created_at: string | null
          id: string
          keterangan: string
          kontrak_berakhir: string
          kontrak_mulai: string
          nama_franchise: string
          rekening: string | null
          updated_at: string | null
        }
        Insert: {
          alamat: string
          catatan?: string | null
          created_at?: string | null
          id?: string
          keterangan?: string
          kontrak_berakhir: string
          kontrak_mulai: string
          nama_franchise: string
          rekening?: string | null
          updated_at?: string | null
        }
        Update: {
          alamat?: string
          catatan?: string | null
          created_at?: string | null
          id?: string
          keterangan?: string
          kontrak_berakhir?: string
          kontrak_mulai?: string
          nama_franchise?: string
          rekening?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mitra_orders: {
        Row: {
          catatan: string | null
          catatan_admin: string | null
          created_at: string | null
          detail_order: string
          fee_freelance: number
          id: string
          kekurangan: number
          nama_pj_freelance: string
          nomor_order: string
          status: string
          status_pelunasan: string
          status_pembayaran: string
          status_pengerjaan: string
          tanggal_end: string | null
          tanggal_start: string
          total_dp: number
          total_pembayaran: number
          type_order: string
          updated_at: string | null
        }
        Insert: {
          catatan?: string | null
          catatan_admin?: string | null
          created_at?: string | null
          detail_order: string
          fee_freelance?: number
          id?: string
          kekurangan?: number
          nama_pj_freelance: string
          nomor_order: string
          status?: string
          status_pelunasan?: string
          status_pembayaran?: string
          status_pengerjaan?: string
          tanggal_end?: string | null
          tanggal_start?: string
          total_dp?: number
          total_pembayaran?: number
          type_order?: string
          updated_at?: string | null
        }
        Update: {
          catatan?: string | null
          catatan_admin?: string | null
          created_at?: string | null
          detail_order?: string
          fee_freelance?: number
          id?: string
          kekurangan?: number
          nama_pj_freelance?: string
          nomor_order?: string
          status?: string
          status_pelunasan?: string
          status_pembayaran?: string
          status_pengerjaan?: string
          tanggal_end?: string | null
          tanggal_start?: string
          total_dp?: number
          total_pembayaran?: number
          type_order?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          catatan: string | null
          created_at: string | null
          detail: string
          id: string
          jumlah_keluar_dp: number
          jumlah_masuk_dp: number
          keterangan_freelance: string
          saldo_akhir: number
          status_pengeluaran: string
          tanggal: string
          type: string
          updated_at: string | null
        }
        Insert: {
          catatan?: string | null
          created_at?: string | null
          detail: string
          id?: string
          jumlah_keluar_dp?: number
          jumlah_masuk_dp?: number
          keterangan_freelance?: string
          saldo_akhir?: number
          status_pengeluaran?: string
          tanggal?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          catatan?: string | null
          created_at?: string | null
          detail?: string
          id?: string
          jumlah_keluar_dp?: number
          jumlah_masuk_dp?: number
          keterangan_freelance?: string
          saldo_akhir?: number
          status_pengeluaran?: string
          tanggal?: string
          type?: string
          updated_at?: string | null
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
      workers: {
        Row: {
          created_at: string | null
          id: string
          nama: string
          nomor_wa: string
          rekening: string | null
          role: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nama: string
          nomor_wa: string
          rekening?: string | null
          role?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nama?: string
          nomor_wa?: string
          rekening?: string | null
          role?: string
          status?: string
          updated_at?: string | null
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
