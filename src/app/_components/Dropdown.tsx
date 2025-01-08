import Link from "next/link";
import { signOut } from "../utils/supabaseService";
import { useGlobalContext } from "../_context/GlobalContext";
import { useRouter } from "next/navigation";

export default function Dropdown() {
  const { setIsLoggingIn, setIsLoggedIn } = useGlobalContext();
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoggingIn(true);
    await signOut();
    setIsLoggingIn(false);
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <div className="flex flex-col items-left px-8 absolute bg-[var(--accent-color)] w-48 right-0 top-0 mx-6 my-6 z-10 text-lg font-normal text-[var(--secondary-color)]">
      <Link href="/">Home</Link>
      <Link href="/progress">Dashboard</Link>
      <button onClick={() => handleSignOut()}>Sign Out</button>
    </div>
  );
}
