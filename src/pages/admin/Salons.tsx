import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, MapPin, Star, Edit2, Trash2, MoreVertical } from "lucide-react";
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

const Salons = () => {
  const { isSuperAdmin, isCityManager, getManagedCityId } = useAuth();
  const managedCityId = getManagedCityId();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSalon, setNewSalon] = useState({
    name: "",
    area: "",
    address: "",
    phone: "",
    city_id: managedCityId || "",
  });

  const { data: cities } = useQuery({
    queryKey: ["cities-list"],
    queryFn: async () => {
      const { data } = await supabase.from("cities").select("*").eq("is_active", true);
      return data || [];
    },
  });

  const { data: salons, isLoading } = useQuery({
    queryKey: ["admin-salons", managedCityId],
    queryFn: async () => {
      let query = supabase
        .from("salons")
        .select(`*, cities:city_id (name)`)
        .order("name");

      if (managedCityId && !isSuperAdmin) {
        query = query.eq("city_id", managedCityId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const addSalon = useMutation({
    mutationFn: async (salonData: any) => {
      const { error } = await supabase.from("salons").insert(salonData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-salons"] });
      setIsAddOpen(false);
      setNewSalon({ name: "", area: "", address: "", phone: "", city_id: managedCityId || "" });
      toast.success("Salon added");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteSalon = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("salons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-salons"] });
      toast.success("Salon deleted");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const filteredSalons = salons?.filter((salon: any) =>
    salon.name.toLowerCase().includes(search.toLowerCase()) ||
    salon.area.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Salons</h1>
          <p className="text-muted-foreground">Manage salon locations</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:opacity-90">
              <Plus className="w-4 h-4" />
              Add Salon
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Salon</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addSalon.mutate(newSalon);
              }}
              className="space-y-4 mt-4"
            >
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newSalon.name}
                  onChange={(e) => setNewSalon({ ...newSalon, name: e.target.value })}
                  placeholder="JCB Phoenix Mills"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Area</label>
                <Input
                  value={newSalon.area}
                  onChange={(e) => setNewSalon({ ...newSalon, area: e.target.value })}
                  placeholder="Lower Parel"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={newSalon.address}
                  onChange={(e) => setNewSalon({ ...newSalon, address: e.target.value })}
                  placeholder="Full address"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={newSalon.phone}
                  onChange={(e) => setNewSalon({ ...newSalon, phone: e.target.value })}
                  placeholder="+91 22 1234 5678"
                />
              </div>
              {isSuperAdmin && (
                <div>
                  <label className="text-sm font-medium">City</label>
                  <select
                    value={newSalon.city_id}
                    onChange={(e) => setNewSalon({ ...newSalon, city_id: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md"
                    required
                  >
                    <option value="">Select city</option>
                    {cities?.map((city: any) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <button
                type="submit"
                disabled={addSalon.isPending}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-70"
              >
                {addSalon.isPending ? "Adding..." : "Add Salon"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search salons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Salons Grid */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSalons?.map((salon: any) => (
            <motion.div
              key={salon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <div className="aspect-video relative">
                <img
                  src={salon.image_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800"}
                  alt={salon.name}
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
                        onClick={() => deleteSalon.mutate(salon.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {salon.rating && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-white/90 rounded text-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{salon.rating}</span>
                    <span className="text-muted-foreground">({salon.review_count})</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-foreground text-lg">{salon.name}</h3>
                <p className="text-sm text-primary mb-2">{salon.area}</p>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{salon.address}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{salon.cities?.name}</span>
                  <span className="text-muted-foreground">
                    {salon.open_time?.slice(0, 5)} - {salon.close_time?.slice(0, 5)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Salons;
