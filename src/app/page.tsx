import Image from "next/image";
import BackgroundVideo from "./_components/BackgroundVideo";

export default function Home() {
  return (
    <>
      {/* Full-screen Background Video */}
      <BackgroundVideo />

      {/* Content Below the Video */}
      <div className="flex flex-row justify-center items-center w-full space-x-4 p-8">
        <Image
          src="/images/drumming.jpg"
          alt="Drumming"
          width={396}
          height={226}
        />
        <Image
          src="/images/resources.jpg"
          alt="Drumming"
          width={396}
          height={226}
        />
        <Image src="/images/gear.jpg" alt="Drumming" width={396} height={226} />
      </div>
    </>
  );
}
