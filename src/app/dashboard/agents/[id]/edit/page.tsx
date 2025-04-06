'use client'
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import GeneralTab from '~/components/agents/addAgent/forms/generalForm';
import EditAgentSubmitForm from '~/components/agents/addAgent/forms/submitForm/editAgentSubmit';
import LoadingLayout from '~/components/common/dashboardLoading';
import TitleBar from '~/components/common/titleBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Agent } from '~/lib/types/agent/type';
import { getAgentVendorById } from '~/server/db/queries/agents';
import { SelectAgent } from '~/server/db/schemaTypes';
import { AddAgentProvider, useAddAgent } from '../../add/context';

export type AgentData = SelectAgent & {
  // countryCode:SelectCountry;
};

// const SubmitForm = () => {
//   const { agentDetails: agentDetails } = useEditAgent();

//   const handleSubmit = () => {
//     // Handle the submission of agentDetails
//     console.log('Submitting agent details:', agentDetails);
//   };

//   return (
//     <div className='flex flex-col gap-3'>
//       <div className='card w-full h-10'>
//         <p>Review all the details and submit your agent.</p>
//       </div>
//       <div className='flex w-full justify-center'>
//         <Button variant="primaryGreen" onClick={handleSubmit}>
//           Submit
//         </Button>
//       </div>
//     </div>
//   );
// };

const EditAgent = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const { agentDetails, setGeneralDetails, setActiveTab,activeTab } = useAddAgent();
  const [data, setData] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null)
  const [agentData, setAgentData] = useState<AgentData>()


  useEffect(() => {
    async function fetchDriverDetails() {
      try {
        setLoading(true);
        const selectedAgent = await getAgentVendorById(id);
        if(!selectedAgent){
          throw new Error("Couldn't find agent")

        }

        setAgentData(selectedAgent);
        setGeneralDetails({
          name: selectedAgent.name,
          countryCode: selectedAgent.countryCode,
          email: selectedAgent.email,
          primaryContactNumber: selectedAgent.primaryContactNumber,
          agency: selectedAgent.agency,
          address: selectedAgent.address ?? "",
          marketingTeamId: selectedAgent.marketingTeamId,
        })
      
      } catch (error) {
        console.error("Failed to fetch driver details:", error);
        setError("Failed to load driver details.");
      } finally {
        setLoading(false);
      }
    }

    fetchDriverDetails();
    console.log('Edit Agent Component');
  }, [id]);

  if (loading) {
    return <div><LoadingLayout/></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-1 w-full justify-between">
            <TitleBar title="Edit Agent" link="toEditAgent" />
            {/* <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div> */}
          </div>
          <div className='w-full'>
            <Tabs defaultValue="general" className="w-full border" value={activeTab}>
              <TabsList className='flex justify-evenly w-full'>
                <TabsTrigger 
                value="general"
                isCompleted={false}
                onClick={() => setActiveTab("general")}
                inProgress={activeTab == "general"}
                  >
                    General
                    </TabsTrigger>
                <TabsTrigger  
                value="submit" inProgress = {activeTab == "general"}
                  disabled={
                    !agentDetails.general.name ||
                    !agentDetails.general.email ||
                    !agentDetails.general.primaryContactNumber ||
                    !agentDetails.general.agency
                  }>Submit</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                {/* <GeneralTab onSetDetails={setGeneralDetails} /> */}
                <GeneralTab/>
              </TabsContent>
              <TabsContent value="submit">
              <EditAgentSubmitForm id={id} originalAgentData={agentData ?? null} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WrappedEditAgent() {
  const { id } = useParams();
  return (
    <AddAgentProvider>
      {id ? <EditAgent id={id as string} /> : <div>No agent ID provided.</div>}
      </AddAgentProvider>
  );
}
