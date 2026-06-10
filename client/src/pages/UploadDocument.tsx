import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Upload, FileText, AlertCircle, CheckCircle2, Shield, ArrowRight } from "lucide-react";
import { useState, useRef } from "react";
import { useLocation } from "wouter";

export default function UploadDocument() {
  const [, setLocation] = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(f.type)) {
      alert("Please upload a PDF or image file (JPG, PNG)");
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

  const handleContinue = () => {
    if (file) {
      setLocation('/verify/upload-selfie');
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
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            className="flex items-center gap-2"
            
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              TrustLink
            </span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleBackHome}
              variant="outline"
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
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
              <motion.div className="flex items-center gap-2" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  1
                </div>
                <span className="font-semibold text-white">Upload Document</span>
              </motion.div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 font-bold">
                  2
                </div>
                <span className="text-slate-400">Take Selfie</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 font-bold">
                  3
                </div>
                <span className="text-slate-400">Get Verified</span>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-cyan-500"
                animate={{ width: ["33%", "35%", "33%"] }}
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
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Upload Your Document
            </h1>
            <p className="text-slate-300 text-lg">
              Upload a clear photo of your identity document (Passport, Driver License, or National ID)
            </p>
          </motion.div>

          {/* Upload Area */}
          <motion.div
            className="mb-8"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            {!preview ? (
              <motion.div
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-slate-700 hover:border-cyan-500 hover:bg-cyan-500/5"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.02 }}
                animate={{
                  boxShadow: dragActive
                    ? "0 0 30px rgba(0, 217, 255, 0.5)"
                    : "0 0 20px rgba(0, 217, 255, 0.1)",
                }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Upload className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-70" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">Drop your file here</h3>
                <p className="text-slate-400 mb-4">or click to browse</p>
                <p className="text-sm text-slate-500">
                  Supported formats: PDF, JPG, PNG (Max 10MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  <Card className="relative p-8 border-0 bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm">
                    <div className="flex items-start gap-6">
                      {preview.startsWith('data:image') ? (
                        <motion.img
                          src={preview}
                          alt="Document preview"
                          className="w-32 h-40 object-cover rounded-lg shadow-lg"
                          animate={{ rotate: [0, 2, -2, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                      ) : (
                        <motion.div
                          className="w-32 h-40 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <FileText className="w-12 h-12 text-white" />
                        </motion.div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          </motion.div>
                          <span className="font-semibold text-slate-800">File uploaded successfully</span>
                        </div>
                        <p className="text-slate-600 mb-4">{file?.name}</p>
                        <p className="text-sm text-slate-500 mb-6">
                          Size: {(file?.size || 0) / 1024 / 1024 > 0 ? ((file?.size || 0) / 1024 / 1024).toFixed(2) + ' MB' : ((file?.size || 0) / 1024).toFixed(2) + ' KB'}
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => {
                              setFile(null);
                              setPreview(null);
                            }}
                            variant="outline"
                            className="border-green-600 text-green-700 hover:bg-green-50"
                            size="sm"
                          >
                            Change File
                          </Button>
                        </motion.div>
                      </div>
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
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <Card className="relative p-6 border-0 bg-gradient-to-br from-orange-50 to-red-50 backdrop-blur-sm">
                <div className="flex gap-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0" />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Tips for best results:</h4>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li>• Ensure the document is clearly visible and well-lit</li>
                      <li>• All four corners of the document should be visible</li>
                      <li>• Avoid glare and shadows on the document</li>
                      <li>• Use a neutral background</li>
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
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-2xl hover:shadow-cyan-500/50 px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleBackHome}
                variant="outline"
                className="border-purple-500 text-purple-300 hover:bg-purple-500/10 px-8 py-6 text-lg"
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
