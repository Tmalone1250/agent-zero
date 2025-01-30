export interface HiredAgentsTable {
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

export interface JobApplicationsTable {
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

export interface ProfilesTable {
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

export interface SavedJobsTable {
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