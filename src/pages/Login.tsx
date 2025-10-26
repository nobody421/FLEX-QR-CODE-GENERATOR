import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { MadeWithDyad } from '@/components/made-with-dyad';

function Login() {
  const { supabase } = useSupabaseAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Login to YouTube Uploader</h2>
        <Auth
          supabaseClient={supabase}
          providers={['google']} // Only Google for YouTube integration
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary-foreground))',
                },
              },
            },
          }}
          theme="light" // Use light theme, can be dynamic later
          redirectTo={window.location.origin + '/youtube-uploader'}
        />
      </div>
      <MadeWithDyad />
    </div>
  );
}

export default Login;