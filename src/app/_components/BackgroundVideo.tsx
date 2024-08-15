import styles from "./BackgroundVideo.module.css";

export default function BackgroundVideo() {
  return (
    <div className="relative w-full overflow-hidden">
      <video
        className={`w-full object-cover ${styles.video}`}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/background-video.mp4" type="video/mp4" />
      </video>
      <div className={`absolute inset-0 ${styles.overlay}`}></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <h1
          className="text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-center drop-shadow-custom font-catamaran"
          style={{ width: "80%" }}
        >
          LEADING DRUMMERS OF ALL SKILL LEVELS TO ACHIEVE THEIR GOALS
        </h1>
      </div>
    </div>
  );
}
