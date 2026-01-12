import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Phone,
  Mail,
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-700" },
  confirmed: { bg: "bg-green-100", text: "text-green-700" },
  completed: { bg: "bg-blue-100", text: "text-blue-700" },
  cancelled: { bg: "bg-red-100", text: "text-red-700" },
  no_show: { bg: "bg-gray-100", text: "text-gray-700" },
};

type BookingStatus = "cancelled" | "completed" | "confirmed" | "no_show" | "pending";

const Bookings = () => {
  const { isSuperAdmin, isCityManager, getManagedSalonId } = useAuth();
  const managedSalonId = getManagedSalonId();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["admin-bookings", managedSalonId, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("bookings")
        .select(`
          *,
          salons:salon_id (name, area),
          services:service_id (name, duration),
          staff:staff_id (name)
        `)
        .order("booking_date", { ascending: false })
        .order("booking_time", { ascending: false });

      if (managedSalonId && !isSuperAdmin && !isCityManager) {
        query = query.eq("salon_id", managedSalonId);
      }

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });


  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingStatus }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast.success("Booking status updated");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const filteredBookings = bookings?.filter((booking: any) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      booking.customer_name?.toLowerCase().includes(searchLower) ||
      booking.customer_email?.toLowerCase().includes(searchLower) ||
      booking.booking_reference?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
      case "no_show":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Bookings</h1>
          <p className="text-muted-foreground">Manage all salon appointments</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize",
                statusFilter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg overflow-hidden"
      >
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : filteredBookings?.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No bookings found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBookings?.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-muted/30">
                    <td className="px-4 py-4">
                      <span className="font-mono text-sm text-foreground">
                        {booking.booking_reference}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-foreground">{booking.customer_name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {booking.customer_email}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {booking.customer_phone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-foreground">{booking.services?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.salons?.name} • {booking.staff?.name || "Any stylist"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-foreground">
                          {format(new Date(booking.booking_date), "EEE, MMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.booking_time?.slice(0, 5)} • {booking.duration} min
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                          statusColors[booking.status]?.bg,
                          statusColors[booking.status]?.text
                        )}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-medium text-foreground">
                        ₹{Number(booking.price).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-muted rounded-md">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => updateStatus.mutate({ id: booking.id, status: "confirmed" })}
                            disabled={booking.status === "confirmed"}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStatus.mutate({ id: booking.id, status: "completed" })}
                            disabled={booking.status === "completed"}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStatus.mutate({ id: booking.id, status: "cancelled" })}
                            disabled={booking.status === "cancelled"}
                            className="text-destructive"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStatus.mutate({ id: booking.id, status: "no_show" })}
                            disabled={booking.status === "no_show"}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Mark No-Show
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Bookings;
