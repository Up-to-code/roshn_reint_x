import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export async function DELETE() {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    return new Response("Not authenticated", { status: 401 });
  }

  try {
    await db.user.delete({
      where: {
        id: currentUser.id,
      },
    });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }

  return new Response("User deleted successfully!", { status: 200 });
}
