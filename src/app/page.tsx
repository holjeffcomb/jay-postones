import Image from "next/image";
import BackgroundVideo from "./_components/BackgroundVideo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <BackgroundVideo />
    </main>
  );
}
