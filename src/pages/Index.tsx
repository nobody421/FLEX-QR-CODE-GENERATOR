import { MadeWithDyad } from "@/components/made-with-dyad";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { session, loading } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (session) {
        navigate("/qr-generator");
      } else {
        navigate("/login");
      }
    }
  }, [session, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to FlexQR</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Redirecting...
        </p>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;