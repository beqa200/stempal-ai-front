import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <main className="bg-[#323131] min-h-[100vh]">
      <Outlet />
    </main>
  );
}
