interface SideHeroProps {
  children?: React.ReactNode;
}

const SideHero = ({ children }: SideHeroProps) => {
  return (
    <div
      className="
        relative
        w-full md:w-full
        bg-login-bg bg-cover bg-center
        flex flex-col justify-between
        p-6 sm:p-8 md:p-12
        min-h-screen
        text-primary-green
        h-auto
        max-h-screen md:max-h-full
        overflow-y-auto md:overflow-visible
        scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-green/40
        shadow-[inset_0_0_40px_#ffffff33]
        backdrop-blur-lg
      "
      style={{
        backgroundColor: "rgba(255 255 255 / 0.1)", // softer translucent white base
        WebkitBackdropFilter: "blur(24px)", // stronger blur for Safari
        border: "1px solid rgba(255 255 255 / 0.25)", // softer glass border
        borderRadius: "0", // no rounding
      }}
    >
      {/* Blurred translucent overlay */}
      <div
        className="
          absolute inset-0
          bg-primary-green/20
          backdrop-blur-md
          pointer-events-none
          rounded-none
          opacity-90
          animate-fadeIn
        "
        style={{ borderRadius: 0 }}
      />

      {/* Content, relative to be above overlay */}
      <div
        className="relative flex flex-col items-center md:items-start text-center md:text-left space-y-5 z-10 font-sans"
        style={{
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`,
          letterSpacing: "0.015em",
          lineHeight: 1.3,
        }}
      >
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight drop-shadow-sm text-white/90">
          Welcome to
        </h1>
        <h2 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-wide drop-shadow-md text-white">
          COORD.TRAVEL
        </h2>
        <p className="max-w-md text-sm md:text-base font-normal leading-relaxed text-white/85 drop-shadow-sm">
          Your one-stop solution for managing all your guests. Provide seamless journeys to your clients with our comprehensive platform.
        </p>
      </div>

      {/* Sign-up form shown only on mobile inside hero */}
      <div className="relative z-10 mt-10 md:hidden w-full max-w-md mx-auto pb-8">
        {children}
      </div>

      <footer className="relative z-10 mt-10 text-xs md:text-sm text-center md:text-left opacity-60 text-white/70 font-sans select-none tracking-wide">
        © {new Date().getFullYear()} COORD.TRAVEL. All rights reserved.
      </footer>
    </div>
  );
};

export default SideHero;
