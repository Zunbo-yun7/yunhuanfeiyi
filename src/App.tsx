import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Home = lazy(() => import("@/pages/Home").then((mod) => ({ default: mod.Home })));
const AboutYingge = lazy(() => import("@/pages/AboutYingge").then((mod) => ({ default: mod.AboutYingge })));
const XintanYingge = lazy(() => import("@/pages/XintanYingge").then((mod) => ({ default: mod.XintanYingge })));
const ActionAtlas = lazy(() => import("@/pages/ActionAtlas").then((mod) => ({ default: mod.ActionAtlas })));
const EquipmentGuide = lazy(() => import("@/pages/EquipmentGuide").then((mod) => ({ default: mod.EquipmentGuide })));
const PeopleStories = lazy(() => import("@/pages/PeopleStories").then((mod) => ({ default: mod.PeopleStories })));
const AIGuide = lazy(() => import("@/pages/AIGuide").then((mod) => ({ default: mod.AIGuide })));
const PracticeLogs = lazy(() => import("@/pages/PracticeLogs").then((mod) => ({ default: mod.PracticeLogs })));
const MaskDIY = lazy(() => import("@/pages/MaskDIY").then((mod) => ({ default: mod.MaskDIY })));
const PerformanceSchedule = lazy(() => import("@/pages/PerformanceSchedule").then((mod) => ({ default: mod.PerformanceSchedule })));

const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin").then((mod) => ({ default: mod.AdminLogin })));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout").then((mod) => ({ default: mod.AdminLayout })));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard").then((mod) => ({ default: mod.AdminDashboard })));
const AdminHome = lazy(() => import("@/pages/admin/AdminHome").then((mod) => ({ default: mod.AdminHome })));
const AdminAbout = lazy(() => import("@/pages/admin/AdminAbout").then((mod) => ({ default: mod.AdminAbout })));
const AdminXintan = lazy(() => import("@/pages/admin/AdminXintan").then((mod) => ({ default: mod.AdminXintan })));
const AdminActions = lazy(() => import("@/pages/admin/AdminActions").then((mod) => ({ default: mod.AdminActions })));
const AdminEquipment = lazy(() => import("@/pages/admin/AdminEquipment").then((mod) => ({ default: mod.AdminEquipment })));
const AdminPeople = lazy(() => import("@/pages/admin/AdminPeople").then((mod) => ({ default: mod.AdminPeople })));
const AdminLogs = lazy(() => import("@/pages/admin/AdminLogs").then((mod) => ({ default: mod.AdminLogs })));
const AdminSchedules = lazy(() => import("@/pages/admin/AdminSchedules").then((mod) => ({ default: mod.AdminSchedules })));

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yingge-gray">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-yingge-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-yingge-dark/60">加载中...</p>
      </div>
    </div>
  );
}

function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-yingge-gray">
      <Navbar title="云焕非遗" subtitle="英歌文化数字展示平台" />
      <main className="flex-1 pt-[140px]">
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

function AdminRoute() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminLayout />
    </Suspense>
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="xintan" element={<AdminXintan />} />
            <Route path="actions" element={<AdminActions />} />
            <Route path="equipment" element={<AdminEquipment />} />
            <Route path="people" element={<AdminPeople />} />
            <Route path="schedules" element={<AdminSchedules />} />
            <Route path="logs" element={<AdminLogs />} />
          </Route>
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutYingge />} />
            <Route path="/xintan" element={<XintanYingge />} />
            <Route path="/actions" element={<ActionAtlas />} />
            <Route path="/equipment" element={<EquipmentGuide />} />
            <Route path="/stories" element={<PeopleStories />} />
            <Route path="/guide" element={<AIGuide />} />
            <Route path="/logs" element={<PracticeLogs />} />
            <Route path="/mask-diy" element={<MaskDIY />} />
            <Route path="/schedule" element={<PerformanceSchedule />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
