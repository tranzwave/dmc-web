// "use client";
// import { ColumnDef } from "@tanstack/react-table";
// import { useEffect, useState } from "react";
// import { Booking } from "~/components/bookings/home/columns";
// import { DataTable } from "~/components/bookings/home/dataTable";
// import TitleBar from "~/components/common/titleBar";
// import ContactBox from "~/components/ui/content-box";
// import { StatsCard } from "~/components/ui/stats-card";
// import { getAgentData, getData } from "~/lib/api";
// import { Agent } from "~/lib/types/agent/type";

// const Page = ({ params }: { params: { id: string } }) => {
//   const columns2: ColumnDef<Booking>[] = [
//     {
//       header: "Client",
//       accessorFn: (row) => row.client,
//     },
//     {
//       header: "Country",
//       accessorFn: (row) => row.client,
//     },
//     {
//       accessorKey: "startDate",
//       header: "Start Date",
//       // accessorFn: (row) => formatDate(row.startDate.toString()),
//     },
//     {
//       accessorKey: "endDate",
//       header: "End Date",
//       // accessorFn: (row) => formatDate(row.endDate.toString())
//     },
  
//   ];
//   const [agent, setAgent] = useState<Agent | null>(null);
//   const [data, setData] = useState<Booking[]>([]);

//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>();

//   useEffect(() => {
//     async function fetchAgentDetails() {
//       try {
//         setLoading(true);
//         const agents = await getAgentData();
//         const selectedAgent = agents.find(
//           (agent) => agent.id.toString() === params.id,
//         );
//         setAgent(selectedAgent ?? null);
//       } catch (error) {
//         console.error("Failed to fetch Agent details:", error);
//         setError("Failed to load agent details.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchAgentDetails();
//   }, [params.id]);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         setLoading(true);
//         const result = await getData();
//         setData(result);
//       } catch (error) {
//         console.error("Failed to fetch agent data:", error);
//         setError("Failed to load data.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!agent) {
//     return <div>No agent found with the given ID.</div>;
//   }

//   return (
//     <div className="flex flex-col gap-3 w-full justify-between">

//       <TitleBar title={`Agent  ${params.id}`} link="toAddAgent" />
//       <div className="mx-9 flex flex-row justify-between">
//         <div className="w-[30%]">
//           <div className="w-full">
//             <ContactBox
//               title={agent.general.name}
//               description="Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse."
//               location={agent.general.country}
//               phone={agent.general.primaryContactNumber}
//               email={agent.general.email} address={""}            />
//           </div>
//         </div>
//         <div className="card w-[70%] space-y-6">
//           <div>Current Booking</div>
//           <DataTable columns={columns2} data={data} />

//           <div>Booking History</div>
//           <div className="col-span-3 flex justify-between gap-6">
//             <StatsCard label="5 Star ratings" value="10" />
//             <StatsCard label="Bookings Completed" value="20" />
//             <StatsCard label="Upcoming Bookings" value="5" />
//           </div>

//           <div>Trip History</div>
//           <DataTable columns={columns2} data={data} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;

"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import TitleBar from "~/components/common/titleBar";
import ContactBox from "~/components/ui/content-box";
import { StatsCard } from "~/components/ui/stats-card";
import { getAgentVendorById } from "~/server/db/queries/agents";
import { SelectAgent } from "~/server/db/schemaTypes";
import { AgentVendorData } from "../page";

const Page = ({ params }: { params: { id: string } }) => {
  const [agent, setAgent] = useState<AgentVendorData | null>(null);
  const [data, setData] = useState<SelectAgent[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  // useEffect(() => {
  //   async function fetchRestaurantVoucherDetails() {
  //     try {
  //       setLoading(true);
  //       const vouchers = await getRestaurantVouchersForVendor(params.id);
  //       setData(vouchers)
  //     } catch (error) {
  //       console.error("Failed to fetch activity details:", error);
  //       setError("Failed to load activity details.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchRestaurantVoucherDetails();
  // }, [params.id]);

  useEffect(() => {
    async function fetchVendorData() {
      try {
        setLoading(true);
        const result = await getAgentVendorById(params.id);
        setAgent(result ?? null);
      } catch (error) {
        console.error("Failed to fetch agent data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchVendorData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // if (!activityVouchers) {
  //   return <div>No activity found with the given ID.</div>;
  // }
  if (!agent) {
    return <div>No vendor found with the given ID.</div>;
  }
  return (
    <div className="flex flex-col gap-3 w-full justify-between">

      <TitleBar title={`Restaurant - ${agent.name}`} link="toAddRestaurant" />
      <div className="mx-9 flex flex-row justify-between">
        <div className="w-[30%]">
          <div className="w-full">
            <ContactBox
              title={agent.name }
              description="Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse."
              location={agent.countryCode}
              address=""
              phone={agent.primaryContactNumber}
              email={"No email"}
            />{" "}
          </div>
        </div>
        <div className="card w-[70%] space-y-6">
          <div>Current Booking</div>
          <DataTable columns={AgentVendorColumns} data={data} />

          <div>Booking History</div>
          <div className="col-span-3 flex justify-between gap-6">
            <StatsCard label="5 Star ratings" value="10" />
            <StatsCard label="Bookings Completed" value="20" />
            <StatsCard label="Upcoming Bookings" value="5" />
          </div>

          <div>Trip History</div>
          <DataTable columns={AgentVendorColumns} data={data} />
        </div>
      </div>
    </div>
  );
};

export default Page;


const AgentVendorColumns: ColumnDef<SelectAgent>[] = [
  {
    header: "Agent",
    accessorFn: (row) => row.name,
  }

];
