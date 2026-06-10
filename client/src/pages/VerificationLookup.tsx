import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Download, Search, CheckCircle2, XCircle, Clock, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function VerificationLookup() {
  const [, setLocation] = useLocation();
  const [code, setCode] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get code from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get("code");
    if (urlCode) {
      setSearchCode(urlCode);
      setCode(urlCode);
    }
  }, []);

  // Fetch verification data
  const { data: verification, isLoading: isFetching, error } = trpc.verification.lookupByCode.useQuery(
    { code: searchCode },
    { enabled: !!searchCode }
  );

  const handleSearch = () => {
    if (code.trim()) {
      setSearchCode(code);
    } else {
      toast.error("Please enter a verification code");
    }
  };

  const handleDownloadReport = async () => {
    if (!verification) return;

    try {
      setIsLoading(true);
      toast.loading("Generating PDF report...");

      // Create a simple text report for public download
      const reportContent = `
================================================================================
                    TRUSTLINK VERIFICATION REPORT
================================================================================

VERIFICATION CODE: ${verification.verificationCode}
STATUS: ${verification.status.toUpperCase()}

================================================================================
                         USER INFORMATION
================================================================================

Full Name:      ${verification.userName || "N/A"}
Email:          ${verification.userEmail || "N/A"}
Phone Number:   ${verification.userPhone || "N/A"}

================================================================================
                      VERIFICATION DETAILS
================================================================================

Document Type:  ${verification.documentType || "N/A"}
Trust Score:    ${verification.trustScore}%
Face Match:     ${verification.faceMatchScore ? `${verification.faceMatchScore}%` : "N/A"}
Fraud Status:   ${verification.fraudDetected ? "⚠ FRAUD DETECTED" : "✓ NO FRAUD DETECTED"}

Verified Date:  ${new Date(verification.verifiedAt || new Date()).toLocaleString()}
Expiry Date:    ${new Date(verification.expiresAt || new Date()).toLocaleString()}

================================================================================
                         CERTIFICATION STATUS
================================================================================

${
  verification.status === "verified"
    ? "✓ VERIFIED - This identity has been successfully verified and certified."
    : verification.status === "expired"
      ? "⏱ EXPIRED - This verification has expired and is no longer valid."
      : "✗ REJECTED - This identity verification was rejected."
}

Generated: ${new Date().toLocaleString()}
Report ID: ${verification.verificationCode}

================================================================================
This document certifies the verification status of the above-named individual.
For verification inquiries, please contact TrustLink support.
================================================================================
      `;

      // Create blob and download as text file
      const element = document.createElement("a");
      const file = new Blob([reportContent], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `TrustLink-Verification-${verification.verificationCode}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(element.href);

      toast.success("Report downloaded successfully!");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download report");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (!verification) return null;

    switch (verification.status) {
      case "verified":
        return <CheckCircle2 className="w-16 h-16 text-green-500" />;
      case "expired":
        return <Clock className="w-16 h-16 text-yellow-500" />;
      case "rejected":
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return <Shield className="w-16 h-16 text-blue-500" />;
    }
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
          className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-20"
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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              TrustLink Verify
            </span>
          </motion.div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 relative z-10">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Search Section */}
          <motion.div
            className="mb-12"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <Card className="relative p-8 border-0 bg-gradient-to-br from-blue-50 to-cyan-50 backdrop-blur-sm">
                <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Verify Identity
                </h1>
                <p className="text-slate-600 mb-6">
                  Enter the verification code from the QR code or report to check certification status.
                </p>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Enter verification code (e.g., VER-XXXX-XXXX)"
                    className="flex-1 px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:outline-none bg-white text-slate-800"
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleSearch}
                      disabled={isFetching || isLoading}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-2xl hover:shadow-blue-500/50 px-6 py-3"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      {isFetching ? "Searching..." : "Search"}
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Results Section */}
          {isFetching && (
            <motion.div
              className="text-center py-12"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="inline-block">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
                />
              </div>
              <p className="text-slate-300 mt-4">Loading verification details...</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              className="mb-8"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <Card className="relative p-8 border-0 bg-gradient-to-br from-red-50 to-pink-50 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <XCircle className="w-12 h-12 text-red-500 flex-shrink-0" />
                    <div>
                      <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Not Found</h2>
                      <p className="text-slate-600">
                        The verification code you entered could not be found. Please check and try again.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {verification && !isFetching && (
            <>
              {/* Status Card */}
              <motion.div
                className="mb-8"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${
                    verification.status === "verified"
                      ? "from-green-600 to-emerald-600"
                      : verification.status === "expired"
                        ? "from-yellow-600 to-orange-600"
                        : "from-red-600 to-pink-600"
                  } rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                  <Card className="relative p-8 border-0 bg-gradient-to-br from-white to-slate-50 backdrop-blur-sm">
                    <div className="text-center">
                      <motion.div
                        className="mb-6 flex justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className={`w-24 h-24 bg-gradient-to-br ${
                          verification.status === "verified"
                            ? "from-green-500 to-emerald-500"
                            : verification.status === "expired"
                              ? "from-yellow-500 to-orange-500"
                              : "from-red-500 to-pink-500"
                        } rounded-full flex items-center justify-center shadow-2xl`}>
                          {getStatusIcon()}
                        </div>
                      </motion.div>
                      <h2 className={`text-4xl font-bold mb-2 ${
                        verification.status === "verified"
                          ? "text-green-600"
                          : verification.status === "expired"
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}>
                        {verification.status === "verified"
                          ? "✓ Verified"
                          : verification.status === "expired"
                            ? "⏱ Expired"
                            : "✗ Rejected"}
                      </h2>
                      <p className="text-slate-600 text-lg">
                        {verification.status === "verified"
                          ? "This identity has been successfully verified"
                          : verification.status === "expired"
                            ? "This verification has expired"
                            : "This identity verification was rejected"}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Details Grid */}
              <motion.div
                className="grid md:grid-cols-2 gap-8 mb-8"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                {/* User Information */}
                <motion.div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  <Card className="relative p-6 border-0 bg-gradient-to-br from-blue-50 to-cyan-50 backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      User Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-600 text-sm">Full Name</p>
                        <p className="text-lg font-semibold text-slate-800">{verification.userName}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-sm">Email</p>
                        <p className="text-lg font-semibold text-slate-800">{verification.userEmail || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-sm">Phone</p>
                        <p className="text-lg font-semibold text-slate-800">{verification.userPhone || "N/A"}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Verification Details */}
                <motion.div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  <Card className="relative p-6 border-0 bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Verification Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-600 text-sm">Verification Code</p>
                        <p className="text-lg font-semibold text-slate-800 font-mono">{verification.verificationCode}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-sm">Document Type</p>
                        <p className="text-lg font-semibold text-slate-800">{verification.documentType}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-sm">Trust Score</p>
                        <p className="text-lg font-semibold text-green-600">{verification.trustScore}%</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Verification Results */}
              <motion.div
                className="mb-8"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  <Card className="relative p-6 border-0 bg-gradient-to-br from-amber-50 to-orange-50 backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      Verification Results
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-600 text-sm">Face Match Score</p>
                        <p className="text-lg font-semibold text-slate-800">
                          {verification.faceMatchScore ? `${verification.faceMatchScore}%` : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-sm">Fraud Detection</p>
                        <p className={`text-lg font-semibold ${
                          verification.fraudDetected ? "text-red-600" : "text-green-600"
                        }`}>
                          {verification.fraudDetected ? "⚠ Fraud Detected" : "✓ No Fraud"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-sm">Verified Date</p>
                        <p className="text-lg font-semibold text-slate-800">
                          {new Date(verification.verifiedAt || new Date()).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-sm">Expiry Date</p>
                        <p className="text-lg font-semibold text-slate-800">
                          {new Date(verification.expiresAt || new Date()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Download Button */}
              <motion.div
                className="flex justify-center"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleDownloadReport}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-2xl hover:shadow-green-500/50 px-8 py-6 text-lg"
                  >
                    <Download className="mr-2 w-5 h-5" />
                    {isLoading ? "Generating..." : "Download Report"}
                  </Button>
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
