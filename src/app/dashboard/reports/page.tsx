"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoadingLayout from "~/components/common/dashboardLoading";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";

const Reports = () => {
    const pathname = usePathname()
  return (
    <div>
      <div className="flex w-full flex-row justify-between gap-1">
        <TitleBar title="Reports" link="to AddReport" />
        <div>
          <Link href={`${pathname}/add`}>
            <Button variant="primaryGreen">Add Report</Button>
          </Link>
        </div>
      </div>
      <LoadingLayout />
    </div>
  );
};

export default Reports;
