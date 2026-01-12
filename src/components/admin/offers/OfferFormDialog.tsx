import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateOffer, useUpdateOffer, Offer, CreateOfferData } from "@/hooks/useOffers";
import { useCities, useServices } from "@/hooks/useBookingData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OfferFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer?: Offer | null;
}

export const OfferFormDialog = ({ open, onOpenChange, offer }: OfferFormDialogProps) => {
  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();
  const { data: cities } = useCities();
  const { data: services } = useServices();

  // Fetch all salons
  const { data: salons } = useQuery({
    queryKey: ["all-salons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salons")
        .select("id, name, area, city_id")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    banner_image_url: "",
    start_date: new Date(),
    end_date: new Date(),
    discount_type: "percentage" as "percentage" | "flat",
    discount_value: 0,
    is_featured: false,
    is_active: true,
    service_ids: [] as string[],
    salon_ids: [] as string[],
    city_ids: [] as string[],
  });

  useEffect(() => {
    if (offer) {
      setFormData({
        title: offer.title,
        description: offer.description || "",
        banner_image_url: offer.banner_image_url || "",
        start_date: new Date(offer.start_date),
        end_date: new Date(offer.end_date),
        discount_type: offer.discount_type,
        discount_value: offer.discount_value,
        is_featured: offer.is_featured,
        is_active: offer.is_active,
        service_ids: offer.offer_services?.map((os) => os.service_id) || [],
        salon_ids: offer.offer_salons?.map((os) => os.salon_id) || [],
        city_ids: offer.offer_cities?.map((oc) => oc.city_id) || [],
      });
    } else {
      setFormData({
        title: "",
        description: "",
        banner_image_url: "",
        start_date: new Date(),
        end_date: new Date(),
        discount_type: "percentage",
        discount_value: 0,
        is_featured: false,
        is_active: true,
        service_ids: [],
        salon_ids: [],
        city_ids: [],
      });
    }
  }, [offer, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: CreateOfferData = {
      title: formData.title,
      description: formData.description || undefined,
      banner_image_url: formData.banner_image_url || undefined,
      start_date: format(formData.start_date, "yyyy-MM-dd"),
      end_date: format(formData.end_date, "yyyy-MM-dd"),
      discount_type: formData.discount_type,
      discount_value: formData.discount_value,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
      service_ids: formData.service_ids.length > 0 ? formData.service_ids : undefined,
      salon_ids: formData.salon_ids.length > 0 ? formData.salon_ids : undefined,
      city_ids: formData.city_ids.length > 0 ? formData.city_ids : undefined,
    };

    if (offer) {
      await updateOffer.mutateAsync({ id: offer.id, data });
    } else {
      await createOffer.mutateAsync(data);
    }

    onOpenChange(false);
  };

  const toggleSelection = (id: string, field: "service_ids" | "salon_ids" | "city_ids") => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(id)
        ? prev[field].filter((i) => i !== id)
        : [...prev[field], id],
    }));
  };

  const isSubmitting = createOffer.isPending || updateOffer.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {offer ? "Edit Offer" : "Create New Offer"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <form onSubmit={handleSubmit} className="space-y-6 pb-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Offer Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g., Summer Hair Care Special"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe the offer..."
                rows={3}
              />
            </div>

            {/* Banner URL */}
            <div className="space-y-2">
              <Label htmlFor="banner">Banner Image URL</Label>
              <Input
                id="banner"
                value={formData.banner_image_url}
                onChange={(e) => setFormData((p) => ({ ...p, banner_image_url: e.target.value }))}
                placeholder="https://..."
              />
              {formData.banner_image_url && (
                <div className="mt-2 rounded-lg overflow-hidden h-32 bg-muted">
                  <img
                    src={formData.banner_image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.start_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.start_date, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.start_date}
                      onSelect={(date) => date && setFormData((p) => ({ ...p, start_date: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.end_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.end_date, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.end_date}
                      onSelect={(date) => date && setFormData((p) => ({ ...p, end_date: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type *</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(v) => setFormData((p) => ({ ...p, discount_type: v as "percentage" | "flat" }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount_value">
                  Discount Value {formData.discount_type === "percentage" ? "(%)" : "(₹)"} *
                </Label>
                <Input
                  id="discount_value"
                  type="number"
                  min="0"
                  step={formData.discount_type === "percentage" ? "1" : "10"}
                  max={formData.discount_type === "percentage" ? "100" : undefined}
                  value={formData.discount_value}
                  onChange={(e) => setFormData((p) => ({ ...p, discount_value: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <Switch
                  id="featured"
                  checked={formData.is_featured}
                  onCheckedChange={(c) => setFormData((p) => ({ ...p, is_featured: c }))}
                />
                <Label htmlFor="featured" className="cursor-pointer">Mark as Featured</Label>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(c) => setFormData((p) => ({ ...p, is_active: c }))}
                />
                <Label htmlFor="active" className="cursor-pointer">Enable Offer</Label>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-2">
              <Label>Applicable Services (leave empty for all)</Label>
              <div className="border border-border rounded-lg p-3 max-h-40 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {services?.map((service) => (
                    <div key={service.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`service-${service.id}`}
                        checked={formData.service_ids.includes(service.id)}
                        onCheckedChange={() => toggleSelection(service.id, "service_ids")}
                      />
                      <label
                        htmlFor={`service-${service.id}`}
                        className="text-sm cursor-pointer truncate"
                      >
                        {service.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cities */}
            <div className="space-y-2">
              <Label>Applicable Cities (leave empty for all)</Label>
              <div className="border border-border rounded-lg p-3 max-h-32 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {cities?.map((city) => (
                    <div key={city.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`city-${city.id}`}
                        checked={formData.city_ids.includes(city.id)}
                        onCheckedChange={() => toggleSelection(city.id, "city_ids")}
                      />
                      <label
                        htmlFor={`city-${city.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {city.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Salons */}
            <div className="space-y-2">
              <Label>Applicable Salons (leave empty for all)</Label>
              <div className="border border-border rounded-lg p-3 max-h-40 overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {salons?.map((salon) => (
                    <div key={salon.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`salon-${salon.id}`}
                        checked={formData.salon_ids.includes(salon.id)}
                        onCheckedChange={() => toggleSelection(salon.id, "salon_ids")}
                      />
                      <label
                        htmlFor={`salon-${salon.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {salon.name} - {salon.area}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {offer ? "Update Offer" : "Create Offer"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
