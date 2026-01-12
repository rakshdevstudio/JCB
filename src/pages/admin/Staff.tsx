import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Star, Edit2, Trash2, MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Staff = () => {
  const { isSuperAdmin, isCityManager, getManagedSalonId } = useAuth();
  const managedSalonId = getManagedSalonId();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "Stylist",
    experience: "",
    specialties: "",
    salon_id: managedSalonId || "",
  });

  const { data: salons } = useQuery({
    queryKey: ["admin-salons-list"],
    queryFn: async () => {
      const { data } = await supabase.from("salons").select("id, name").eq("is_active", true);
      return data || [];
    },
    enabled: isSuperAdmin || isCityManager,
  });

  const { data: staff, isLoading } = useQuery({
    queryKey: ["admin-staff", managedSalonId],
    queryFn: async () => {
      let query = supabase
        .from("staff")
        .select(`*, salons:salon_id (name)`)
        .order("name");

      if (managedSalonId && !isSuperAdmin && !isCityManager) {
        query = query.eq("salon_id", managedSalonId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const addStaff = useMutation({
    mutationFn: async (staffData: any) => {
      const { error } = await supabase.from("staff").insert({
        ...staffData,
        specialties: staffData.specialties.split(",").map((s: string) => s.trim()).filter(Boolean),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      setIsAddOpen(false);
      setNewStaff({ name: "", role: "Stylist", experience: "", specialties: "", salon_id: managedSalonId || "" });
      toast.success("Staff member added");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteStaff = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("staff").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      toast.success("Staff member deleted");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const filteredStaff = staff?.filter((member: any) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Staff</h1>
          <p className="text-muted-foreground">Manage your salon team</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:opacity-90">
              <Plus className="w-4 h-4" />
              Add Staff
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addStaff.mutate(newStaff);
              }}
              className="space-y-4 mt-4"
            >
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <Input
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  placeholder="Stylist, Makeup Artist, etc."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Experience</label>
                <Input
                  value={newStaff.experience}
                  onChange={(e) => setNewStaff({ ...newStaff, experience: e.target.value })}
                  placeholder="5 years"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Specialties (comma separated)</label>
                <Input
                  value={newStaff.specialties}
                  onChange={(e) => setNewStaff({ ...newStaff, specialties: e.target.value })}
                  placeholder="Hair Cutting, Coloring, Styling"
                />
              </div>
              {(isSuperAdmin || isCityManager) && (
                <div>
                  <label className="text-sm font-medium">Salon</label>
                  <select
                    value={newStaff.salon_id}
                    onChange={(e) => setNewStaff({ ...newStaff, salon_id: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md"
                    required
                  >
                    <option value="">Select salon</option>
                    {salons?.map((salon: any) => (
                      <option key={salon.id} value={salon.id}>
                        {salon.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <button
                type="submit"
                disabled={addStaff.isPending}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-70"
              >
                {addStaff.isPending ? "Adding..." : "Add Staff"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search staff..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Staff Grid */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff?.map((member: any) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={member.image_url || "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400"}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 bg-white/90 rounded-md hover:bg-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteStaff.mutate(member.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                  </div>
                  {member.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{member.rating}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {member.salons?.name}
                </p>
                {member.experience && (
                  <p className="text-xs text-muted-foreground">{member.experience} experience</p>
                )}
                <div className="flex flex-wrap gap-1 mt-3">
                  {member.specialties?.slice(0, 3).map((s: string) => (
                    <span key={s} className="text-xs px-2 py-0.5 bg-muted rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Staff;
