"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { FaCaretDown } from "react-icons/fa";
import Dropdown from "./Dropdown";
import { useGlobalContext } from "../_context/GlobalContext";
import { useRouter } from "next/navigation";

const supabase = createClient();
const LoadingWheel = "/images/animations/loadingwheel.svg";

export default function Header() {
  const [isDropdownShowing, setIsDropdownShowing] = useState<boolean>(false);

  const {
    isLoggingIn,
    setIsLoggingIn,
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
  } = useGlobalContext();

  const router = useRouter();

  const toggleDropdown = () => {
    isDropdownShowing
      ? setIsDropdownShowing(false)
      : setIsDropdownShowing(true);
  };

  useEffect(() => {
    const checkLogin = async () => {
      try {
        setIsLoggingIn(true);
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
          setUser({
            firstName: profile.first_name,
            lastName: profile.last_name,
          });
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Error checking login:", err);
      } finally {
        setIsLoggingIn(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <header className="h-[150px] relative w-full flex items-end justify-between p-4 drop-shadow-custom bg-[var(--primary-color-color)] z-30">
      <Link href="/">
        <Image
          src="/images/logos/JPDL LOGO 2.0 white.png"
          width={134}
          height={99}
          alt="Jay Postones Logo"
        />
      </Link>
      {isLoggingIn ? (
        <Image
          className="mx-6"
          src={LoadingWheel}
          width={20}
          height={20}
          alt="loading..."
        />
      ) : isLoggedIn ? (
        <div className="flex px-6 text-xs gap-2 relative">
          <span>
            Logged in as {user?.firstName} {user?.lastName}
          </span>
          <button
            onClick={() => {
              toggleDropdown();
            }}
          >
            <FaCaretDown />
          </button>
          {isDropdownShowing ? <Dropdown /> : <></>}
        </div>
      ) : (
        <div className="flex gap-1 px-6 text-xs">
          <Link href="/login">Login </Link>
          <p>{" or "}</p>
          <Link href="/register"> Register</Link>
        </div>
      )}
    </header>
  );
}
