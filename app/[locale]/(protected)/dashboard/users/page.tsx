 
import { prisma } from "@/lib/db";
 import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { UsersTable } from "./components/users-table";

export const metadata = {
  title: "Users | Dashboard",
};

export default async function UsersPage() {
  const user = await getCurrentUser();

  // Double-check authorization on the server-side as well
  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all users from the database
  const users = await prisma.user.findMany({
 
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
     },
  });

  return (
    <div className="container mx-auto py-10">
      <UsersTable initialUsers={users as any} />
    </div>
  );
}