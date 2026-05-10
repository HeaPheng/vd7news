"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

type MenuItem = {
  name: string;
  href: string;
};

type NavbarProps = {
  menuItems: MenuItem[];
};

type PressableNavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
};

function PressableNavLink({
  href,
  children,
  className = "",
  onClick,
  style,
}: PressableNavLinkProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <Link
      href={href}
      onClick={onClick}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      className={`${className} transition-all duration-150 ${
        pressed ? "scale-[0.97] opacity-80" : "scale-100 opacity-100"
      }`}
      style={{
        WebkitTapHighlightColor: "rgba(255,255,255,0.14)",
        ...style,
      }}
    >
      {children}
    </Link>
  );
}

function BrandText({ mobile = false }: { mobile?: boolean }) {
  return (
    <span
      className={`font-extrabold tracking-wide ${
        mobile ? "text-[18px]" : "text-lg"
      }`}
    >
      <span className="text-[#ef4444]">V</span>
      <span className="text-[#3b82f6]">D</span>
      <span className="text-[#60a5fa]">7</span>
      <span className="ml-2 text-white">News</span>
    </span>
  );
}

export default function Navbar({ menuItems }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const searchRef = useRef<HTMLInputElement | null>(null);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchRef = useRef<HTMLInputElement | null>(null);
  const mobileSearchBoxRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const currentQ = params.get("q") || "";
    setSearchText(currentQ);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) {
      searchRef.current?.focus();
      mobileSearchRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!searchOpen) return;
      
      const target = event.target as Node;
      const clickedOutsideDesktop = searchBoxRef.current && !searchBoxRef.current.contains(target);
      const clickedOutsideMobile = mobileSearchBoxRef.current && !mobileSearchBoxRef.current.contains(target);
      
      if (clickedOutsideDesktop && clickedOutsideMobile) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen]);

  useEffect(() => {
    const el = dropdownRef.current;
    if (!el) return;

    let raf1 = 0;
    let raf2 = 0;

    if (mobileOpen) {
      el.style.display = "block";
      el.style.height = "0px";
      el.style.opacity = "0";

      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          el.style.height = `${el.scrollHeight}px`;
          el.style.opacity = "1";
        });
      });
    } else {
      el.style.height = `${el.scrollHeight}px`;
      el.style.opacity = "1";

      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          el.style.height = "0px";
          el.style.opacity = "0";
        });
      });
    }

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const el = dropdownRef.current;
    if (!el) return;

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName !== "height") return;
      if (mobileOpen) el.style.height = "auto";
    };

    el.addEventListener("transitionend", handleTransitionEnd);
    return () => {
      el.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [mobileOpen]);

  const submitSearch = () => {
    const keyword = searchText.trim();
    if (!keyword) return;

    const target = `/search?q=${encodeURIComponent(keyword)}`;

    let currentQ = "";
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      currentQ = params.get("q") || "";
    }

    if (pathname === "/search" && currentQ === keyword) {
      setSearchOpen(false);
      setMobileOpen(false);
      return;
    }

    router.push(target);
    setMobileOpen(false);
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitSearch();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b1220]/95 backdrop-blur">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Desktop Navbar */}
        <div className="hidden h-16 items-center justify-between gap-4 xl:flex">
          <PressableNavLink
            href="/"
            className="flex shrink-0 items-center gap-3 text-white hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl shadow-lg">
              <Image
                src="/images/logo/logo.png"
                alt="VD7"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>

            <div className="leading-tight">
              <BrandText />
            </div>
          </PressableNavLink>

          <div className="ml-auto flex items-center gap-4">
            <nav className="flex items-center gap-5">
              {menuItems.map((item) => (
                <PressableNavLink
                  key={item.href}
                  href={item.href}
                  className="text-[15px] font-medium text-gray-200 hover:text-red-400"
                >
                  {item.name}
                </PressableNavLink>
              ))}
            </nav>

            <form onSubmit={handleSearchSubmit}>
              <div ref={searchBoxRef} className="flex items-center">
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    searchOpen ? "mr-2 w-56 opacity-100" : "w-0 opacity-0"
                  }`}
                >
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setSearchOpen(false);
                    }}
                    placeholder="Search news..."
                    className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-gray-400 focus:border-red-500/50"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setSearchOpen((prev) => !prev)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-200 transition-all duration-150 hover:border-red-500/40 hover:text-red-400 active:scale-95 active:border-red-500/40 active:text-red-400"
                  aria-label="Toggle search"
                  style={{ WebkitTapHighlightColor: "rgba(255,255,255,0.14)" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="relative flex h-[80px] items-center justify-between xl:hidden">
          {/* LEFT — hamburger / close */}
          <div className="flex shrink-0 items-center z-10">
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-red-500/40 hover:text-red-400 active:scale-95"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              style={{ WebkitTapHighlightColor: "rgba(255,255,255,0.14)" }}
            >
              <div className="relative flex h-5 w-5 flex-col items-center justify-center gap-[5px] overflow-hidden">
                <span
                  className={`h-[2px] w-full rounded-full bg-current transition-all duration-300 ease-out ${
                    mobileOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-[2px] w-full rounded-full bg-current transition-all duration-300 ease-out ${
                    mobileOpen ? "opacity-0 translate-x-4" : ""
                  }`}
                />
                <span
                  className={`h-[2px] w-full rounded-full bg-current transition-all duration-300 ease-out ${
                    mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>

          {/* CENTER — logo */}
          <div className="flex flex-1 items-center justify-center z-0 transition-all duration-300">
            <PressableNavLink
              href="/"
              className="flex items-center justify-center hover:opacity-90"
              onClick={() => setMobileOpen(false)}
            >
              <Image
                src="/favicon.ico"
                alt="VD7"
                width={60}
                height={60}
                className="h-[60px] w-[60px] object-contain rounded-xl shadow-sm transition-all duration-300"
                priority
              />
            </PressableNavLink>
          </div>

          {/* RIGHT — search */}
          <div className="flex shrink-0 items-center z-10">
            <form onSubmit={handleSearchSubmit}>
              <div ref={mobileSearchBoxRef} className="flex items-center">
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    searchOpen ? "mr-2 w-[160px] sm:w-[200px] opacity-100" : "w-0 opacity-0"
                  }`}
                >
                  <input
                    ref={mobileSearchRef}
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setSearchOpen(false);
                    }}
                    placeholder="Search..."
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-gray-400 focus:border-red-500/50"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setSearchOpen((prev) => !prev)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-200 transition-all duration-300 hover:border-red-500/40 hover:text-red-400 active:scale-95"
                  aria-label="Toggle search"
                  style={{ WebkitTapHighlightColor: "rgba(255,255,255,0.14)" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`h-5 w-5 transition-transform duration-300 ${searchOpen ? 'rotate-90 scale-110' : 'rotate-0 scale-100'}`}
                  >
                    {searchOpen ? (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </>
                    ) : (
                      <>
                        <circle cx="11" cy="11" r="7" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="m20 20-3.5-3.5" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div
          ref={dropdownRef}
          className="overflow-hidden xl:hidden"
          style={{
            height: 0,
            opacity: 0,
            transition:
              "height 400ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 300ms ease",
          }}
        >
          <div className="border-t border-white/10 py-4">
            <nav className="flex flex-col gap-2">
              {menuItems.map((item, index) => (
                <PressableNavLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-gray-200 transition-colors duration-200 hover:bg-white/[0.04] hover:text-red-400"
                  style={{
                    transitionDelay: mobileOpen ? `${index * 35}ms` : "0ms",
                  }}
                >
                  {item.name}
                </PressableNavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}