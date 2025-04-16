import { supabaseServer } from "@/chai/supabase.server";
import { ChaiBuilderPagesUserManagementInterface } from "@chaibuilder/pages/server";

export class SupabaseUserManagement
  implements ChaiBuilderPagesUserManagementInterface
{
  async getUserInfo(
    userId: string
  ): Promise<{ id: string; email: string; name: string; avatar: string }> {
    const { data, error } = await supabaseServer.auth.admin.getUserById(userId);
    if (error) {
      throw new Error(error.message);
    }
    return {
      id: data.user?.id,
      email: data.user?.email as string,
      name: data.user?.user_metadata.name || "",
      avatar: data.user?.user_metadata.avatar_url || "",
    };
  }

  async getUserRoleAndPermissions(
    userId: string
  ): Promise<{ role: string; permissions: string[] | null }> {
    /**
     * TODO: null permissions is passed to disable all permission checks
     * implement permission checks in the future
     */
    return { role: "admin", permissions: null };
  }

  async isUserActive(userId: string): Promise<boolean> {
    /**
     * TODO: implement user active status checks in the future
     */
    const allowedUsers = (process.env.ALLOWED_USER_IDS || "") as string;
    return allowedUsers.includes(userId);
  }

  async verifyTokenAndGetUser(
    token: string
  ): Promise<{ id: string; name: string; email: string } | null> {
    const { data, error } = await supabaseServer.auth.getUser(token);
    if (error) {
      return null;
    }
    return {
      id: data.user?.id,
      name: data.user?.user_metadata.name,
      email: data.user?.email as string,
    };
  }
}
