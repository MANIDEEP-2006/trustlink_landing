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
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      number: "2",
      title: "Take Selfie",
      description: "Take a selfie for face matching and biometric verification",
      icon: Smartphone,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      number: "3",
      title: "Get Verified",
      description: "Receive your trust score and verification result instantly",
      icon: CheckCircle2,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
    },
  ];

  const handleStartProcess = () => {
    setLocation('/verify/upload-document');
  };

  const handleBackHome = () => {
    setLocation('/');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
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
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, -50, 0],
            y: [0, -100, 0],
            scale: [1.3, 1, 1.3],
          }}
          transition={{ duration: 12, repeat: Infinity }}
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
              Back to Home
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 relative z-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Start Your Verification
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Complete the simple 3-step process to verify your identity and receive your trust score
            </p>
          </motion.div>

          {/* Steps */}
          <motion.div
            className="grid md:grid-cols-3 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                >
                  <motion.div className="group relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition-opacity duration-300`} />
                    <Card className={`relative p-8 border-0 bg-gradient-to-br ${step.bgGradient} backdrop-blur-sm`}>
                      {/* Step Number */}
                      <motion.div
                        className={`absolute -top-6 -left-6 w-14 h-14 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
                      >
                        {step.number}
                      </motion.div>

                      {/* Icon */}
                      <motion.div
                        className="mb-6 mt-4"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      >
                        <motion.div
                          className={`p-4 bg-gradient-to-br ${step.gradient} rounded-lg w-fit`}
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </motion.div>
                      </motion.div>

                      {/* Content */}
                      <h3 className={`text-xl font-bold mb-3 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                        {step.title}
                      </h3>
                      <p className="text-slate-600">{step.description}</p>

                      {/* Connector */}
                      {index < steps.length - 1 && (
                        <motion.div
                          className={`hidden md:block absolute top-1/2 -right-4 w-8 h-1 bg-gradient-to-r ${step.gradient}`}
                          animate={{ scaleX: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Requirements */}
          <motion.div
            className="mb-16"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <Card className="relative p-8 border-0 bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Requirements
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Valid government-issued ID (Passport, Driver License, or National ID)",
                    "Clear, well-lit photo of your document",
                    "Smartphone or camera for selfie",
                    "Good lighting and neutral background",
                    "Stable internet connection",
                    "Approximately 2-3 minutes to complete",
                  ].map((req, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{req}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleStartProcess}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-2xl hover:shadow-cyan-500/50 px-8 py-6 text-lg"
              >
                Start Verification <ArrowRight className="ml-2 w-5 h-5" />
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
