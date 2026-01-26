import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect flow from OAuth or magic link which returns session info in the URL
    const handleRedirect = async () => {
      try {
        const { data, error } = await supabase.auth.getSessionFromUrl();
        if (error) {
          // ignore - fallback to getSession
        }
        if (data?.session) {
          console.log("Session from URL:", data.session);
          setSession(data.session);
          // Clean URL (remove token fragments) so routing / component effects behave
          try {
            const url = new URL(window.location.href);
            if (url.hash && (url.hash.includes("access_token") || url.hash.includes("refresh_token") || url.hash.includes("provider_token"))) {
              window.history.replaceState({}, document.title, url.pathname + url.search);
            }
          } catch (e) {
            // ignore
          }
        }
      } catch (e) {
        // ignore
      }

      // Fallback to a normal session check
      const { data } = await supabase.auth.getSession();
      console.log("Fallback session:", data.session);
      setSession(data.session);
      setLoading(false);
    };

    handleRedirect();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state change:", _event, session);
      setSession(session as any);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
};

export default useAuth;

