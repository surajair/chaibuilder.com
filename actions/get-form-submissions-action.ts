"use server";

import { supabaseServer } from "@/chai/supabase.server";

export interface FormSubmissionData {
  [key: string]: string | number | boolean | null | undefined;
}

export interface FormSubmission {
  id: number;
  createdAt: string;
  app: string;
  formData: FormSubmissionData;
  additionalData: FormSubmissionData;
}

export interface GetFormSubmissionsParams {
  websiteId: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetFormSubmissionsResponse {
  submissions: FormSubmission[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export async function getFormSubmissions({
  websiteId,
  page = 1,
  limit = 10,
  search = "",
}: GetFormSubmissionsParams): Promise<GetFormSubmissionsResponse> {
  try {
    const { data: submissionsData, error } = await supabaseServer
      .from("app_form_submissions")
      .select("*")
      .eq("app", websiteId)
      .ilike("formData->>formName", `%${search}%`)
      .order("createdAt", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      throw error;
    }
    
    const total = submissionsData.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const submissions = submissionsData.slice(startIndex, endIndex);

    return {
      submissions,
      total,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    throw new Error("Failed to fetch form submissions");
  }
}
