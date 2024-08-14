import Image from "next/image";
import BackgroundVideo from "./_components/BackgroundVideo";

export default function Home() {
  return (
    <>
      <BackgroundVideo />

      <div className="flex flex-row justify-center items-center w-full space-x-4 p-8 min-w-2">
        <Image
          src="/images/drumming.jpg"
          alt="Drumming"
          width={396}
          height={226}
          className="min-w-72"
        />
        <Image
          src="/images/resources.jpg"
          alt="Drumming"
          width={396}
          height={226}
          className="min-w-72"
        />
        <Image
          src="/images/gear.jpg"
          alt="Drumming"
          width={396}
          height={226}
          className="min-w-72"
        />
      </div>
    </>
  );
}
