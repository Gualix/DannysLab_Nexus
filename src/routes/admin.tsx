import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { SERVICE_TYPE_LABEL, STATUS_LABEL } from "@/lib/constants";
import { format } from "date-fns";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Danny's Lab" }] }),
});

interface RequestRow {
  id: string;
  service_type: string;
  status: string;
  requester_name: string;
  requester_email: string;
  affiliation: string;
  requested_date: string;
  created_at: string;
}

function AdminPage() {
  const { user, loading, isStaff } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!isStaff) return;
    supabase
      .from("service_requests")
      .select("id,service_type,status,requester_name,requester_email,affiliation,requested_date,created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setRows((data ?? []) as RequestRow[]));
  }, [isStaff]);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/login" });
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("service_requests")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ status, reviewed_at: new Date().toISOString() } as any)
      .eq("id", id);
    if (error) { toast.error(error.message); return; }
    setRows((r) => r.map((row) => (row.id === id ? { ...row, status } : row)));
    toast.success("Status updated");
  };

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading…</div>;

  if (user && !isStaff) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 grid place-items-center p-8 text-center">
          <div className="max-w-md">
            <h1 className="text-2xl font-semibold">Awaiting admin role</h1>
            <p className="mt-3 text-muted-foreground">
              Your account is registered but does not yet have admin access. Ask an existing
              administrator to assign you a role in the user_roles table.
            </p>
            <Button onClick={signOut} variant="outline" className="mt-6 rounded-xl">Sign out</Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const visible = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage incoming service requests.</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={signOut} variant="outline" className="rounded-xl">Sign out</Button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card elevation-1">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Requester</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Affiliation</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.requester_name}</div>
                    <div className="text-xs text-muted-foreground">{r.requester_email}</div>
                  </td>
                  <td className="px-4 py-3">{SERVICE_TYPE_LABEL[r.service_type] ?? r.service_type}</td>
                  <td className="px-4 py-3">{format(new Date(r.requested_date), "PP")}</td>
                  <td className="px-4 py-3 capitalize">{r.affiliation}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                      {STATUS_LABEL[r.status] ?? r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                      <SelectTrigger className="ml-auto w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approve</SelectItem>
                        <SelectItem value="rescheduled">Reschedule</SelectItem>
                        <SelectItem value="rejected">Reject</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No requests yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Notification email: <strong>stem-costarica@akamai.com</strong> ·{" "}
          <Link to="/" className="underline hover:text-foreground">Public hub</Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
