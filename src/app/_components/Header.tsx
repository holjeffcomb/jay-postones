import Image from "next/image";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-20 flex items-start p-4 drop-shadow-custom">
      <Image
        src="/images/logos/JPDL LOGO 2.0 white.png"
        width={134}
        height={99}
        alt="Jay Postones Logo"
      />
    </header>
  );
}
