import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Users,
  Building2,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, startOfToday, endOfToday, startOfWeek, endOfWeek } from "date-fns";

const Dashboard = () => {
  const { profile, isSuperAdmin, isCityManager, isSalonManager, getManagedSalonId } = useAuth();
  const managedSalonId = getManagedSalonId();

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ["admin-stats", managedSalonId],
    queryFn: async () => {
      const today = format(startOfToday(), "yyyy-MM-dd");
      const weekStart = format(startOfWeek(new Date()), "yyyy-MM-dd");
      const weekEnd = format(endOfWeek(new Date()), "yyyy-MM-dd");

      // Build queries based on role
      let bookingsQuery = supabase.from("bookings").select("*", { count: "exact", head: true });
      let todayBookingsQuery = supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("booking_date", today);
      let weekBookingsQuery = supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .gte("booking_date", weekStart)
        .lte("booking_date", weekEnd);

      if (managedSalonId && !isSuperAdmin && !isCityManager) {
        bookingsQuery = bookingsQuery.eq("salon_id", managedSalonId);
        todayBookingsQuery = todayBookingsQuery.eq("salon_id", managedSalonId);
        weekBookingsQuery = weekBookingsQuery.eq("salon_id", managedSalonId);
      }

      const [totalBookings, todayBookings, weekBookings, salons, staff] = await Promise.all([
        bookingsQuery,
        todayBookingsQuery,
        weekBookingsQuery,
        supabase.from("salons").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("staff").select("*", { count: "exact", head: true }).eq("is_active", true),
      ]);

      return {
        totalBookings: totalBookings.count || 0,
        todayBookings: todayBookings.count || 0,
        weekBookings: weekBookings.count || 0,
        totalSalons: salons.count || 0,
        totalStaff: staff.count || 0,
      };
    },
  });

  // Fetch recent bookings
  const { data: recentBookings } = useQuery({
    queryKey: ["recent-bookings", managedSalonId],
    queryFn: async () => {
      let query = supabase
        .from("bookings")
        .select(`
          *,
          salons:salon_id (name),
          services:service_id (name)
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      if (managedSalonId && !isSuperAdmin && !isCityManager) {
        query = query.eq("salon_id", managedSalonId);
      }

      const { data } = await query;
      return data || [];
    },
  });

  const statCards = [
    {
      title: "Today's Bookings",
      value: stats?.todayBookings || 0,
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "This Week",
      value: stats?.weekBookings || 0,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Salons",
      value: stats?.totalSalons || 0,
      icon: Building2,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      hidden: !isSuperAdmin && !isCityManager,
    },
    {
      title: "Total Staff",
      value: stats?.totalStaff || 0,
      icon: Users,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ].filter((card) => !card.hidden);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-serif text-foreground"
        >
          Welcome back, {profile?.full_name?.split(" ")[0] || "Admin"}
        </motion.h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your salon today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border p-6 rounded-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-lg"
      >
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-serif text-foreground">Recent Bookings</h2>
        </div>
        <div className="divide-y divide-border">
          {recentBookings?.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No bookings yet
            </div>
          ) : (
            recentBookings?.map((booking: any) => (
              <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{booking.customer_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.services?.name} • {booking.salons?.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(booking.status)}
                    <span className="text-sm capitalize text-foreground">{booking.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(booking.booking_date), "MMM d")} at {booking.booking_time?.slice(0, 5)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
