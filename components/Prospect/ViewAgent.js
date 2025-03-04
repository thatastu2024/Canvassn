import  {React, useState, useEffect } from "react";

export default function ViewAgentComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    
  }, []);

  const handleSubmit = () => {
    if (formData.name && formData.email) {
      const generatedToken = `${formData.name}-${Date.now()}`; // Mock token
      localStorage.setItem("user_authtoken", generatedToken);
      setIsAuthenticated(true);
    }
  };

  return (
    <>
      
    </>
  );
}
