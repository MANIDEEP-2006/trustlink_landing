import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, AlertCircle, Home, Download, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function VerificationLookup() {
  const [, setLocation] = useLocation();
  const [code, setCode] = useState<string>("");
  const [manualCode, setManualCode] = useState<string>("");

  // Get verification code from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get("code");
    if (codeFromUrl) {
      setCode(codeFromUrl);
    }
  }, []);

  // Fetch verification data
  const { data: verification, isLoading, error } = trpc.verification.lookupByCode.useQuery(
    { code },
    { enabled: !!code }
  );

  const handleManualLookup = () => {
    if (manualCode.trim()) {
      setCode(manualCode);
    }
  };

  const handleDownloadReport = () => {
    alert("Report download feature coming soon!");
  };

  const handleBackHome = () => {
    setLocation("/");
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
          className="absolute top-0 right-1/3 w-96 h-96 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur-3xl opacity-20"
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
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              TrustLink
            </span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleBackHome}
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
            >
              Back to Home
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 relative z-10">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div className="mb-6 flex justify-center" animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }}>
              <QrCode className="w-16 h-16 text-cyan-400" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Verify Identity
            </h1>
            <p className="text-slate-300">
              Scan a QR code or enter a verification code to check certification status
            </p>
          </motion.div>

          {/* Manual Code Input */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <Card className="relative p-8 border-0 bg-gradient-to-br from-blue-50 to-cyan-50 backdrop-blur-sm">
                <label className="block text-sm font-semibold text-slate-800 mb-4">
                  Enter Verification Code
                </label>
                <div className="flex gap-4">
                  <motion.input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="e.g., VER-XXXXX-XXXXX"
                    whileFocus={{ scale: 1.02 }}
                    className="flex-1 px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    onKeyPress={(e) => e.key === "Enter" && handleManualLookup()}
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleManualLookup}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-2xl hover:shadow-blue-500/50"
                    >
                      Search
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <p className="text-slate-300 mt-4">Verifying...</p>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <Card className="relative p-8 border-0 bg-gradient-to-br from-red-50 to-rose-50 backdrop-blur-sm">
                  <div className="flex gap-4">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-red-800 mb-2">Verification Not Found</h3>
                      <p className="text-red-700">
                        The verification code you entered could not be found. Please check the code and try again.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Verification Result */}
          {verification && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Status Card */}
              <motion.div className="group relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${
                    verification.status === "verified"
                      ? "from-green-600 to-emerald-600"
                      : verification.status === "expired"
                        ? "from-yellow-600 to-orange-600"
                        : "from-red-600 to-rose-600"
                  } rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
                />
                <Card
                  className={`relative p-8 border-0 bg-gradient-to-br ${
                    verification.status === "verified"
                      ? "from-green-50 to-emerald-50"
                      : verification.status === "expired"
                        ? "from-yellow-50 to-orange-50"
                        : "from-red-50 to-rose-50"
                  } backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {verification.status === "verified" ? (
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                      ) : (
                        <AlertCircle className="w-12 h-12 text-yellow-600" />
                      )}
                    </motion.div>
                    <div>
                      <h2 className={`text-2xl font-bold ${
                        verification.status === "verified"
                          ? "text-green-800"
                          : "text-yellow-800"
                      }`}>
                        {verification.status === "verified"
                          ? "Certified & Verified"
                          : verification.status === "expired"
                            ? "Certification Expired"
                            : "Not Verified"}
                      </h2>
                      <p className={`text-sm ${
                        verification.status === "verified"
                          ? "text-green-700"
                          : "text-yellow-700"
                      }`}>
                        {verification.status === "verified"
                          ? "This identity has been successfully verified"
                          : "This verification has expired"}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* User Information */}
              <motion.div
                className="group relative"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <Card className="relative p-8 border-0 bg-gradient-to-br from-cyan-50 to-blue-50 backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    User Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-cyan-200">
                      <span className="text-slate-600 font-semibold">Name:</span>
                      <span className="text-slate-800">{verification.userName}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-cyan-200">
                      <span className="text-slate-600 font-semibold">Email:</span>
                      <span className="text-slate-800">{verification.userEmail || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-cyan-200">
                      <span className="text-slate-600 font-semibold">Phone:</span>
                      <span className="text-slate-800">{verification.userPhone || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-semibold">Verification Code:</span>
                      <span className="text-slate-800 font-mono text-sm">{verification.verificationCode}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Verification Details */}
              <motion.div
                className="group relative"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <Card className="relative p-8 border-0 bg-gradient-to-br from-purple-50 to-indigo-50 backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Verification Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-purple-200">
                      <span className="text-slate-600 font-semibold">Document Type:</span>
                      <span className="text-slate-800">{verification.documentType || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-purple-200">
                      <span className="text-slate-600 font-semibold">Trust Score:</span>
                      <motion.span
                        className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {verification.trustScore}%
                      </motion.span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-purple-200">
                      <span className="text-slate-600 font-semibold">Face Match:</span>
                      <span className="text-slate-800">{verification.faceMatchScore || "N/A"}%</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-purple-200">
                      <span className="text-slate-600 font-semibold">Fraud Detected:</span>
                      <span className={verification.fraudDetected ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                        {verification.fraudDetected ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-semibold">Expires:</span>
                      <span className="text-slate-800">
                        {verification.expiresAt
                          ? new Date(verification.expiresAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Scan Count */}
              <motion.div
                className="text-center text-slate-400 text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                This verification has been scanned {verification.scans} times
              </motion.div>

              {/* Download Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleDownloadReport}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-2xl hover:shadow-blue-500/50 py-6"
                >
                  <Download className="mr-2 w-5 h-5" />
                  Download Report
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Empty State */}
          {!code && !isLoading && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-slate-400">
                Enter a verification code or scan a QR code to get started
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
