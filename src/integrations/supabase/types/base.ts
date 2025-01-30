import { HiredAgentsTable, JobApplicationsTable, ProfilesTable, SavedJobsTable } from './tables'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type PublicSchema = Database[Extract<keyof Database, "public">]

export interface Database {
  public: {
    Tables: {
      hired_agents: HiredAgentsTable
      job_applications: JobApplicationsTable
      profiles: ProfilesTable
      saved_jobs: SavedJobsTable
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