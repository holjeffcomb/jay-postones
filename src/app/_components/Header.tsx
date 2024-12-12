import Image from "next/image";
import Link from "next/link";

export default function Header() {
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
      <Link href="/login" className="px-6">
        <Image
          src="/images/icons/User.png"
          width={30}
          height={30}
          alt="Login/Register"
        />
      </Link>
    </header>
  );
}
