import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Share2, Shield, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function VerificationResult() {
  const [, setLocation] = useLocation();

  // Mock verification result
  const result = {
    trustScore: 98,
    status: "verified",
    documentType: "Passport",
    faceMatch: 99.2,
    fraudDetection: "No fraud detected",
    timestamp: new Date().toLocaleString(),
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TRUSTLINK-VERIFICATION-12345",
  };

  const handleDownloadReport = () => {
    alert("Report download feature coming soon!");
  };

  const handleShareQR = () => {
    alert("Share QR code feature coming soon!");
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
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Success Animation */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="mb-6 flex justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-[#00D9FF] to-[#FF006E] rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-white" />
              </div>
            </motion.div>
            <h1 className="text-5xl font-bold mb-4 text-foreground">
              Verification Complete! 🎉
            </h1>
            <p className="text-xl text-muted-foreground">
              Your identity has been successfully verified
            </p>
          </motion.div>

          {/* Trust Score Card */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 border-0 bg-gradient-to-br from-[#0F3460]/5 to-[#6A0572]/5">
              <div className="text-center mb-8">
                <div className="text-7xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-[#0F3460] to-[#FF006E] bg-clip-text text-transparent">
                    {result.trustScore}%
                  </span>
                </div>
                <p className="text-2xl font-semibold text-foreground">Trust Score</p>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-muted-foreground text-sm mb-2">Document Type</p>
                  <p className="text-lg font-semibold text-foreground">{result.documentType}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground text-sm mb-2">Face Match</p>
                  <p className="text-lg font-semibold text-green-600">{result.faceMatch}%</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground text-sm mb-2">Fraud Detection</p>
                  <p className="text-lg font-semibold text-green-600">✓ Clear</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* QR Code */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-8 border-0 bg-white">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Your Verification QR Code</h2>
              <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
                  <img
                    src={result.qrCode}
                    alt="Verification QR Code"
                    className="w-64 h-64"
                  />
                </div>
                <p className="text-center text-muted-foreground max-w-md">
                  Share this QR code to prove your identity. Anyone can scan it to verify your status.
                </p>
                <Button
                  onClick={handleShareQR}
                  className="bg-gradient-to-r from-[#00D9FF] to-[#FF006E] text-white hover:shadow-xl transition-all px-8 py-6"
                >
                  <Share2 className="mr-2 w-5 h-5" />
                  Share QR Code
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Verification Details */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-8 border-0 bg-white">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Verification Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-muted-foreground">Verification ID</span>
                  <span className="font-semibold text-foreground">VER-2024-06-10-001</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-muted-foreground">Timestamp</span>
                  <span className="font-semibold text-foreground">{result.timestamp}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold text-green-600">✓ Verified</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Validity</span>
                  <span className="font-semibold text-foreground">365 Days</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button
              onClick={handleDownloadReport}
              className="bg-gradient-to-r from-[#0F3460] to-[#6A0572] text-white hover:shadow-xl transition-all px-8 py-6"
            >
              <Download className="mr-2 w-5 h-5" />
              Download Report
            </Button>
            <Button
              onClick={handleBackHome}
              variant="outline"
              className="px-8 py-6 border-2"
            >
              <Home className="mr-2 w-5 h-5" />
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
