// components/layout/Footer.tsx
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import { SiDiscord } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 px-6 md:px-16 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 md:justify-between lg:grid-cols-3 gap-8">
        
        {/* About / Logo */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Travelly</h2>
          <p className="text-slate-300">
            Discover unforgettable adventures with premium, guided tours tailored for explorers like you.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-medium mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/tours" className="hover:text-emerald-500">Tours</Link></li>
            <li><Link href="/about" className="hover:text-emerald-500">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-emerald-500">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-emerald-500">FAQ</Link></li>
          </ul>
        </div>


{/* Social / Newsletter */}
<div>
  <h3 className="text-xl font-medium mb-4">Follow Us</h3>
  <div className="flex gap-4 mb-6">
    <a href="#" className="hover:text-emerald-500"><FaFacebook size={24} /></a>
    <a href="#" className="hover:text-emerald-500"><FaTwitter size={24} /></a>
    <a href="#" className="hover:text-emerald-500"><FaInstagram size={24} /></a>
    <a href="#" className="hover:text-emerald-500"><FaLinkedin size={24} /></a>
    <a href="#" className="hover:text-emerald-500"><FaGithub size={24} /></a>
    <a href="#" className="hover:text-emerald-500"><SiDiscord size={24} /></a>
  </div>
 
 
    <Link className="inline-flex bg-emerald-500 px-4 py-2 rounded-xl font-medium hover:bg-emerald-600 transition justify-end items-end ml-auto" href={'/Signup'}>
      Subscribe
    </Link>

</div>


      </div>

      <div className="text-center text-slate-500 mt-8">
        &copy; {new Date().getFullYear()} Forest-Trail. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
