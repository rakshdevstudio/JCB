import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { User, Mail, Phone, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";

const Settings = () => {
  const { profile, roles, isSuperAdmin, isCityManager, isSalonManager, isStaff } = useAuth();

  const getRoleBadge = () => {
    if (isSuperAdmin) return { label: "Super Admin", color: "bg-purple-100 text-purple-700" };
    if (isCityManager) return { label: "City Manager", color: "bg-blue-100 text-blue-700" };
    if (isSalonManager) return { label: "Salon Manager", color: "bg-green-100 text-green-700" };
    if (isStaff) return { label: "Staff", color: "bg-orange-100 text-orange-700" };
    return { label: "Customer", color: "bg-gray-100 text-gray-700" };
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-xl font-serif text-foreground mb-6">Profile Information</h2>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={profile?.full_name || ""}
                  className="pl-10"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={profile?.email || ""}
                  className="pl-10"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={profile?.phone || "Not provided"}
                  className="pl-10"
                  disabled
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Role Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-6 h-fit"
        >
          <h2 className="text-xl font-serif text-foreground mb-6">Access Level</h2>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Current Role</p>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${roleBadge.color}`}>
                {roleBadge.label}
              </span>
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Permissions</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                View bookings
              </li>
              {(isSuperAdmin || isCityManager || isSalonManager) && (
                <>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Manage staff
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Update services
                  </li>
                </>
              )}
              {(isSuperAdmin || isCityManager) && (
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Manage salons
                </li>
              )}
              {isSuperAdmin && (
                <>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Manage cities
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Assign user roles
                  </li>
                </>
              )}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
