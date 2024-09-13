'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import GeneralTab from '~/components/agents/addAgent/forms/generalForm';
import SubmitForm from '~/components/agents/addAgent/forms/submitForm';
import TitleBar from '~/components/common/titleBar';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { AddAgentProvider, useAddAgent } from './context';

// const SubmitForm = () => {
//   const { agentDetails: agentDetails } = useAddAgent();

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

const AddAgent = () => {
  const pathname = usePathname();
  const { setGeneralDetails, activeTab, setActiveTab, agentDetails } = useAddAgent();

  useEffect(() => {
    console.log('Add Agent Component');
  }, []);

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-1 w-full justify-between">
            <TitleBar title="Add Agent" link="toAddAgent" />
            <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div>
          </div>
          <div className='w-full'>
            <Tabs defaultValue="general" className="w-full border">
              <TabsList className='flex justify-evenly w-full'>
                <TabsTrigger 
                value="general"
                  isCompleted={false}
                  onClick={() => setActiveTab("general")}
                  statusLabel="Mandatory"
                  inProgress={activeTab == "general"}
                  >
                    General
                    </TabsTrigger>
                <TabsTrigger  
                value="submit"
                  isCompleted={agentDetails.general.name.length > 0}
                  inProgress={activeTab == "submit"}
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
                <SubmitForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WrappedAddAgent() {
  return (
    <AddAgentProvider>
      <AddAgent />
    </AddAgentProvider>
  );
}
