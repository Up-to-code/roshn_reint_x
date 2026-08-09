 
import { requireAdmin } from "@/lib/authorization";
import { userModule } from "@/lib/users/user-module";
import { UsersTable } from "./components/users-table";

export const metadata = {
  title: "Users | Dashboard",
};

export default async function UsersPage() {
  await requireAdmin();
  const users = await userModule.list();

  return (
    <div className="container mx-auto py-10">
      <UsersTable initialUsers={users} />
    </div>
  );
}
