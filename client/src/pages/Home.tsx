import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Shield, Zap, Lock, BarChart3, FileText, Smartphone, Sparkles, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStartVerification = () => {
    setLocation('/verify/start');
  };

  const handleLearnMore = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLaunchApp = () => {
    setLocation('/dashboard');
  };

  const handleFreeTrial = () => {
    setLocation('/register');
  };

  const handleScheduleDemo = () => {
    window.open('mailto:support@trustlink.com?subject=Schedule%20Demo', '_blank');
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

  const features = [
    {
      icon: FileText,
      title: "Smart OCR Extraction",
      description: "Automatically extract and validate data from identity documents with 99.8% accuracy",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      icon: Smartphone,
      title: "Biometric Face Matching",
      description: "Advanced facial recognition technology ensures secure identity verification",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      icon: Shield,
      title: "AI Fraud Detection",
      description: "Detect tampering, copies, and suspicious patterns with machine learning",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
    },
    {
      icon: BarChart3,
      title: "Trust Score Calculation",
      description: "Comprehensive scoring based on multiple verification factors and AI analysis",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
    },
  ];

  const benefits = [
    { text: "Sub-second verification processing", icon: Zap },
    { text: "Enterprise-grade security", icon: Lock },
    { text: "99.8% accuracy rate", icon: CheckCircle2 },
    { text: "Multi-document support", icon: FileText },
    { text: "Real-time fraud detection", icon: Shield },
    { text: "QR code generation", icon: Sparkles },
    { text: "Comprehensive audit logs", icon: BarChart3 },
    { text: "Admin management panel", icon: Rocket },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
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
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-96 h-96 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 9, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 right-1/4 w-96 h-96 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 11, repeat: Infinity }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity }}
            >
              <Shield className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">TrustLink</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-slate-300 hover:text-cyan-400 transition">Features</a>
            <a href="#benefits" className="text-slate-300 hover:text-purple-400 transition">Benefits</a>
            <a href="#cta" className="text-slate-300 hover:text-pink-400 transition">Get Started</a>
          </div>
          <Button onClick={handleLaunchApp} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl hover:shadow-purple-500/50 transition-all">
            Launch App
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Content */}
            <motion.div variants={itemVariants}>
              <motion.div
                className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-cyan-500/50 rounded-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-cyan-300 text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Next-Gen Verification
                </span>
              </motion.div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Smart Digital
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  Identity Verification
                </span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Experience the future of identity verification with AI-powered OCR, biometric face matching, and advanced fraud detection. Secure, fast, and reliable.
              </p>
              <div className="flex gap-4 flex-wrap">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={handleStartVerification} size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-2xl hover:shadow-cyan-500/50 transition-all">
                    Start Verification <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={handleLearnMore} size="lg" variant="outline" className="border-2 border-purple-500 text-purple-300 hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/30">
                    Learn More
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              variants={itemVariants}
              className="relative h-96 hidden md:block"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-3xl"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-tl from-cyan-500/20 to-transparent rounded-3xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative h-full flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -30, 0], rotateZ: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-8xl"
                >
                  🔐
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need for secure and efficient identity verification
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="group relative h-full"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition-opacity duration-300`} />
                  <Card className={`relative group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm`}>
                    <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${feature.gradient}`}>
                      <motion.div
                        className="absolute inset-0 opacity-30"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div
                          className={`p-3 bg-gradient-to-br ${feature.gradient} rounded-lg`}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <feature.icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                      </div>
                      <p className="text-slate-700">{feature.description}</p>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Benefits List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Why Choose TrustLink?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-800/50 transition-colors group"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                    >
                      <benefit.icon className="w-6 h-6 text-cyan-400 flex-shrink-0 group-hover:text-pink-400 transition-colors" />
                    </motion.div>
                    <span className="text-lg text-slate-200 group-hover:text-white transition-colors">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Stats */}
            <motion.div
              className="grid grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                { number: "99.8%", label: "Accuracy Rate", gradient: "from-blue-500 to-cyan-500" },
                { number: "<2s", label: "Processing Time", gradient: "from-purple-500 to-pink-500" },
                { number: "10K+", label: "Verifications", gradient: "from-orange-500 to-red-500" },
                { number: "24/7", label: "Support", gradient: "from-green-500 to-emerald-500" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  className={`p-6 bg-gradient-to-br ${stat.gradient} rounded-xl border border-slate-700 hover:border-slate-500 transition-all cursor-pointer`}
                >
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-100">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Simple Verification Process
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Get verified in just three easy steps
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                step: "1",
                title: "Upload Document",
                description: "Capture a clear photo of your identity document (ID, Passport, or License)",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                step: "2",
                title: "Take Selfie",
                description: "Take a selfie for face matching and biometric verification",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                step: "3",
                title: "Get Verified",
                description: "Receive your trust score and verification result instantly",
                gradient: "from-orange-500 to-red-500",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="relative">
                  <motion.div
                    className={`absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {item.step}
                  </motion.div>
                  <Card className={`p-6 border-2 border-slate-700 hover:border-slate-500 transition-all bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm`}>
                    <h3 className="text-xl font-bold mb-3 text-white mt-4">{item.title}</h3>
                    <p className="text-slate-300">{item.description}</p>
                  </Card>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />

        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [180, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Ready to Verify Identities?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-slate-200 mb-8">
              Join thousands of organizations using TrustLink for secure and efficient identity verification
            </motion.p>
            <motion.div variants={itemVariants} className="flex gap-4 justify-center flex-wrap">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleFreeTrial} size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-2xl hover:shadow-cyan-500/50 font-semibold">
                  Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleScheduleDemo} size="lg" variant="outline" className="border-2 border-purple-400 text-purple-300 hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/30">
                  Schedule Demo
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-cyan-400" />
                <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">TrustLink</span>
              </div>
              <p className="text-slate-400">Smart Digital Identity Verification</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition">Features</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-pink-400 transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition">About</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-pink-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Terms</a></li>
                <li><a href="#" className="hover:text-pink-400 transition">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2024 TrustLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
