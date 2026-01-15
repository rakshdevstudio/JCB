import { motion } from "framer-motion";
import { UserCog } from "lucide-react";

const UserRoles = () => {
    return (
        <div className="p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-foreground">User Roles</h1>
                    <p className="text-muted-foreground">Manage user permissions</p>
                </div>
            </div>

            {/* Placeholder content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-lg p-12 text-center"
            >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCog className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                    User Roles Management
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    This module will allow super admins to manage user roles and permissions across the platform.
                </p>
            </motion.div>
        </div>
    );
};

export default UserRoles;
