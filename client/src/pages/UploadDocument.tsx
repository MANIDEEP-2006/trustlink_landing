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
      // Store file in session or state management
      setLocation('/verify/upload-selfie');
    }
  };

  const handleBackHome = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0F3460] to-[#6A0572] rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">TrustLink</span>
          </div>
          <Button onClick={handleBackHome} variant="ghost">
            Back
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Progress */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00D9FF] to-[#FF006E] rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <span className="font-semibold text-foreground">Upload Document</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                  2
                </div>
                <span className="text-muted-foreground">Take Selfie</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                  3
                </div>
                <span className="text-muted-foreground">Get Verified</span>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-[#00D9FF] to-[#FF006E]" />
            </div>
          </motion.div>

          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-4xl font-bold mb-4 text-foreground">Upload Your Document</h1>
            <p className="text-muted-foreground text-lg">
              Upload a clear photo of your identity document (Passport, Driver License, or National ID)
            </p>
          </motion.div>

          {/* Upload Area */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {!preview ? (
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-[#00D9FF] bg-[#00D9FF]/5"
                    : "border-border hover:border-[#00D9FF] hover:bg-[#00D9FF]/5"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-16 h-16 text-[#00D9FF] mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Drop your file here</h3>
                <p className="text-muted-foreground mb-4">or click to browse</p>
                <p className="text-sm text-muted-foreground">
                  Supported formats: PDF, JPG, PNG (Max 10MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <Card className="p-8 border-0 bg-white">
                <div className="flex items-start gap-6">
                  {preview.startsWith('data:image') ? (
                    <img
                      src={preview}
                      alt="Document preview"
                      className="w-32 h-40 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-32 h-40 bg-gradient-to-br from-[#0F3460] to-[#6A0572] rounded-lg flex items-center justify-center">
                      <FileText className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="font-semibold text-foreground">File uploaded successfully</span>
                    </div>
                    <p className="text-muted-foreground mb-4">{file?.name}</p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Size: {(file?.size || 0) / 1024 / 1024 > 0 ? ((file?.size || 0) / 1024 / 1024).toFixed(2) + ' MB' : ((file?.size || 0) / 1024).toFixed(2) + ' KB'}
                    </p>
                    <Button
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Change File
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>

          {/* Tips */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-6 border-0 bg-gradient-to-br from-[#FF006E]/5 to-[#00D9FF]/5">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-[#FF006E] flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Tips for best results:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Ensure the document is clearly visible and well-lit</li>
                    <li>• All four corners of the document should be visible</li>
                    <li>• Avoid glare and shadows on the document</li>
                    <li>• Use a neutral background</li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              onClick={handleContinue}
              disabled={!file}
              className="bg-gradient-to-r from-[#0F3460] to-[#6A0572] text-white hover:shadow-xl transition-all px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={handleBackHome}
              variant="outline"
              className="px-8 py-6 text-lg border-2"
            >
              Cancel
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
