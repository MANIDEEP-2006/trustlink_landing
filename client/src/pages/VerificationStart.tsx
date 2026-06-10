import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FileText, Smartphone, CheckCircle2, ArrowRight, Shield } from "lucide-react";
import { useLocation } from "wouter";

export default function VerificationStart() {
  const [, setLocation] = useLocation();

  const steps = [
    {
      number: "1",
      title: "Upload Document",
      description: "Capture a clear photo of your identity document (ID, Passport, or License)",
      icon: FileText,
    },
    {
      number: "2",
      title: "Take Selfie",
      description: "Take a selfie for face matching and biometric verification",
      icon: Smartphone,
    },
    {
      number: "3",
      title: "Get Verified",
      description: "Receive your trust score and verification result instantly",
      icon: CheckCircle2,
    },
  ];

  const handleStartProcess = () => {
    setLocation('/verify/upload-document');
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
            Back to Home
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#0F3460] via-[#6A0572] to-[#FF006E] bg-clip-text text-transparent">
                Start Your Verification
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete the simple 3-step process to verify your identity and receive your trust score
            </p>
          </motion.div>

          {/* Steps */}
          <motion.div
            className="grid md:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                >
                  <Card className="p-8 border-0 bg-white hover:shadow-lg transition-all relative">
                    {/* Step Number */}
                    <div className="absolute -top-6 -left-6 w-14 h-14 bg-gradient-to-br from-[#00D9FF] to-[#FF006E] rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="mb-6 mt-4">
                      <div className="p-4 bg-gradient-to-br from-[#00D9FF]/10 to-[#FF006E]/10 rounded-lg w-fit">
                        <Icon className="w-8 h-8 text-[#0F3460]" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>

                    {/* Connector */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-1 bg-gradient-to-r from-[#00D9FF] to-[#FF006E]" />
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Requirements */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-8 border-0 bg-gradient-to-br from-[#0F3460]/5 to-[#6A0572]/5">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Requirements</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Valid government-issued ID (Passport, Driver License, or National ID)",
                  "Clear, well-lit photo of your document",
                  "Smartphone or camera for selfie",
                  "Good lighting and neutral background",
                  "Stable internet connection",
                  "Approximately 2-3 minutes to complete",
                ].map((req, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00D9FF] flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{req}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button
              onClick={handleStartProcess}
              className="bg-gradient-to-r from-[#0F3460] to-[#6A0572] text-white hover:shadow-xl transition-all px-8 py-6 text-lg"
            >
              Start Verification <ArrowRight className="ml-2 w-5 h-5" />
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
