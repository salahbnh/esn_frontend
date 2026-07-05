"use client";

import { Mail, Plus, UserCog, UserX, UserCheck } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { EmptyState, ErrorState, LoadingState } from "@/components/common/async-states";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiError } from "@/lib/api-client";
import { fr } from "@/lib/i18n/fr";
import {
  useCreateUser,
  usePatchUserStatus,
  useResendUserInvite,
  useUsers,
} from "@/features/users/use-users";
import type { AdminUser, StaffRole } from "@/features/users/users.types";

const STAFF_ROLES: StaffRole[] = ["RH", "MANAGER", "DIRECTION"];

const ROLE_TONE: Record<string, string> = {
  RH: "bg-role-rh/15 text-role-rh border-transparent",
  MANAGER: "bg-role-mgr/15 text-role-mgr border-transparent",
  DIRECTION: "bg-role-dir/15 text-role-dir border-transparent",
  CONSULTANT: "bg-role-cons/15 text-role-cons border-transparent",
};

function errorMessage(err: unknown): string {
  if (err instanceof ApiError && typeof err.details === "object" && err.details !== null) {
    const code = (err.details as { code?: string }).code;
    if (code === "CANNOT_DEACTIVATE_SELF") return fr.users.errSelfDeactivate;
  }
  return fr.users.saveError;
}

export function UsersAdminView() {
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const query = useUsers({ pageSize: 100 });

  return (
    <section className="space-y-6">
      <PageHeader
        icon={UserCog}
        accent="users"
        title={fr.users.title}
        subtitle={fr.users.subtitle}
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" />
            {fr.users.new}
          </Button>
        }
      />

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={fr.users.searchPlaceholder}
        className="max-w-sm"
      />

      {query.isPending ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState onRetry={() => query.refetch()} />
      ) : (
        <UserTable
          users={query.data.data.filter((u) => {
            const q = search.trim().toLowerCase();
            if (!q) return true;
            return `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q);
          })}
        />
      )}

      <p className="text-xs text-muted-foreground">{fr.users.consultantNote}</p>

      {creating ? <CreateUserDialog onClose={() => setCreating(false)} /> : null}
    </section>
  );
}

function UserTable({ users }: { users: AdminUser[] }) {
  const { data: session } = useSession();
  const patchStatus = usePatchUserStatus();
  const resend = useResendUserInvite();

  if (users.length === 0) return <EmptyState title={fr.users.noResults} />;

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{fr.users.name}</TableHead>
            <TableHead className="hidden md:table-cell">{fr.users.email}</TableHead>
            <TableHead>{fr.users.role}</TableHead>
            <TableHead>{fr.users.userStatus}</TableHead>
            <TableHead className="text-right">{fr.actions.edit}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => {
            const isSelf = session?.user?.email === u.email;
            return (
              <TableRow key={u.id} className={!u.isActive ? "opacity-60" : undefined}>
                <TableCell className="font-medium">
                  {u.firstName} {u.lastName}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {u.email}
                </TableCell>
                <TableCell>
                  <Badge className={ROLE_TONE[u.role] ?? ""}>{fr.roles[u.role]}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={u.isActive ? "secondary" : "destructive"}>
                    {u.isActive ? fr.users.active : fr.users.inactive}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={fr.users.resendInvite}
                      title={fr.users.resendInvite}
                      onClick={() =>
                        resend.mutate(u.id, {
                          onSuccess: () => toast.success(fr.users.resendInviteSuccess),
                          onError: (e) => toast.error(errorMessage(e)),
                        })
                      }
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    {u.role !== "CONSULTANT" && !isSelf ? (
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label={u.isActive ? fr.users.deactivate : fr.users.activate}
                        title={u.isActive ? fr.users.deactivate : fr.users.activate}
                        onClick={() => {
                          if (u.isActive && !confirm(fr.users.deactivateConfirm)) return;
                          patchStatus.mutate(
                            { id: u.id, isActive: !u.isActive },
                            {
                              onSuccess: () => toast.success(fr.users.statusUpdated),
                              onError: (e) => toast.error(errorMessage(e)),
                            },
                          );
                        }}
                      >
                        {u.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function CreateUserDialog({ onClose }: { onClose: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<StaffRole>("MANAGER");
  const create = useCreateUser();

  async function onSubmit() {
    try {
      const user = await create.mutateAsync({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role,
      });
      toast.success(`${fr.users.createSuccess} ${user.email}`);
      onClose();
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.users.createTitle}</DialogTitle>
          <DialogDescription>{fr.users.createHint}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="u-fn">{fr.users.firstName} *</Label>
              <Input id="u-fn" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-ln">{fr.users.lastName} *</Label>
              <Input id="u-ln" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{fr.users.role} *</Label>
            <Select value={role} onValueChange={(v) => setRole(v as StaffRole)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STAFF_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{fr.roles[r]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {fr.users.cancel}
          </Button>
          <Button
            onClick={onSubmit}
            disabled={create.isPending || !firstName.trim() || !lastName.trim()}
          >
            {fr.users.create}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
