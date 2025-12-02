import { useState } from "react";

export default function UploadPage() {
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !caption.trim()) {
      alert("Select file and add caption.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("caption", caption);
    formData.append("listing_id", "1"); // Static for now
    formData.append("userId", "5"); // Replace with real user ID

    setLoading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Uploaded ->", data);
      if (res.ok) {
        alert("Upload success—queued for mod.");
        setPreview("");
        setCaption("");
        setSelectedFile(null);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed—retry.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-linear-to-tl from-indigo-600 to-green-700 min-h-screen flex flex-col">

       
      {/* HERO SECTION */}
      <section className="px-8 py-16 text-gray-300 text-center">
        <h1 className="text-6xl font-bold tracking-tight mb-3">Share Your Resources ✨</h1>
        <p className="max-w-2xl mx-auto">
          Upload images or videos of local attractions, hotels, cultural places,
          or anything that helps people discover new destinations.
        </p>
      </section>

 <div> <img src="/images/images.jpeg" alt="Dashboard background" className="w-3/5 h-100 ml-auto mr-auto" />
        </div>

      {/* HOW IT WORKS */}
      <section className="px-8 py-16">
        <h2 className="text-4xl font-semibold mb-10 text-center underline">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 bg-gray-200 shadow rounded-xl">
            <h3 className="font-semibold text-lg text-amber-500">1. Choose Your File</h3>
            <p className="text-gray-600 mt-2">
              Upload an image or video showing a hotel, place, attraction or
              anything helpful.
            </p>
          </div>

          <div className="p-6 bg-gray-200 shadow rounded-xl">
            <h3 className="font-semibold text-amber-500 text-lg">2. Add a Caption</h3>
            <p className="text-gray-600 mt-2">
              Tell us what this place is or why its useful.
            </p>
          </div>

          <div className="p-6 bg-gray-200 shadow rounded-xl">
            <h3 className="font-semibold text-amber-500 text-lg">3. Admin Approves</h3>
            <p className="text-gray-600 mt-2">
              Our team verifies the content before displaying it to users.
            </p>
          </div>
        </div>
      </section>


      {/* UPLOAD SECTION */}
      <section className="px-8 py-16 bg-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-center text-orange-400">Upload Your Resource</h2>

        <div className="max-w-lg mx-auto p-6 bg-gray-400 rounded-xl shadow border-none">
          <input
            type="text"
            placeholder="Caption / Title"
            className="w-full px-4 py-2 mb-4 rounded-lg border"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {/* File picker */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer hover:bg-gray-200 bg-white">
            {preview ? (
              <>
                {preview.endsWith(".mp4") ? (
                  <video src={preview} controls className="w-64 h-40 rounded" />
                ) : (
                  <img src={preview} className="w-64 h-40 rounded object-cover" />
                )}
              </>
            ) : (
              <p className="text-gray-600">Click to select a file</p>
            )}

            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={uploadFile}
            />
          </label>

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className={`w-full mt-5 py-2 rounded-lg text-white font-semibold 
              ${selectedFile && !loading ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400 cursor-not-allowed"}
            `}
          >
            {loading ? "Uploading..." : "Upload Now"}
          </button>

          {loading && (
            <p className="text-blue-600 mt-3 text-sm text-center">
              Uploading… please wait
            </p>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 text-center py-6 mt-auto">
        <p>Forest Trail — Empowering Most Ethiopian Unreachable Areas 🌍</p>
      </footer>
    </div>
  );
}