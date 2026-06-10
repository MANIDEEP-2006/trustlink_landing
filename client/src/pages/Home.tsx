import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Shield, Zap, Lock, BarChart3, FileText, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [, setLocation] = useLocation();

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
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663749024429/DapjnSehJg5cTcCeemhP4g/trustlink-feature-ocr-NZ6rYxVxRAoTFYPntzj6V6.webp",
    },
    {
      icon: Smartphone,
      title: "Biometric Face Matching",
      description: "Advanced facial recognition technology ensures secure identity verification",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663749024429/DapjnSehJg5cTcCeemhP4g/trustlink-feature-face-2wnjxj9aNBzWfbVatLWNt3.webp",
    },
    {
      icon: Shield,
      title: "AI Fraud Detection",
      description: "Detect tampering, copies, and suspicious patterns with machine learning",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663749024429/DapjnSehJg5cTcCeemhP4g/trustlink-feature-fraud-8CgGVUsHCm3qVsjfJ9ic8X.webp",
    },
    {
      icon: BarChart3,
      title: "Trust Score Calculation",
      description: "Comprehensive scoring based on multiple verification factors and AI analysis",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663749024429/DapjnSehJg5cTcCeemhP4g/trustlink-feature-trust-NTBB2SrUsasReU2RS27AxY.webp",
    },
  ];

  const benefits = [
    { text: "Sub-second verification processing" },
    { text: "Enterprise-grade security" },
    { text: "99.8% accuracy rate" },
    { text: "Multi-document support" },
    { text: "Real-time fraud detection" },
    { text: "QR code generation" },
    { text: "Comprehensive audit logs" },
    { text: "Admin management panel" },
  ];

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
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-foreground hover:text-[#0F3460] transition">Features</a>
            <a href="#benefits" className="text-foreground hover:text-[#0F3460] transition">Benefits</a>
            <a href="#cta" className="text-foreground hover:text-[#0F3460] transition">Get Started</a>
          </div>
          <Button onClick={handleLaunchApp} className="bg-gradient-to-r from-[#0F3460] to-[#6A0572] text-white hover:shadow-lg transition-all">
            Launch App
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663749024429/DapjnSehJg5cTcCeemhP4g/trustlink-hero-bg-TLbt48RHshZbzUB8uQVJji.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <div className="absolute inset-0 bg-white/90 z-0" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Content */}
            <motion.div variants={itemVariants}>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-[#0F3460] via-[#6A0572] to-[#FF006E] bg-clip-text text-transparent">
                  Smart Digital Identity
                </span>
                <br />
                <span className="text-foreground">Verification System</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Experience the future of identity verification with AI-powered OCR, biometric face matching, and advanced fraud detection. Secure, fast, and reliable.
              </p>
              <div className="flex gap-4">
                <Button onClick={handleStartVerification} size="lg" className="bg-gradient-to-r from-[#0F3460] to-[#6A0572] text-white hover:shadow-xl transition-all">
                  Start Verification <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button onClick={handleLearnMore} size="lg" variant="outline" className="border-2 border-[#00D9FF] text-[#0F3460] hover:bg-[#00D9FF]/10">
                  Learn More
                </Button>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              variants={itemVariants}
              className="relative h-96 hidden md:block"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/20 to-[#FF006E]/20 rounded-3xl blur-3xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity as any }}
              />
              <div className="relative h-full flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 3, repeat: Infinity as any }}
                  className="text-6xl"
                >
                  🔐
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
                <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 bg-white">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#0F3460] to-[#6A0572]">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-[#00D9FF] to-[#FF006E] rounded-lg">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white relative overflow-hidden">
        {/* Diagonal Divider */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0F3460] via-[#6A0572] to-[#FF006E]" />

        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Benefits List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-8 text-foreground">
                Why Choose TrustLink?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-[#F8F9FA] transition-colors"
                  >
                    <CheckCircle2 className="w-6 h-6 text-[#00D9FF] flex-shrink-0" />
                    <span className="text-lg text-foreground">{benefit.text}</span>
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
                { number: "99.8%", label: "Accuracy Rate" },
                { number: "<2s", label: "Processing Time" },
                { number: "10K+", label: "Verifications" },
                { number: "24/7", label: "Support" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-6 bg-gradient-to-br from-[#0F3460]/5 to-[#6A0572]/5 rounded-xl border border-[#00D9FF]/20 hover:border-[#00D9FF]/50 transition-all"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-[#0F3460] to-[#FF006E] bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-[#F8F9FA] to-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Simple Verification Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
              },
              {
                step: "2",
                title: "Take Selfie",
                description: "Take a selfie for face matching and biometric verification",
              },
              {
                step: "3",
                title: "Get Verified",
                description: "Receive your trust score and verification result instantly",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#00D9FF] to-[#FF006E] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {item.step}
                  </div>
                  <Card className="p-6 border-2 border-[#E0E0E0] hover:border-[#00D9FF] transition-colors">
                    <h3 className="text-xl font-bold mb-3 text-foreground mt-4">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </Card>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 bg-gradient-to-r from-[#0F3460] via-[#6A0572] to-[#FF006E] relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
          transition={{ duration: 8, repeat: Infinity as any }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [180, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity as any }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Verify Identities?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-white/90 mb-8">
              Join thousands of organizations using TrustLink for secure and efficient identity verification
            </motion.p>
            <motion.div variants={itemVariants} className="flex gap-4 justify-center flex-wrap">
              <Button onClick={handleFreeTrial} size="lg" className="bg-white text-[#0F3460] hover:bg-white/90 font-semibold">
                Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button onClick={handleScheduleDemo} size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                Schedule Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6" />
                <span className="font-bold text-lg">TrustLink</span>
              </div>
              <p className="text-white/70">Smart Digital Identity Verification</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/70">
            <p>&copy; 2024 TrustLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
