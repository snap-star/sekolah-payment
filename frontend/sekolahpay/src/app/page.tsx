"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  CreditCard,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  QrCode,
  Plus,
  Filter,
  MoreVertical,
  Download,
  User,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { mockUsers, mockTagihan, getDashboardStats } from "@/lib/mock-data";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type UserType = typeof mockUsers[0];
type TagihanType = typeof mockTagihan[0];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const stats = getDashboardStats();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = mockUsers.find((u) => u.email === email);
    if (user && password === "password123") {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Email atau password salah. Coba: admin@sekolahpay.sch.id / password123");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setEmail("");
    setPassword("");
  };

  const filteredTagihan = mockTagihan.filter(
    (t) =>
      t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.jenisTagihan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = [
    { name: "Jan", lunas: 15000000, belum: 5000000 },
    { name: "Feb", lunas: 18000000, belum: 3000000 },
    { name: "Mar", lunas: 17500000, belum: 4500000 },
    { name: "Apr", lunas: 20000000, belum: 2000000 },
    { name: "Mei", lunas: 19000000, belum: 3500000 },
    { name: "Jun", lunas: 21000000, belum: 1500000 },
  ];

  const pieData = [
    { name: "Lunas", value: stats.jumlahLunas, color: "#86efac" },
    { name: "Belum", value: stats.jumlahBelumLunas, color: "#fcd34d" },
    { name: "Tertunda", value: stats.jumlahTertunda, color: "#fca5a5" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "lunas":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
            <CheckCircle className="w-3 h-3 mr-1" /> Lunas
          </Badge>
        );
      case "belum_lunas":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
            <Clock className="w-3 h-3 mr-1" /> Belum Lunas
          </Badge>
        );
      case "tertunda":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
            <AlertCircle className="w-3 h-3 mr-1" /> Tertunda
          </Badge>
        );
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-linear-to-br from-sky-50 via-teal-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-2xl mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">SekolahPay</h1>
            <p className="text-gray-500 mt-1">Sistem Pembayaran Sekolah</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@sekolahpay.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border-gray-200"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border-gray-200"
                required
              />
            </div>

            {loginError && (
              <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{loginError}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-5 text-base"
            >
              Masuk ke Sistem
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Demo credentials: admin@sekolahpay.sch.id / password123
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 fixed h-full z-20`}
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="font-bold text-gray-800 dark:text-white">SekolahPay</h2>
                <p className="text-xs text-gray-400">Pembayaran QRIS</p>
              </div>
            )}
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "tagihan", label: "Kelola Tagihan", icon: CreditCard },
            { id: "siswa", label: "Data Siswa", icon: Users },
            { id: "qris", label: "QRIS Payment", icon: QrCode },
            { id: "settings", label: "Pengaturan", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5 text-gray-500" />
              </button>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari tagihan, siswa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-500" />
                )}
              </button>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg">
                    <Avatar className="w-8 h-8 bg-teal-100 text-teal-700">
                      <User className="w-4 h-4" />
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-800">{currentUser?.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{currentUser?.role}</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" /> Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" /> Pengaturan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" /> Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
                <p className="text-gray-500 dark:text-gray-400">
                  {format(new Date(), "EEEE, dd MMMM yyyy", { locale: id })}
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5 bg-linear-to-br from-teal-50 to-emerald-50 dark:from-teal-950/50 dark:to-emerald-950/50 border-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm">Total Penerimaan</p>
                      <p className="text-2xl font-bold  mt-1">
                        {formatCurrency(stats.totalLunas)}
                      </p>
                      <p className="text-xs text-green-600 mt-2">↑ 12% dari bulan lalu</p>
                    </div>
                    <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>

                <Card className="p-5 bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/50 dark:to-cyan-950/50 border-0">
                   <div className="flex items-start justify-between">
                     <div>
                       <p className="text-sm text-gray-500 dark:text-gray-400">Total Siswa</p>
                       <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.totalSiswa}</p>
                       <p className="text-xs text-sky-600 mt-2">Semua siswa aktif</p>
                     </div>
                     <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center">
                       <Users className="w-6 h-6 text-white" />
                     </div>
                   </div>
                 </Card>

                 <Card className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-0">
                   <div className="flex items-start justify-between">
                     <div>
                       <p className="text-sm text-gray-500 dark:text-gray-400">Tagihan Belum Lunas</p>
                       <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                         {formatCurrency(stats.totalBelumLunas)}
                       </p>
                       <p className="text-xs text-amber-600 mt-2">{stats.jumlahBelumLunas} tagihan</p>
                     </div>
                     <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                       <Clock className="w-6 h-6 text-white" />
                     </div>
                   </div>
                 </Card>

                 <Card className="p-5 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/50 dark:to-pink-950/50 border-0">
                   <div className="flex items-start justify-between">
                     <div>
                       <p className="text-sm text-gray-500 dark:text-gray-400">Tagihan Tertunda</p>
                       <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                         {formatCurrency(stats.totalTertunda)}
                       </p>
                       <p className="text-xs text-rose-600 mt-2">{stats.jumlahTertunda} tagihan</p>
                     </div>
                     <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center">
                       <AlertCircle className="w-6 h-6 text-white" />
                     </div>
                   </div>
                 </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6 border-0 bg-white dark:bg-gray-900">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Penerimaan Bulanan</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" tickFormatter={(value) => `${value / 1000000}JT`} />
                      <Tooltip
                        formatter={(value: any) => formatCurrency(value as number)}
                        contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", backgroundColor: "#1f2937", color: "#fff" }}
                      />
                      <Bar dataKey="lunas" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Lunas" />
                      <Bar dataKey="belum" fill="#fcd34d" radius={[4, 4, 0, 0]} name="Belum" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6 border-0 bg-white dark:bg-gray-900">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Status Tagihan</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "#fff", border: "none" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2 mt-4">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Recent Transactions */}
              <Card className="border-0 bg-white dark:bg-gray-900">
                <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Tagihan Terbaru</h3>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left p-4 text-sm font-medium text-gray-500">Invoice</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-500">Siswa</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-500">Jenis</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-500">Jumlah</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-500">Jatuh Tempo</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTagihan.slice(0, 5).map((tagihan) => (
                        <tr key={tagihan.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="p-4">
                            <span className="text-sm font-medium text-gray-800">{tagihan.id}</span>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{tagihan.studentName}</p>
                              <p className="text-xs text-gray-400">{tagihan.kelas}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-600">{tagihan.jenisTagihan}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-medium text-gray-800">
                              {formatCurrency(tagihan.jumlah)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-600">
                              {format(new Date(tagihan.jatuhTempo), "dd MMM yyyy", { locale: id })}
                            </span>
                          </td>
                          <td className="p-4">{getStatusBadge(tagihan.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "tagihan" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Kelola Tagihan</h1>
                  <p className="text-gray-500">Kelola semua tagihan pembayaran siswa</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" className="gap-2">
                    <Filter className="w-4 h-4" /> Filter
                  </Button>
                  <Button variant="secondary" className="gap-2">
                    <Download className="w-4 h-4" /> Export
                  </Button>
                  <Button className="bg-teal-500 hover:bg-teal-600 gap-2">
                    <Plus className="w-4 h-4" /> Tambah Tagihan
                  </Button>
                </div>
              </div>

              <Card className="border-0">
                <div className="overflow-x-auto">
                  <Table>
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left p-4 text-sm font-medium text-gray-500">Invoice</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-500">Siswa</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-500">Kelas</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-500">Jenis Tagihan</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-500">Jumlah</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-500">Jatuh Tempo</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-500">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTagihan.map((tagihan) => (
                        <tr key={tagihan.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="p-4">
                            <span className="text-sm font-medium text-gray-800">{tagihan.id}</span>
                          </td>
                          <td className="p-4">
                            <p className="text-sm font-medium text-gray-800">{tagihan.studentName}</p>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-600">{tagihan.kelas}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-600">{tagihan.jenisTagihan}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-medium text-gray-800">
                              {formatCurrency(tagihan.jumlah)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-600">
                              {format(new Date(tagihan.jatuhTempo), "dd MMM yyyy", { locale: id })}
                            </span>
                          </td>
                          <td className="p-4">{getStatusBadge(tagihan.status)}</td>
                          <td className="p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                                {tagihan.status !== "lunas" && (
                                  <>
                                    <DropdownMenuItem>Konfirmasi Pembayaran</DropdownMenuItem>
                                    <DropdownMenuItem>Generate QRIS</DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Hapus</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "qris" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">QRIS Payment Gateway</h1>
                <p className="text-gray-500">Generate dan kelola kode QRIS untuk pembayaran</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-8 border-0 text-center">
                  <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <QrCode className="w-32 h-32 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Scan QR untuk Membayar</h3>
                  <p className="text-sm text-gray-500 mt-1">Gunakan aplikasi e-wallet untuk scan</p>
                  <Button className="mt-4 bg-teal-500 hover:bg-teal-600">Generate QR Baru</Button>
                </Card>
                <Card className="p-6 border-0">
                  <h3 className="font-semibold text-gray-800 mb-4">Pembayaran QRIS Terbaru</h3>
                  <div className="space-y-4">
                    {mockTagihan
                      .filter((t) => t.metodeBayar === "QRIS")
                      .map((tagihan) => (
                        <div
                          key={tagihan.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                              <QrCode className="w-5 h-5 text-teal-600" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-800">
                                {tagihan.studentName}
                              </p>
                              <p className="text-xs text-gray-400">{tagihan.id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-800">
                              {formatCurrency(tagihan.jumlah)}
                            </p>
                            <p className="text-xs text-green-600">Berhasil</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}