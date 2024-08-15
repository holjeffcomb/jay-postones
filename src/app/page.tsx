import Image from "next/image";
import BackgroundVideo from "./_components/BackgroundVideo";

export default function Home() {
  return (
    <>
      <BackgroundVideo />

      {/* Image links */}
      <div className="flex flex-col lg:flex-row justify-center items-center w-full p-8 gap-4 xl:gap-6">
        <div className="relative flex-1 w-full rounded-xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 group">
          <Image
            src="/images/drumming.jpg"
            alt="Drumming"
            layout="responsive"
            width={396}
            height={226}
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
          />
          <div className="absolute inset-0 flex justify-center items-center">
            <span className="text-white text-4xl font-bold drop-shadow-custom">
              DRUMMING
            </span>
          </div>
        </div>

        <div className="relative flex-1 w-full rounded-xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 group">
          <Image
            src="/images/resources.jpg"
            alt="Resources"
            layout="responsive"
            width={396}
            height={226}
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
          />
          <div className="absolute inset-0 flex justify-center items-center">
            <span className="text-white text-4xl font-bold drop-shadow-custom">
              RESOURCES
            </span>
          </div>
        </div>

        <div className="relative flex-1 w-full rounded-xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 group">
          <Image
            src="/images/gear.jpg"
            alt="Gear"
            layout="responsive"
            width={396}
            height={226}
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
          />
          <div className="absolute inset-0 flex justify-center items-center">
            <span className="text-white text-4xl font-bold drop-shadow-custom">
              GEAR
            </span>
          </div>
        </div>
      </div>

      {/* Endorsees */}
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold">JAY PROUDLY ENDORSES:</h1>
        <Image
          src="/images/logos/ENDORSEES.png"
          alt="Endorsees"
          width={806}
          height={290}
        />
      </div>
    </>
  );
}
