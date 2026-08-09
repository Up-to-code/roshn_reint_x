import { requireAuthenticated } from "@/lib/authorization";
import { authorizationErrorResponse } from "@/lib/http/authorization-response";
import { userModule } from "@/lib/users/user-module";

export async function DELETE() {
  try {
    const currentUser = await requireAuthenticated();
    await userModule.delete(currentUser.id);
  } catch (error) {
    const denied = authorizationErrorResponse(error);
    if (denied) return denied;
    return new Response("Internal server error", { status: 500 });
  }

  return new Response("User deleted successfully!", { status: 200 });
}
