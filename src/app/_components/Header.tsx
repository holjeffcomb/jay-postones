"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkLogin = async () => {
      try {
        // Get the logged-in user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error(userError || "No user logged in");
          return;
        }

        // Fetch the user's profile
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error(error);
        } else if (profile) {
          setIsLoggedIn(true);
          setUserName(`${profile.first_name} ${profile.last_name}`);
        }
      } catch (err) {
        console.error("Error checking login:", err);
      }
    };

    checkLogin();
  }, []);

  return (
    <header className="relative w-full flex items-end justify-between p-4 drop-shadow-custom">
      <Link href="/">
        <Image
          src="/images/logos/JPDL LOGO 2.0 white.png"
          width={134}
          height={99}
          alt="Jay Postones Logo"
        />
      </Link>
      {isLoggedIn ? (
        <div className="flex flex-col">
          <div className="px-6 text-xs">
            <span>Logged in as {userName}</span>
          </div>
        </div>
      ) : (
        <Link href="/login" className="px-6">
          <Image
            src="/images/icons/User.png"
            width={30}
            height={30}
            alt="Login/Register"
          />
        </Link>
      )}
    </header>
  );
}
