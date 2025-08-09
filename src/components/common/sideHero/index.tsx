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
        shadow-xl
        backdrop-blur-lg
      "
      style={{
        backgroundColor: "rgba(255 255 255 / 0.12)", // translucent white base
        WebkitBackdropFilter: "blur(20px)", // Safari support
        border: "1px solid rgba(255 255 255 / 0.3)", // subtle glass edge
        borderRadius: "0", // no rounding
      }}
    >
      {/* Blurred translucent overlay */}
      <div
        className="
          absolute inset-0
          bg-primary-green/30
          backdrop-blur-md
          pointer-events-none
          rounded-none
          opacity-90
          animate-fadeIn
        "
        style={{ borderRadius: 0 }}
      />

      {/* Content, relative to be above overlay */}
      <div className="relative flex flex-col items-center md:items-start text-center md:text-left space-y-4 z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-md">Welcome to</h1>
        <h2 className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-lg">
          COORD.TRAVEL
        </h2>
        <p className="max-w-md text-sm md:text-base text-white/90 drop-shadow">
          Your one-stop solution for managing all your guests. Provide seamless journeys to your clients with our comprehensive platform.
        </p>
      </div>

      {/* Sign-up form shown only on mobile inside hero */}
      <div className="relative z-10 mt-8 md:hidden w-full max-w-md mx-auto pb-8">
        {children}
      </div>

      <footer className="relative z-10 mt-8 text-xs text-center md:text-left opacity-80 text-white/80">
        © 2024 COORD.TRAVEL. All rights reserved.
      </footer>
    </div>
  );
};

export default SideHero;
