import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit2, Trash2, MoreVertical, Clock } from "lucide-react";
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
import { cn } from "@/lib/utils";

const Services = () => {
  const { isSuperAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    duration: 60,
    base_price: 1000,
    category_id: "",
  });

  const { data: categories } = useQuery({
    queryKey: ["service-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("service_categories").select("*").order("display_order");
      return data || [];
    },
  });

  const { data: services, isLoading } = useQuery({
    queryKey: ["admin-services", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("services")
        .select(`*, service_categories:category_id (name, icon)`)
        .order("name");

      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const addService = useMutation({
    mutationFn: async (serviceData: any) => {
      const { error } = await supabase.from("services").insert(serviceData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      setIsAddOpen(false);
      setNewService({ name: "", description: "", duration: 60, base_price: 1000, category_id: "" });
      toast.success("Service added");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast.success("Service deleted");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const filteredServices = services?.filter((service: any) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Services</h1>
          <p className="text-muted-foreground">Manage service offerings and pricing</p>
        </div>
        {isSuperAdmin && (
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:opacity-90">
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addService.mutate(newService);
                }}
                className="space-y-4 mt-4"
              >
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Duration (minutes)</label>
                    <Input
                      type="number"
                      value={newService.duration}
                      onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Base Price (₹)</label>
                    <Input
                      type="number"
                      value={newService.base_price}
                      onChange={(e) => setNewService({ ...newService, base_price: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={newService.category_id}
                    onChange={(e) => setNewService({ ...newService, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md"
                    required
                  >
                    <option value="">Select category</option>
                    {categories?.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={addService.isPending}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-70"
                >
                  {addService.isPending ? "Adding..." : "Add Service"}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            All
          </button>
          {categories?.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Services Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg overflow-hidden"
      >
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : filteredServices?.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No services found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Service
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </th>
                  {isSuperAdmin && (
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredServices?.map((service: any) => (
                  <tr key={service.id} className="hover:bg-muted/30">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-foreground">{service.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {service.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-muted rounded text-sm">
                        {service.service_categories?.name}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {service.duration} min
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-medium text-foreground">
                        ₹{Number(service.base_price).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          "px-2 py-1 rounded text-xs font-medium",
                          service.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        )}
                      >
                        {service.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    {isSuperAdmin && (
                      <td className="px-4 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-muted rounded-md">
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteService.mutate(service.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    )}
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

export default Services;
