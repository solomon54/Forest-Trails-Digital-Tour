import UploadBox from "@/components/dashboard/UploadBox";

export default function Dashboard() {
  const userId = 1; // Replace with real logged-in user

  return (
    <div>
      <UploadBox userId={userId} />
    </div>
  );
}
