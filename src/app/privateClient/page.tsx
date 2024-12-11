"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";

const UserEmail = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient(); // Create a Supabase client instance
      const { data, error } = await supabase.auth.getUser();

      if (data?.user) {
        setEmail(data.user.email || null); // Ensure we set null if email is undefined
      }

      setLoading(false); // Indicate loading has finished
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>; // Show loading state
  if (!email) return <p>No user logged in</p>; // Handle the case where no user is logged in

  return <p>Hello {email}</p>; // Display the logged-in user's email
};

export default UserEmail;
