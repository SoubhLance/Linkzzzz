import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
}

export const useAuth = (requireAuth: boolean = false) => {
    const navigate = useNavigate();
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        session: null,
        isLoading: true,
    });

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Error getting session:', error);
            }

            if (session) {
                const authPayload = {
                    token: session.access_token,
                    expiresAt: new Date(session.expires_at * 1000).getTime()
                };
                localStorage.setItem("linkzzzz_auth", JSON.stringify(authPayload));
                console.log("Auth stored for extension on load:", authPayload);
            }

            setAuthState({
                user: session?.user ?? null,
                session: session,
                isLoading: false,
            });

            // Redirect to landing if auth is required but no session
            if (requireAuth && !session) {
                navigate('/');
            }
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setAuthState({
                    user: session?.user ?? null,
                    session: session,
                    isLoading: false,
                });

                // Handle sign out
                if (event === 'SIGNED_OUT' && requireAuth) {
                    navigate('/');
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [navigate, requireAuth]);

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    return {
        ...authState,
        signOut,
    };
};
