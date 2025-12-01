// pages/signup.tsx
import type { NextPage } from "next";
import SignupForm from "@/components/auth/SignupForm";
import AuthCard from "@/components/auth/AuthCard";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/navbar/Navbar";

const SignupPage: NextPage = () => {
  return (
    <>
      <Navbar />
      <AuthCard
        heading="Create your Travelly account"
        subheading="Sign up to discover unforgettable adventures."
      >
        <SignupForm />
      </AuthCard>
      <Footer />
    </>
  );
};

export default SignupPage;
