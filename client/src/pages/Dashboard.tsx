import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart3, FileText, CheckCircle2, AlertCircle, LogOut, Shield } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#00D9FF] border-t-[#FF006E] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground">Loading dashboard...</p>
        </div>
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

  const verifications = [
    {
      id: 1,
      date: "2024-06-10",
      status: "completed",
      trustScore: 98,
      documentType: "Passport",
    },
    {
      id: 2,
      date: "2024-06-08",
      status: "completed",
      trustScore: 95,
      documentType: "Driver License",
    },
    {
      id: 3,
      date: "2024-06-05",
      status: "completed",
      trustScore: 92,
      documentType: "ID Card",
    },
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
          <div className="flex items-center gap-4">
            <span className="text-foreground">{user?.name || "User"}</span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-2 text-foreground">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your identity verifications and track your trust score
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="p-6 border-0 bg-gradient-to-br from-[#0F3460]/5 to-[#6A0572]/5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Total Verifications</p>
                  <p className="text-3xl font-bold text-foreground">3</p>
                </div>
                <FileText className="w-12 h-12 text-[#00D9FF] opacity-20" />
              </div>
            </Card>

            <Card className="p-6 border-0 bg-gradient-to-br from-[#00D9FF]/5 to-[#FF006E]/5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Average Trust Score</p>
                  <p className="text-3xl font-bold text-foreground">95%</p>
                </div>
                <BarChart3 className="w-12 h-12 text-[#FF006E] opacity-20" />
              </div>
            </Card>

            <Card className="p-6 border-0 bg-gradient-to-br from-[#6A0572]/5 to-[#FF006E]/5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Status</p>
                  <p className="text-3xl font-bold text-green-600">Verified</p>
                </div>
                <CheckCircle2 className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </Card>
          </motion.div>

          {/* Action Button */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              onClick={handleStartVerification}
              className="bg-gradient-to-r from-[#0F3460] to-[#6A0572] text-white hover:shadow-xl transition-all"
              size="lg"
            >
              Start New Verification
            </Button>
          </motion.div>

          {/* Verification History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-foreground">Verification History</h2>
            <div className="space-y-4">
              {verifications.map((verification, index) => (
                <motion.div
                  key={verification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <Card className="p-6 border-0 bg-white hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-[#00D9FF] to-[#FF006E] rounded-lg">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{verification.documentType}</h3>
                          <p className="text-sm text-muted-foreground">{verification.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-foreground">{verification.trustScore}%</span>
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </div>
                        <span className="text-xs text-green-600 font-semibold">Verified</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
