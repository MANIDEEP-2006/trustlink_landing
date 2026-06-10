import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Register() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert("Registration successful! Redirecting to dashboard...");
      setLocation('/dashboard');
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
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
          className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, -50, 0],
            y: [0, -100, 0],
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
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              TrustLink
            </span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleBackHome}
              variant="outline"
              className="border-violet-500 text-violet-400 hover:bg-violet-500/10"
            >
              Back to Home
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 flex items-center justify-center min-h-screen relative z-10">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div className="text-center mb-8" variants={itemVariants}>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Create Account
              </h1>
              <p className="text-slate-300">
                Join TrustLink and start verifying identities
              </p>
            </motion.div>

            {/* Form Card */}
            <motion.div variants={itemVariants}>
              <motion.div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <Card className="relative p-8 border-0 bg-gradient-to-br from-violet-50 to-purple-50 backdrop-blur-sm">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-violet-600" />
                        <motion.input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          whileFocus={{ scale: 1.02 }}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                            errors.name ? "border-red-500" : "border-violet-200"
                          }`}
                        />
                      </div>
                      {errors.name && (
                        <motion.p
                          className="text-red-600 text-sm mt-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Email Field */}
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-violet-600" />
                        <motion.input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          whileFocus={{ scale: 1.02 }}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                            errors.email ? "border-red-500" : "border-violet-200"
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <motion.p
                          className="text-red-600 text-sm mt-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Password Field */}
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-violet-600" />
                        <motion.input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          whileFocus={{ scale: 1.02 }}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                            errors.password ? "border-red-500" : "border-violet-200"
                          }`}
                        />
                      </div>
                      {errors.password && (
                        <motion.p
                          className="text-red-600 text-sm mt-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Confirm Password Field */}
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-violet-600" />
                        <motion.input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          whileFocus={{ scale: 1.02 }}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                            errors.confirmPassword ? "border-red-500" : "border-violet-200"
                          }`}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <motion.p
                          className="text-red-600 text-sm mt-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-2xl hover:shadow-violet-500/50 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <motion.div
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            Create Account <ArrowRight className="ml-2 w-5 h-5" />
                          </>
                        )}
                      </Button>
                    </motion.div>

                    {/* Login Link */}
                    <motion.p variants={itemVariants} className="text-center text-slate-700">
                      Already have an account?{" "}
                      <motion.button
                        type="button"
                        onClick={() => setLocation('/login')}
                        className="text-violet-600 font-semibold hover:text-fuchsia-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        Sign in
                      </motion.button>
                    </motion.p>
                  </form>
                </Card>
              </motion.div>
            </motion.div>

            {/* Terms */}
            <motion.p variants={itemVariants} className="text-center text-xs text-slate-400 mt-6">
              By creating an account, you agree to our{" "}
              <motion.a href="#" className="text-violet-400 hover:underline" whileHover={{ scale: 1.05 }}>
                Terms of Service
              </motion.a>{" "}
              and{" "}
              <motion.a href="#" className="text-violet-400 hover:underline" whileHover={{ scale: 1.05 }}>
                Privacy Policy
              </motion.a>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
