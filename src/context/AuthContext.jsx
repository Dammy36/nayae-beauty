import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

// Tracks whether anyone is logged in, and separately, whether that
// logged-in person is an authorized admin (checked against the "admins"
// table from supabase/schema.sql). Kept as two different questions on
// purpose: someone could theoretically create a login without ever being
// added to the admins table, and they should still be treated as having
// no admin access - the database's Row Level Security rules enforce this
// for real regardless of what this context says, this is just what
// drives the UI (showing/hiding the dashboard, redirecting to login).
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Keeps this in sync if the user logs in/out in another tab, or
    // their session expires.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    supabase
      .from("admins")
      .select("id")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          // Fail closed (treat as "not an admin") rather than leaving
          // the page stuck on "Checking access..." forever.
          console.error("Admin status check failed:", error.message);
          setIsAdmin(false);
        } else {
          setIsAdmin(Boolean(data));
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Admin status check failed:", error.message);
        setIsAdmin(false);
        setIsLoading(false);
      });
  }, [session]);

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const value = {
    user: session?.user ?? null,
    isAdmin,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return context;
}
