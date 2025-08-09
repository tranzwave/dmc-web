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
        flex flex-col
        p-5 pt-2 sm:p-8 md:p-12
        min-h-screen
        text-primary-green
        h-auto
        max-h-screen md:max-h-full
        overflow-y-auto md:overflow-visible
        scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-green/40
        shadow-[inset_0_0_40px_#ffffff33]
        backdrop-blur-lg
        m-0
      "
      style={{
        backgroundColor: "rgba(255 255 255 / 0.1)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255 255 255 / 0.25)",
        borderRadius: "0",
        boxSizing: "border-box",
      }}
    >
      {/* Blurred translucent overlay */}
      <div
        className="
          absolute inset-0
          pointer-events-none
          rounded-none
          opacity-80
          animate-fadeIn
          backdrop-blur-md
        "
        style={{
          borderRadius: 0,
          background: "linear-gradient(to bottom, rgba(5, 150, 105, 0.4), rgba(5, 150, 105, 0))",
        }}
      />

      {/* Content container with flex-grow to push footer down */}
      <div
        className="relative flex-grow flex flex-col items-center justify-center md:items-center md:text-center text-center space-y-2 z-10 font-sans max-w-md mx-auto"
        style={{
          fontFamily:
            `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, ` +
            `"Open Sans", "Helvetica Neue", sans-serif`,
          letterSpacing: "0.015em",
          lineHeight: 1,
        }}
      >
        <h1 className="text-[clamp(1.875rem,2vw,2.5rem)] md:text-[clamp(2.25rem,2.5vw,2.75rem)] font-bold tracking-tight drop-shadow-sm text-white/90 leading-none md:leading-tight">
          Welcome to
        </h1>
        <h2 className="text-[clamp(3rem,4vw,4.5rem)] md:text-[clamp(4rem,5vw,5rem)] font-extrabold tracking-wide drop-shadow-md text-white leading-none md:leading-tight">
          COORD.TRAVEL
        </h2>
        <p className="max-w-md text-[clamp(0.875rem,1vw,1.125rem)] md:text-[clamp(1rem,1.25vw,1.25rem)] font-normal text-white/85 drop-shadow-sm leading-none md:leading-tight">
          Your one-stop solution for managing all your guests. Provide seamless journeys to your clients with our comprehensive platform.
        </p>

        {/* Sign-up form shown only on mobile inside hero */}
        <div className="relative z-10 md:hidden w-full max-w-md mx-auto pb-8">
          {children}
        </div>
      </div>

      {/* Footer stuck to bottom */}
      <footer className="relative z-10 mt-auto text-xs md:text-sm text-center md:text-left opacity-60 text-white/70 font-sans select-none tracking-wide">
        © {new Date().getFullYear()} COORD.TRAVEL. All rights reserved.
      </footer>
    </div>
  );
};

export default SideHero;
