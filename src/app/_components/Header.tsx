import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="relative top-0 left-0 w-full z-20 flex items-start p-4 drop-shadow-custom">
      <Link href="/">
        <Image
          src="/images/logos/JPDL LOGO 2.0 white.png"
          width={134}
          height={99}
          alt="Jay Postones Logo"
        />
      </Link>
    </header>
  );
}
