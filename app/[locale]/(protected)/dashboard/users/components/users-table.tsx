"use client";

import { useState } from "react";
import { UserRole, User } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import posthog from "posthog-js";

interface UsersTableProps {
  initialUsers: User[];
}

export function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingUserId(userId);

    // Optimistic UI: update the UI immediately
    const originalUsers = [...users];
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        // If the API call fails, revert the change
        setUsers(originalUsers);
        throw new Error("Failed to update role");
      }

      const updatedUser = await response.json();
      // Ensure the state is consistent with the server response
      setUsers(
        users.map((user) =>
          user.id === userId ? updatedUser : user
        )
      );

      posthog.capture("user_role_updated", {
        role: newRole,
      });
      toast.success("User role updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the role.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value: UserRole) =>
                    handleRoleChange(user.id, value)
                  }
                  disabled={updatingUserId === user.id}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">
                      <Badge variant="secondary">USER</Badge>
                    </SelectItem>
                    <SelectItem value="ADMIN">
                      <Badge variant="default">ADMIN</Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
             
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}