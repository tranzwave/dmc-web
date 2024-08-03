
import SideNavBar from "~/components/common/sideNavComponent";
import TopBar from "~/components/common/topBarComponent";
import Overview from "./overview/page";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-screen flex flex-row">
      <div className="side-nav">
        <SideNavBar/>
      </div>
      <div className="w-full">
        <div className="top-bar">
          <TopBar/>
        </div>
        <div className="dashboard-content">
          {children}
        </div>
        
      </div>
    </div>

  );
}
