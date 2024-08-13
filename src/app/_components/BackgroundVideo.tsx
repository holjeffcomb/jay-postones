export default function BackgroundVideo() {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <video className="min-w-full w-auto h-auto absolute" autoPlay loop muted>
        <source src="/videos/background-video.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
