import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isStaff: boolean;
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    // Fetch initial session and user roles
    const initializeAuth = async () => {
      try {
        const { data: { session: s } } = await supabase.auth.getSession();
        if (!isMounted) return;

        setSession(s);
        
        if (s?.user) {
          const { data, error } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", s.user.id);
          
          if (!isMounted) return;
          
          if (error) {
            console.error("Error fetching user roles:", error.message);
            setRoles([]);
          } else {
            setRoles((data ?? []).map((r) => r.role));
          }
        } else {
          setRoles([]);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (!isMounted) return;
        setSession(null);
        setRoles([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
      if (!isMounted) return;
      
      setSession(s);
      
      if (s?.user) {
        try {
          const { data, error } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", s.user.id);
          
          if (!isMounted) return;
          
          if (error) {
            console.error("Error fetching user roles:", error.message);
            setRoles([]);
          } else {
            setRoles((data ?? []).map((r) => r.role));
          }
        } catch (error) {
          console.error("Error fetching user roles:", error);
          setRoles([]);
        }
      } else {
        setRoles([]);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return {
    session,
    user: session?.user ?? null,
    loading,
    isAdmin: roles.includes("admin"),
    isStaff: roles.includes("admin") || roles.includes("staff"),
  };
}
