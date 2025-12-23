//pages/Login.tsx
import type { NextPage } from "next";
import LoginForm from "@/components/auth/LoginForm";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/layout/Footer";

const LoginPage: NextPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(/images/login-bg.jpg)` }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 w-full max-w-md">
          <LoginForm />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
