import Image from "next/image";

export default function Header() {
  return (
    <header className="relative z-10">
      <Image
        src="/images/logos/JPDL LOGO 2.0 white.png"
        width={134}
        height={99}
        alt="Jay Postones Logo"
      />
    </header>
  );
}
