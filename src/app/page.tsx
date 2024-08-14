import Image from "next/image";
import BackgroundVideo from "./_components/BackgroundVideo";

export default function Home() {
  return (
    <>
      <BackgroundVideo />

      <div className="flex flex-row justify-center items-center w-full space-x-4 p-8 min-w-2">
        <div className="relative min-w-72 rounded-xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 group">
          <div className="w-full h-full">
            <Image
              src="/images/drumming.jpg"
              alt="Drumming"
              width={396}
              height={226}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
            />
          </div>
          <div className="absolute inset-0 flex justify-center items-center">
            <span className="text-white text-4xl font-bold drop-shadow-custom">
              DRUMMING
            </span>
          </div>
        </div>

        <div className="relative min-w-72 rounded-xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 group">
          <div className="w-full h-full">
            <Image
              src="/images/resources.jpg"
              alt="Resources"
              width={396}
              height={226}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
            />
          </div>
          <div className="absolute inset-0 flex justify-center items-center">
            <span className="text-white text-4xl font-bold drop-shadow-custom">
              RESOURCES
            </span>
          </div>
        </div>

        <div className="relative min-w-72 rounded-xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 group">
          <div className="w-full h-full">
            <Image
              src="/images/gear.jpg"
              alt="Gear"
              width={396}
              height={226}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
            />
          </div>
          <div className="absolute inset-0 flex justify-center items-center">
            <span className="text-white text-4xl font-bold drop-shadow-custom">
              GEAR
            </span>
          </div>
        </div>
      </div>

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
