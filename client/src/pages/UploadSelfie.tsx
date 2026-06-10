import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Camera, AlertCircle, CheckCircle2, Shield, ArrowRight } from "lucide-react";
import { useState, useRef } from "react";
import { useLocation } from "wouter";

export default function UploadSelfie() {
  const [, setLocation] = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useCamera, setUseCamera] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(droppedFile);
      }
    }
  };

  const validateFile = (f: File): boolean => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(f.type)) {
      alert("Please upload an image file (JPG, PNG)");
      return false;
    }

    if (f.size > maxSize) {
      alert("File size must be less than 10MB");
      return false;
    }

    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setUseCamera(true);
      }
    } catch (err) {
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const takeSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL("image/jpeg");
        setPreview(imageData);

        // Convert canvas to blob for file
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
            setFile(file);
          }
        }, "image/jpeg");

        setUseCamera(false);
        if (videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    }
  };

  const handleContinue = () => {
    if (file) {
      setLocation('/verify/result');
    }
  };

  const handleBackHome = () => {
    setLocation('/');
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, -50, 0],
            y: [0, -100, 0],
            scale: [1.3, 1, 1.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            className="flex items-center gap-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              TrustLink
            </span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleBackHome}
              variant="outline"
              className="border-pink-500 text-pink-400 hover:bg-pink-500/10"
            >
              Back
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 relative z-10">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Progress */}
          <motion.div
            className="mb-12"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center justify-between mb-4">
              <motion.div className="flex items-center gap-2" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  ✓
                </div>
                <span className="font-semibold text-white">Upload Document</span>
              </motion.div>
              <motion.div className="flex items-center gap-2" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  2
                </div>
                <span className="font-semibold text-white">Take Selfie</span>
              </motion.div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 font-bold">
                  3
                </div>
                <span className="text-slate-400">Get Verified</span>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full w-2/3 bg-gradient-to-r from-pink-500 to-rose-500"
                animate={{ width: ["66%", "68%", "66%"] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Header */}
          <motion.div
            className="text-center mb-12"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              Take Your Selfie
            </h1>
            <p className="text-slate-300 text-lg">
              Upload a clear photo of your face for biometric verification
            </p>
          </motion.div>

          {/* Upload Area */}
          <motion.div
            className="mb-8"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            {!preview && !useCamera ? (
              <div className="space-y-4">
                <motion.div
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                    dragActive
                      ? "border-pink-500 bg-pink-500/10"
                      : "border-slate-700 hover:border-pink-500 hover:bg-pink-500/5"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.02 }}
                  animate={{
                    boxShadow: dragActive
                      ? "0 0 30px rgba(236, 72, 153, 0.5)"
                      : "0 0 20px rgba(236, 72, 153, 0.1)",
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Camera className="w-16 h-16 text-pink-400 mx-auto mb-4 opacity-70" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2">Upload your selfie</h3>
                  <p className="text-slate-400 mb-4">or click to browse</p>
                  <p className="text-sm text-slate-500">
                    Supported formats: JPG, PNG (Max 10MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={startCamera}
                    className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:shadow-2xl hover:shadow-pink-500/50 py-6"
                  >
                    <Camera className="mr-2 w-5 h-5" />
                    Take Photo with Camera
                  </Button>
                </motion.div>
              </div>
            ) : useCamera ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  <Card className="relative p-6 border-0 bg-gradient-to-br from-pink-50 to-rose-50 backdrop-blur-sm">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg mb-4"
                      style={{ display: 'block' }}
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={takeSelfie}
                        className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:shadow-2xl hover:shadow-pink-500/50 py-6"
                      >
                        <Camera className="mr-2 w-5 h-5" />
                        Capture Selfie
                      </Button>
                    </motion.div>
                  </Card>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  <Card className="relative p-8 border-0 bg-gradient-to-br from-purple-50 to-indigo-50 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-6">
                      <motion.img
                        src={preview || ''}
                        alt="Selfie preview"
                        className="w-48 h-48 object-cover rounded-lg shadow-lg"
                        animate={{ rotate: [0, 2, -2, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      <motion.div
                        className="flex items-center gap-2"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-slate-800">Selfie captured successfully</span>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => {
                            setFile(null);
                            setPreview(null);
                          }}
                          variant="outline"
                          className="border-purple-600 text-purple-700 hover:bg-purple-50"
                        >
                          Retake Photo
                        </Button>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Tips */}
          <motion.div
            className="mb-12"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <Card className="relative p-6 border-0 bg-gradient-to-br from-rose-50 to-pink-50 backdrop-blur-sm">
                <div className="flex gap-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Tips for best results:</h4>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li>• Face should be clearly visible and well-lit</li>
                      <li>• Look directly at the camera</li>
                      <li>• Avoid sunglasses or hats</li>
                      <li>• Use a neutral background</li>
                      <li>• Ensure your face takes up about 70% of the frame</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="flex gap-4 justify-center"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleContinue}
                disabled={!file}
                className="bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:shadow-2xl hover:shadow-pink-500/50 px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleBackHome}
                variant="outline"
                className="border-indigo-500 text-indigo-300 hover:bg-indigo-500/10 px-8 py-6 text-lg"
              >
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
