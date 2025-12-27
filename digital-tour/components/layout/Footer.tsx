// components/layout/Footer.tsx
import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { SiDiscord } from "react-icons/si";

const footerLink =
  "relative inline-block text-slate-400 transition-colors hover:text-emerald-400 \
   after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 \
   after:bg-emerald-400 after:transition-all after:duration-300 hover:after:w-full";

const footerHeader =
  "relative inline-block text-base lg:text-lg font-semibold uppercase tracking-wider text-white \
   after:absolute after:left-0 after:-bottom-2 after:h-px after:bg-emerald-400/50 \
   after:transition-all after:duration-300 after:w-[calc(100%*0.8)]";

export default function Footer() {
  return (
    <footer className="bg-linear-to-b from-slate-800 to-slate-900 text-slate-300">
      {/* Top subtle divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/40 to-transparent" />

      <div className="mx-auto  max-w-7xl px-6 md:px-6 py-16">
        {/* MAIN LAYOUT: Flex on mobile → Grid on larger */}
        <div className="flex flex-col gap-16 lg:grid lg:grid-cols-4 lg:gap-6 ">
          {/* 1. Brand — always first, full width on mobile */}
          <div className="space-y-6 lg:col-span-1">
            <h2 className="font-extrabold tracking-wide text-white text-3xl sm:text-4xl">
              FOREST<span className="text-emerald-400">•</span>TRAILS
            </h2>
            <p className="text-base leading-relaxed text-slate-400 max-w-sm">
              Discover unforgettable journeys through curated, guided adventures —
              designed for explorers who value nature and experience.
            </p>
          </div>

          {/* 2. Inner Group: Explore + Company */}
          <div className="
            grid grid-cols-2 justify-between gap-y-16
            md:col-span-2 md:grid-cols-2
            lg:col-span-2 lg:grid-cols-2
          ">
            {/* Explore */}
            <div className="space-y-6 m-auto">
              <h3 className={footerHeader}>Explore</h3>
              <ul className="mt-6 space-y-4">
                <li><Link href="/" className={footerLink + " text-base"}>Home</Link></li>
                <li><Link href="/tours" className={footerLink + " text-base"}>Tours</Link></li>
                <li><Link href="/about" className={footerLink + " text-base"}>About Us</Link></li>
                <li><Link href="/contact" className={footerLink + " text-base"}>Contact</Link></li>
                <li><Link href="/faq" className={footerLink + " text-base"}>FAQ</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-6">
              <h3 className={footerHeader}>Company</h3>
              <ul className="mt-6 space-y-4">
                <li><Link href="/privacy" className={footerLink + " text-base"}>Privacy Policy</Link></li>
                <li><Link href="/terms" className={footerLink + " text-base"}>Terms of Service</Link></li>
                <li><Link href="/careers" className={footerLink + " text-base"}>Careers</Link></li>
                <li><Link href="/support" className={footerLink + " text-base"}>Support</Link></li>
              </ul>
            </div>
          </div>

          {/* 3. Social — bottom on mobile/md, last column on lg+ */}
          <div className="space-y-6 lg:col-span-1">
            <h3 className={footerHeader}>Stay Connected</h3>

            <div className="mt-6 mb-8 flex flex-wrap gap-4">
              {[
                { icon: <FaFacebook size={20} />, label: "Facebook" },
                { icon: <FaTwitter size={20} />, label: "Twitter" },
                { icon: <FaInstagram size={20} />, label: "Instagram" },
                { icon: <FaLinkedin size={20} />, label: "LinkedIn" },
                { icon: <FaGithub size={20} />, label: "GitHub" },
                { icon: <SiDiscord size={20} />, label: "Discord" },
              ].map((item) => (
                <a
                  key={item.label}
                  href="#"
                  aria-label={item.label}
                  className="
                    flex h-12 w-12 items-center justify-center rounded-xl
                    border border-slate-600/60 text-slate-400
                    transition-all duration-300
                    hover:border-emerald-400 hover:text-emerald-400 hover:scale-110
                  "
                >
                  {item.icon}
                </a>
              ))}
            </div>

            <Link
              href="/Signup"
              className="
                inline-flex items-center justify-center w-full rounded-xl
                bg-emerald-500 px-6 py-3 text-base font-semibold text-white
                transition hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20
              "
            >
              Join the Trail
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom copyright bar */}
      <div className="border-t border-slate-700/60 py-6 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Forest<span className="text-emerald-400">•</span>Trails. All rights reserved.
      </div>
    </footer>
  );
}