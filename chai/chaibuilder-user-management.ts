import { supabase } from "@/chai/supabase";
import { ChaiBuilderPagesUserManagementInterface } from "@chaibuilder/pages/server";

export class ChaiBuilderUserManagement
  implements ChaiBuilderPagesUserManagementInterface
{
  async getUserInfo(
    userId: string
  ): Promise<{ id: string; email: string; name: string; avatar: string }> {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, avatar")
      .eq("id", userId)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    return [];
  }

  async isUserActive(userId: string): Promise<boolean> {
    console.log("isUserActive", userId);
    return true;
  }

  async verifyTokenAndGetUser(
    token: string
  ): Promise<{ id: string; name: string; email: string }> {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      return {
        id: "",
        name: "",
        email: "",
      };
    }
    return {
      id: data.user?.id,
      name: data.user?.user_metadata.name,
      email: data.user?.email as string,
    };
  }
}
