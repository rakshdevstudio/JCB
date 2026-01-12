import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Calendar,
  Tag,
  MoreVertical,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useOffers, useDeleteOffer, useToggleOfferStatus, Offer } from "@/hooks/useOffers";
import { OfferFormDialog } from "@/components/admin/offers/OfferFormDialog";

const Offers = () => {
  const { data: offers, isLoading } = useOffers();
  const deleteOffer = useDeleteOffer();
  const toggleStatus = useToggleOfferStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "expired">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const getOfferStatus = (offer: Offer) => {
    if (!offer.is_active) return "inactive";
    if (offer.end_date < today) return "expired";
    if (offer.start_date > today) return "scheduled";
    return "active";
  };

  const filteredOffers = offers?.filter((offer) => {
    const matchesSearch = !search || 
      offer.title.toLowerCase().includes(search.toLowerCase()) ||
      offer.description?.toLowerCase().includes(search.toLowerCase());

    const status = getOfferStatus(offer);
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "active" && status === "active") ||
      (statusFilter === "inactive" && status === "inactive") ||
      (statusFilter === "expired" && status === "expired");

    return matchesSearch && matchesStatus;
  });

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingOffer(null);
  };

  const getStatusBadge = (offer: Offer) => {
    const status = getOfferStatus(offer);
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Inactive</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Expired</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Scheduled</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Offers & Campaigns</h1>
          <p className="text-muted-foreground">Create and manage promotional offers</p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Offer
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search offers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive", "expired"] as const).map((status) => (
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

      {/* Offers Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl h-80 animate-pulse" />
          ))}
        </div>
      ) : filteredOffers?.length === 0 ? (
        <div className="text-center py-16">
          <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No offers found</h3>
          <p className="text-muted-foreground mb-6">
            {search ? "Try adjusting your search" : "Create your first promotional offer"}
          </p>
          {!search && (
            <Button onClick={() => setFormOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Offer
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredOffers?.map((offer) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Banner */}
                <div className="relative h-40 bg-muted">
                  {offer.banner_image_url ? (
                    <img
                      src={offer.banner_image_url}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                  )}
                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary text-primary-foreground font-bold text-lg px-3 py-1">
                      {offer.discount_type === "percentage" 
                        ? `${offer.discount_value}% OFF`
                        : `₹${offer.discount_value} OFF`}
                    </Badge>
                  </div>
                  {/* Featured Star */}
                  {offer.is_featured && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-yellow-400 text-yellow-900 p-1.5 rounded-full">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground line-clamp-1">{offer.title}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 hover:bg-muted rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(offer)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteConfirmId(offer.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {offer.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {offer.description}
                    </p>
                  )}

                  {/* Date Range */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {format(new Date(offer.start_date), "MMM d")} - {format(new Date(offer.end_date), "MMM d, yyyy")}
                    </span>
                  </div>

                  {/* Applicable To */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {offer.offer_cities?.slice(0, 2).map((oc: any) => (
                      <Badge key={oc.city_id} variant="outline" className="text-xs">
                        {oc.cities?.name}
                      </Badge>
                    ))}
                    {offer.offer_salons?.slice(0, 2).map((os: any) => (
                      <Badge key={os.salon_id} variant="outline" className="text-xs">
                        {os.salons?.name}
                      </Badge>
                    ))}
                    {offer.offer_services?.slice(0, 2).map((os: any) => (
                      <Badge key={os.service_id} variant="outline" className="text-xs">
                        {os.services?.name}
                      </Badge>
                    ))}
                    {(
                      (offer.offer_cities?.length || 0) +
                      (offer.offer_salons?.length || 0) +
                      (offer.offer_services?.length || 0)
                    ) === 0 && (
                      <Badge variant="outline" className="text-xs">All Services</Badge>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    {getStatusBadge(offer)}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {offer.is_active ? "Enabled" : "Disabled"}
                      </span>
                      <Switch
                        checked={offer.is_active}
                        onCheckedChange={(checked) =>
                          toggleStatus.mutate({ id: offer.id, is_active: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Form Dialog */}
      <OfferFormDialog
        open={formOpen}
        onOpenChange={handleCloseForm}
        offer={editingOffer}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Offer?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The offer will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmId) {
                  deleteOffer.mutate(deleteConfirmId);
                  setDeleteConfirmId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Offers;
