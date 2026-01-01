// components/uploads/UploadDashboard.tsx
import HowItWorks from "./HowItWorks";
import UploadForm from "./UploadForm";

type Props = {
  userId: number;
};

export default function UploadDashboard({ userId }: Props) {
  return (
    <div>
      {/* <UploadHero /> */}
      <HowItWorks />
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-0">
          <UploadForm userId={userId} />
        </div>
      </div>
    </div>
  );
}
