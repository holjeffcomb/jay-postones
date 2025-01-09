import Link from "next/link";
import { signOut } from "../utils/supabaseService";
import { useGlobalContext } from "../_context/GlobalContext";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";

interface DropdownProps {
  setIsDropdownShowing: (value: boolean) => void;
}

export default function Dropdown({ setIsDropdownShowing }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { setIsLoggingIn, setIsLoggedIn } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownShowing(false); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsDropdownShowing]);

  const handleSignOut = async () => {
    setIsLoggingIn(true);
    await signOut();
    setIsLoggingIn(false);
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <div
      ref={dropdownRef}
      className="flex flex-col items-center absolute bg-[var(--accent-color)] w-48 right-0 top-0 mx-6 my-6 z-10 text-lg font-normal text-[var(--secondary-color)]"
    >
      <div className="flex justify-center w-full hover:bg-[var(--text-color)]">
        <Link href="/">Home</Link>
      </div>
      <div className="flex justify-center w-full hover:bg-[var(--text-color)]">
        <Link href="/progress">Dashboard</Link>
      </div>
      <div className="flex justify-center w-full hover:bg-[var(--text-color)]">
        <Link href="/practice">Practice List</Link>
      </div>
      <div className="flex justify-center w-full hover:bg-[var(--text-color)]">
        <button onClick={() => handleSignOut()}>Sign Out</button>
      </div>
    </div>
  );
}
