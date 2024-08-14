export default function BackgroundVideo() {
  return (
    <div className="absolute top-0 left-0 overflow-hidden flex items-center justify-center w-full h-auto">
      <video
        className="min-w-full min-h-full w-auto h-auto"
        autoPlay
        loop
        muted
      >
        <source src="/videos/background-video.mp4" type="video/mp4" />
      </video>
      <h1
        className="absolute text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-center z-10 drop-shadow-custom"
        style={{ maxWidth: "80%" }}
      >
        LEADING DRUMMERS OF ALL SKILL LEVELS TO ACHIEVE THEIR GOALS
      </h1>
    </div>
  );
}
