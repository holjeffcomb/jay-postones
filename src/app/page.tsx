import BackgroundVideo from "./_components/BackgroundVideo";

export default function Home() {
  return (
    <>
      {/* Full-screen Background Video */}
      <BackgroundVideo />

      {/* Content Below the Video */}
      <div className="flex flex-row justify-center items-center space-x-4 p-8">
        <p>1</p>
        <p>2</p>
        <p>3</p>
      </div>
    </>
  );
}
