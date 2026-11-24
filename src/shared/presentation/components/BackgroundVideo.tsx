export interface BackgroundVideoProps {
  src?: string;
}

export function BackgroundVideo({
  src = '/media/login/persona-3/background.mp4',
}: BackgroundVideoProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover opacity-90"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-night/15 via-transparent to-blue-night/30" />
    </div>
  );
}
