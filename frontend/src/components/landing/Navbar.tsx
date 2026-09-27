import React, { useState, useEffect } from 'react';

interface LandingNavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onExploreClick?: () => void;
  onStartJourneyClick?: () => void;
  onOpenPlanner?: () => void;
  currentUser?: { name: string } | null;
  onLogout?: () => void;
}

export default function Navbar({
  onLoginClick,
  onRegisterClick,
  currentUser,
  onLogout,
}: LandingNavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0E0924]/95 backdrop-blur-md py-3 shadow-xl border-b border-[#FFD38A]/25'
          : 'bg-[#0E0924]/60 backdrop-blur-xs py-4 sm:py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="signboard-text text-2xl sm:text-3xl tracking-wide uppercase transition-transform group-hover:scale-105">
                RAAHI
              </span>
              <span className="text-marigold font-heading font-extrabold text-sm tracking-wider hidden sm:inline drop-shadow-sm">
                राही
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-widest uppercase text-parchment/80 font-bold -mt-0.5 hidden md:block">
              Har Gali Ek Kahani Hai
            </span>
          </div>
        </a>

        {/* Editorial Section Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-heading font-bold text-parchment/90">
          <a
            href="#what-is-raahi"
            className="hover:text-marigold transition-colors py-1 drop-shadow-sm"
          >
            What is Raahi?
          </a>
          <a
            href="#raahi-book"
            className="hover:text-marigold transition-colors py-1 drop-shadow-sm"
          >
            The Raahi Book
          </a>
          <a
            href="#raahi-finds"
            className="hover:text-marigold transition-colors py-1 drop-shadow-sm"
          >
            Raahi Finds
          </a>
          <a
            href="#take-a-piece"
            className="hover:text-marigold transition-colors py-1 drop-shadow-sm"
          >
            Take a Piece
          </a>
        </nav>

        {/* Action Group: User Session, Login & primary Register */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser?.name ? (
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-heading font-extrabold text-[#FFD38A] px-2.5 py-1 rounded-full bg-[#7A1026]/80 border border-[#FFD38A]/30">
                👤 {currentUser.name.split(' ')[0]}
              </span>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="text-[11px] font-heading font-bold text-parchment/60 hover:text-parchment underline cursor-pointer"
                  title="Sign Out"
                >
                  Logout
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Login Option: Secondary & Subtle */}
              <button
                onClick={onLoginClick}
                className="text-xs sm:text-sm font-heading font-extrabold text-parchment/80 hover:text-marigold px-2.5 sm:px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                Login
              </button>

              {/* Register Option: Primary Action */}
              <button
                onClick={onRegisterClick}
                className="bg-marigold hover:bg-amber-300 active:scale-95 text-signboard-navy font-heading font-black text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-signboard transition-all duration-150 cursor-pointer border border-signboard-navy"
              >
                Register
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
