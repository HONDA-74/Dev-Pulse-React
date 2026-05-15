import { Outlet } from "react-router";
import Header from "../components/header";
import Footer from "../components/footer";

export default function LayoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-200">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}