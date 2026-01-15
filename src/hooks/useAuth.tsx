import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "super_admin" | "city_manager" | "salon_manager" | "staff" | "customer";

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  salon_id: string | null;
  city_id: string | null;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: UserRole[];
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isCityManager: boolean;
  isSalonManager: boolean;
  isStaff: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
  getManagedSalonId: () => string | null;
  getManagedCityId: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setIsLoading(true); // Prevent race condition
          fetchUserData(session.user.id);
        } else {
          setProfile(null);
          setRoles([]);
          setIsLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      setProfile(profileData);

      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId);

      setRoles((rolesData as UserRole[]) || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);
  };

  const hasRole = (role: AppRole) => roles.some((r) => r.role === role);

  const isSuperAdmin = hasRole("super_admin");
  const isCityManager = hasRole("city_manager");
  const isSalonManager = hasRole("salon_manager");
  const isStaff = hasRole("staff");
  const isAdmin = isSuperAdmin || isCityManager || isSalonManager || isStaff;

  const getManagedSalonId = () => {
    const salonRole = roles.find((r) => r.salon_id);
    return salonRole?.salon_id || null;
  };

  const getManagedCityId = () => {
    const cityRole = roles.find((r) => r.city_id);
    return cityRole?.city_id || null;
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    roles,
    isLoading,
    isAdmin,
    isSuperAdmin,
    isCityManager,
    isSalonManager,
    isStaff,
    signIn,
    signUp,
    signOut,
    hasRole,
    getManagedSalonId,
    getManagedCityId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
