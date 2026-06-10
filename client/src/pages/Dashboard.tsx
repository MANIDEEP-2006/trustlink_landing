import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart3, FileText, CheckCircle2, AlertCircle, LogOut, Shield, Download, Settings, Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          className="text-center"
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  const handleStartVerification = () => {
    setLocation('/verify/start');
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

  const stats = [
    {
      label: "Total Verifications",
      value: "12",
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      label: "Average Trust Score",
      value: "95%",
      icon: BarChart3,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      label: "Verified Status",
      value: "Active",
      icon: CheckCircle2,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
    },
  ];

  const verifications = [
    {
      id: 1,
      date: "2024-06-10",
      documentType: "Passport",
      status: "Completed",
      trustScore: 98,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: 2,
      date: "2024-06-08",
      documentType: "Driver License",
      status: "Completed",
      trustScore: 95,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: 3,
      date: "2024-06-05",
      documentType: "ID Card",
      status: "Completed",
      trustScore: 92,
      gradient: "from-green-500 to-emerald-500",
    },
  ];

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
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-20"
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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              TrustLink
            </span>
          </motion.div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">Welcome, {user?.name || "User"}</span>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-32 pb-12 relative z-10">
        {/* Welcome Section */}
        <motion.div
          className="mb-12"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-xl text-slate-300">
            Manage your identity verifications and track your trust score
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition-opacity duration-300`} />
                <Card className={`relative p-6 border-0 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                      <motion.p
                        className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mt-2`}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <motion.div
                      className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-lg`}
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-4 mb-12 flex-wrap"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleStartVerification}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-2xl hover:shadow-cyan-500/50"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" /> New Verification
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              className="border-purple-500 text-purple-300 hover:bg-purple-500/10"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" /> Download Report
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
              size="lg"
            >
              <Settings className="w-4 h-4 mr-2" /> Settings
            </Button>
          </motion.div>
        </motion.div>

        {/* Verification History */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Verification History
          </h2>

          <div className="space-y-4">
            {verifications.map((verification, index) => (
              <motion.div
                key={verification.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <motion.div className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${verification.gradient} rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                  <Card className={`relative p-6 border-0 bg-gradient-to-r ${verification.gradient} bg-opacity-10 backdrop-blur-sm border border-slate-700 group-hover:border-slate-500 transition-all`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className={`p-3 bg-gradient-to-br ${verification.gradient} rounded-lg`}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                        >
                          <FileText className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="font-semibold text-white">{verification.documentType}</h3>
                          <p className="text-sm text-slate-400">{verification.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <motion.div
                          className="flex items-center gap-2 mb-2"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <span className={`text-2xl font-bold bg-gradient-to-r ${verification.gradient} bg-clip-text text-transparent`}>
                            {verification.trustScore}%
                          </span>
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        </motion.div>
                        <motion.span
                          className="text-xs text-green-400 font-semibold"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {verification.status}
                        </motion.span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          className="mt-16 p-8 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl border border-slate-700 text-center"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready for More Verifications?
          </h3>
          <p className="text-slate-300 mb-6">
            Start a new verification process to add more trusted identities
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleStartVerification}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl hover:shadow-purple-500/50"
              size="lg"
            >
              Start New Verification
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
