import Footer from "@/components/layout/Footer";
import Navbar from "@/components/navbar/Navbar";
import UploadBox from "@/components/uploads/UploadBox";
import Link from "next/link";

export default function Dashboard() {
  const userId = 1; // Replace with real logged-in user

  return (
    <>
    <Navbar />
    <div>
      <UploadBox userId={userId} />
    </div>
    <Footer />
    </>
  );
}
