export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: number
          image_url: string
          position: number | null
          product_id: number
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: number
          image_url: string
          position?: number | null
          product_id: number
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: number
          image_url?: string
          position?: number | null
          product_id?: number
          updated_at?: string
        }
      }
      products: {
        Row: {
          active: boolean | null
          created_at: string
          description: string
          details: string | null
          id: number
          metadata: Json | null
          price: number
          product_name: string
          product_type: string | null
          shop_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description: string
          details?: string | null
          id?: number
          metadata?: Json | null
          price: number
          product_name: string
          product_type?: string | null
          shop_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string
          details?: string | null
          id?: number
          metadata?: Json | null
          price?: number
          product_name?: string
          product_type?: string | null
          shop_id?: number
          updated_at?: string
          user_id?: string
        }
      }
      shops: {
        Row: {
          created_at: string
          custom_domain: string | null
          description: string | null
          id: number
          image: string | null
          logo: string | null
          shop_name: string
          subdomain: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_domain?: string | null
          description?: string | null
          id?: number
          image?: string | null
          logo?: string | null
          shop_name: string
          subdomain?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custom_domain?: string | null
          description?: string | null
          id?: number
          image?: string | null
          logo?: string | null
          shop_name?: string
          subdomain?: string | null
          updated_at?: string
          user_id?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
