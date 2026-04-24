import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Activity, MessageSquare, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  getStudentLoginCount,
  getUploadedFiles,
  getActiveUserCount,
  getQueryCount,
  getActivityLog,
  type ActivityEntry,
} from "@/lib/campus-store";

function useStoreRefresh() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("campus-store-update", handler);
    return () => window.removeEventListener("campus-store-update", handler);
  }, []);
  return tick;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} day(s) ago`;
}

export function AdminAnalytics() {
  useStoreRefresh();

  const studentLogins = getStudentLoginCount();
  const filesUploaded = getUploadedFiles().length;
  const activeUsers = getActiveUserCount();
  const totalQueries = getQueryCount();
  const recentActivity = getActivityLog().slice(0, 10);

  const stats = [
    { label: "Student Logins", value: studentLogins, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Files Uploaded", value: filesUploaded, icon: FileText, color: "bg-campus-emerald/10 text-campus-emerald" },
    { label: "Active Users", value: activeUsers, icon: Activity, color: "bg-campus-amber/10 text-campus-amber" },
    { label: "Total Queries", value: totalQueries, icon: MessageSquare, color: "bg-chart-5/10 text-chart-5" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Analytics Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Real-time platform metrics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No activity yet. Activity will appear here when students or admins sign up and log in.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.user} ({item.role})</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{timeAgo(item.time)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
