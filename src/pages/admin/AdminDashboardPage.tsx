import { StatCard } from "@/components/admin/StatCard";
import RecentList from "@/components/admin/RecentList";
import { useDashboardStats } from "@/features/admin/hooks/useDashboardStats";
import { useRecentInquiries, useRecentReviews } from "@/features/admin/hooks/useRecentActivity";

export function AdminDashboardPage() {
  const stats = useDashboardStats();
  const recentReviews = useRecentReviews();
  const recentInquiries = useRecentInquiries();

  return (
    <main className="min-h-screen">
      <header className="mb-6">
        <h1 className="font-display text-2xl text-charcoal">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of recent activity</p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {stats.isLoading ? (
          <>
            <div className="h-24 rounded-lg bg-muted" />
            <div className="h-24 rounded-lg bg-muted" />
            <div className="h-24 rounded-lg bg-muted" />
            <div className="h-24 rounded-lg bg-muted" />
          </>
        ) : stats.isError ? (
          <div className="col-span-full rounded-lg border border-border bg-card p-4 text-sm text-destructive">Failed to load dashboard stats.</div>
        ) : stats.isSuccess ? (
          <>
            <StatCard title="Total Projects" value={stats.data.projects} />
            <StatCard title="Total Reviews" value={stats.data.reviews} />
            <StatCard title="Total Inquiries" value={stats.data.inquiries} />
            <StatCard title="Instagram Posts" value={stats.data.instagramPosts} />
          </>
        ) : null}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {recentReviews.isLoading ? (
          <div className="rounded-lg border border-border bg-card p-4">Loading reviews…</div>
        ) : recentReviews.isError ? (
          <div className="rounded-lg border border-border bg-card p-4 text-sm text-destructive">Failed to load recent reviews.</div>
        ) : (
          <RecentList
            title="Recent Reviews"
            items={recentReviews.data ?? []}
            renderItem={(r) => (
              <div>
                <p className="font-medium text-sm text-charcoal">{r.reviewer_name}</p>
                <p className="text-sm text-muted-foreground">{r.review_text.length > 120 ? `${r.review_text.slice(0,120)}…` : r.review_text}</p>
              </div>
            )}
          />
        )}

        {recentInquiries.isLoading ? (
          <div className="rounded-lg border border-border bg-card p-4">Loading inquiries…</div>
        ) : recentInquiries.isError ? (
          <div className="rounded-lg border border-border bg-card p-4 text-sm text-destructive">Failed to load recent inquiries.</div>
        ) : (
          <RecentList
            title="Recent Inquiries"
            items={recentInquiries.data ?? []}
            renderItem={(i) => (
              <div>
                <p className="font-medium text-sm text-charcoal">{i.name}</p>
                <p className="text-sm text-muted-foreground">{i.message.length > 120 ? `${i.message.slice(0,120)}…` : i.message}</p>
              </div>
            )}
          />
        )}
      </section>
    </main>
  );
}
