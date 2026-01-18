import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    bio: "",
    major: "",
    year: "",
    profileImage: null as string | null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user from Supabase
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setUserProfile({
          name: (user.user_metadata?.name as string) || "",
          email: user.email || "",
          bio: (user.user_metadata?.bio as string) || "",
          major: (user.user_metadata?.major as string) || "",
          year: (user.user_metadata?.year as string) || "",
          profileImage: (user.user_metadata?.profileImage as string) || null,
        });
      }
      setLoading(false);
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        setUser(session.user);
        setUserProfile({
          name: (session.user.user_metadata?.name as string) || "",
          email: session.user.email || "",
          bio: (session.user.user_metadata?.bio as string) || "",
          major: (session.user.user_metadata?.major as string) || "",
          year: (session.user.user_metadata?.year as string) || "",
          profileImage: (session.user.user_metadata?.profileImage as string) || null,
        });
      } else {
        setUser(null);
        setUserProfile({ name: "", email: "", bio: "", major: "", year: "", profileImage: null });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, userProfile, loading };
}
