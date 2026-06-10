import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BarChart3,
  Users,
  FileText,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  Shield,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Loader,
  Search,
  X as XIcon,
  Download,
} from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type AdminTab = "dashboard" | "verifications" | "users" | "high-risk";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVerifications, setFilteredVerifications] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-950 to-red-900 flex items-center justify-center">
        <Card className="p-8 bg-red-50 border-0">
          <div className="flex items-center gap-4 mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          </div>
          <p className="text-red-700 mb-6">You do not have permission to access the admin dashboard.</p>
          <Button
            onClick={() => setLocation("/")}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = trpc.admin.getStats.useQuery();

  // Fetch verifications
  const { data: verificationsData, isLoading: verificationsLoading } = trpc.admin.getVerifications.useQuery(
    { limit: 10, offset: 0 },
    { enabled: activeTab === "verifications" }
  );

  // Fetch users
  const { data: usersData, isLoading: usersLoading } = trpc.admin.getUsers.useQuery(
    { limit: 10, offset: 0 },
    { enabled: activeTab === "users" }
  );

  // Fetch high-risk verifications
  const { data: highRiskData, isLoading: highRiskLoading } = trpc.admin.getHighRiskVerifications.useQuery(
    { limit: 20 },
    { enabled: activeTab === "high-risk" }
  );

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const filterByDateRange = (data: any[]) => {
    if (!startDate && !endDate) return data;
    
    return data.filter((v: any) => {
      const recordDate = new Date(v.completedAt);
      const start = startDate ? new Date(startDate) : new Date('1970-01-01');
      const end = endDate ? new Date(endDate) : new Date('2099-12-31');
      
      return recordDate >= start && recordDate <= end;
    });
  };

  const exportToCSV = () => {
    let data = searchQuery ? filteredVerifications : verificationsData?.data || [];
    data = filterByDateRange(data);
    
    if (!data || data.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Prepare CSV headers
    const headers = ["Verification Code", "User ID", "Status", "Trust Score", "Date"];
    
    // Prepare CSV rows
    const rows = data.map((v: any) => [
      v.verificationCode,
      v.userId,
      v.status,
      v.trustScore,
      new Date(v.completedAt).toLocaleDateString(),
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(",")),
    ].join("\n");


    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `verifications-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${data.length} records to CSV`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const StatCard = ({
    label,
    value,
    icon: Icon,
    color,
  }: {
    label: string;
    value: number;
    icon: any;
    color: string;
  }) => (
    <motion.div className="group relative" variants={itemVariants}>
      <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
      <Card className="relative p-6 border-0 bg-gradient-to-br from-white to-slate-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">{label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          </div>
          <div className={`p-3 bg-gradient-to-br ${color} rounded-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-1/3 w-96 h-96 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur-3xl opacity-20"
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-20"
          animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <motion.div
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 flex flex-col`}
          initial={false}
        >
          {/* Logo */}
          <div className="p-4 border-b border-slate-800">
            <motion.div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <p className="text-sm font-bold text-white">TrustLink</p>
                  <p className="text-xs text-slate-400">Admin Panel</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "verifications", label: "Verifications", icon: FileText },
              { id: "users", label: "Users", icon: Users },
              { id: "high-risk", label: "High Risk", icon: AlertTriangle },
            ].map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => setActiveTab(id as AdminTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === id
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
              </motion.button>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-slate-800 space-y-3">
            {sidebarOpen && (
              <div className="px-4 py-3 bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-400">Logged in as</p>
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              </div>
            )}
            <motion.button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm">Logout</span>}
            </motion.button>
          </div>

          {/* Toggle Button */}
          <motion.button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 m-4 hover:bg-slate-800 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-slate-400" />
            ) : (
              <Menu className="w-5 h-5 text-slate-400" />
            )}
          </motion.button>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    Admin Dashboard
                  </h1>
                  <p className="text-slate-400">Welcome back! Here's your verification overview.</p>
                </div>

                {/* Stats Grid */}
                {statsLoading ? (
                  <div className="flex justify-center py-12">
                    <motion.div
                      
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
                    />
                  </div>
                ) : (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                  >
                    <StatCard
                      label="Total Verifications"
                      value={stats?.totalVerifications || 0}
                      icon={FileText}
                      color="from-blue-600 to-cyan-600"
                    />
                    <StatCard
                      label="Verified"
                      value={stats?.verifiedCount || 0}
                      icon={CheckCircle2}
                      color="from-green-600 to-emerald-600"
                    />
                    <StatCard
                      label="Rejected"
                      value={stats?.rejectedCount || 0}
                      icon={XCircle}
                      color="from-red-600 to-pink-600"
                    />
                    <StatCard
                      label="Expired"
                      value={stats?.expiredCount || 0}
                      icon={Clock}
                      color="from-yellow-600 to-orange-600"
                    />
                    <StatCard
                      label="Pending"
                      value={stats?.pendingCount || 0}
                      icon={Loader}
                      color="from-purple-600 to-pink-600"
                    />
                    <StatCard
                      label="Total Users"
                      value={stats?.totalUsers || 0}
                      icon={Users}
                      color="from-indigo-600 to-blue-600"
                    />
                  </motion.div>
                )}

                {/* Recent Activity */}
                <motion.div variants={itemVariants} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  <Card className="relative p-6 border-0 bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Quick Stats
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-700/50 rounded-lg">
                        <p className="text-slate-400 text-sm">Verification Rate</p>
                        <p className="text-2xl font-bold text-green-400">
                          {stats?.totalVerifications ? Math.round((stats.verifiedCount / stats.totalVerifications) * 100) : 0}%
                        </p>
                      </div>
                      <div className="p-4 bg-slate-700/50 rounded-lg">
                        <p className="text-slate-400 text-sm">Fraud Detection Rate</p>
                        <p className="text-2xl font-bold text-red-400">
                          {stats?.totalVerifications ? Math.round(((stats.rejectedCount + stats.pendingCount) / stats.totalVerifications) * 100) : 0}%
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {/* Verifications Tab */}
            {activeTab === "verifications" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-white">All Verifications</h1>
                  <motion.button
                    onClick={() => exportToCSV()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </motion.button>
                </div>

                {/* Search Bar */}
                <motion.div className="group relative" variants={itemVariants}>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  <div className="relative flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus-within:border-cyan-500 transition-colors">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by verification code, user ID, or status..."
                      value={searchQuery}
                      onChange={(e) => {
                        const query = e.target.value.toLowerCase();
                        setSearchQuery(query);
                        if (verificationsData?.data) {
                          const filtered = verificationsData.data.filter((v: any) =>
                            v.verificationCode?.toLowerCase().includes(query) ||
                            v.userId?.toString().includes(query) ||
                            v.status?.toLowerCase().includes(query)
                          );
                          setFilteredVerifications(filtered);
                        }
                      }}
                      className="flex-1 bg-transparent outline-none text-white placeholder-slate-500"
                    />
                    {searchQuery && (
                      <motion.button
                        onClick={() => {
                          setSearchQuery("");
                          setFilteredVerifications([]);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 hover:bg-slate-700 rounded transition-colors"
                      >
                        <XIcon className="w-4 h-4 text-slate-400" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>

                {/* Date Range Filter */}
                <motion.div className="group relative" variants={itemVariants}>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  <div className="relative bg-slate-800 border border-slate-700 rounded-lg p-4 focus-within:border-purple-500 transition-colors">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">Filter by Date Range</h3>
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="text-xs text-slate-400 block mb-2">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:border-purple-500 outline-none transition-colors"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-slate-400 block mb-2">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:border-purple-500 outline-none transition-colors"
                        />
                      </div>
                      {(startDate || endDate) && (
                        <motion.button
                          onClick={() => {
                            setStartDate("");
                            setEndDate("");
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors text-sm"
                        >
                          Clear
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>

                {verificationsLoading ? (
                  <div className="flex justify-center py-12">
                    <motion.div
                      
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
                    />
                  </div>
                ) : (
                  <motion.div className="group relative" variants={itemVariants}>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                    <Card className="relative border-0 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-700">
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Code</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">User ID</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Trust Score</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterByDateRange(searchQuery ? filteredVerifications : verificationsData?.data || [])?.map((v: any) => (
                              <tr key={v.id} className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
                                <td className="px-6 py-4 text-sm text-slate-300 font-mono">{v.verificationCode}</td>
                                <td className="px-6 py-4 text-sm text-slate-400">{v.userId}</td>
                                <td className="px-6 py-4 text-sm">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    v.status === "verified"
                                      ? "bg-green-900/30 text-green-400"
                                      : v.status === "rejected"
                                        ? "bg-red-900/30 text-red-400"
                                        : "bg-yellow-900/30 text-yellow-400"
                                  }`}>
                                    {v.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-300">{v.trustScore}%</td>
                                <td className="px-6 py-4 text-sm text-slate-400">
                                  {new Date(v.completedAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold text-white">User Management</h1>

                {usersLoading ? (
                  <div className="flex justify-center py-12">
                    <motion.div
                      
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
                    />
                  </div>
                ) : (
                  <motion.div className="group relative" variants={itemVariants}>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                    <Card className="relative border-0 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-700">
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Name</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Email</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Role</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Joined</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usersData?.data?.map((u: any) => (
                              <tr key={u.id} className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
                                <td className="px-6 py-4 text-sm text-slate-300">{u.name}</td>
                                <td className="px-6 py-4 text-sm text-slate-400">{u.email}</td>
                                <td className="px-6 py-4 text-sm">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    u.role === "admin"
                                      ? "bg-purple-900/30 text-purple-400"
                                      : "bg-blue-900/30 text-blue-400"
                                  }`}>
                                    {u.role}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">
                                  {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* High Risk Tab */}
            {activeTab === "high-risk" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold text-white">High Risk Verifications</h1>

                {highRiskLoading ? (
                  <div className="flex justify-center py-12">
                    <motion.div
                      
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
                    />
                  </div>
                ) : (
                  <motion.div className="group relative" variants={itemVariants}>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                    <Card className="relative border-0 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
                      {highRiskData && highRiskData.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-slate-700">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Code</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">User ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Fraud Type</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {highRiskData?.map((v: any) => (
                                <tr key={v.id} className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
                                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">{v.verificationCode}</td>
                                  <td className="px-6 py-4 text-sm text-slate-400">{v.userId}</td>
                                  <td className="px-6 py-4 text-sm">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-900/30 text-red-400">
                                      {v.fraudDetectionResult}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-slate-400">
                                    {new Date(v.completedAt).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                          <p className="text-slate-400">No high-risk verifications detected!</p>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
