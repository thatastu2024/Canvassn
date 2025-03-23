import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const withAuth = (WrappedComponent, allowedRoles) => {
  return function ProtectedRoute(props) {
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
              const token = localStorage.getItem("token");
              if (!token) {
                throw new Error("No auth token found");
              }
    
              const response = await fetch("/api/auth/me", {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });
    
              if (!response.ok) throw new Error("Failed to fetch user role");
    
              const data = await response.json();
              if (!allowedRoles.includes(data.user_type)) {
                throw new Error("Unauthorized");
              }
    
              setIsAuthorized(true);
            } catch (error) {
              console.error("Authorization error:", error);
              router.push("/login");
            } finally {
              setLoading(false);
            }
          };
    
          fetchUserRole();
    }, []);


    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
