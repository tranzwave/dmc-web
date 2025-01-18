import DocumentsForm from "./documetsForm";

type DocumentsTabProps = {
    isDriver: boolean;
  };

const DocumentsTab: React.FC<DocumentsTabProps> = ({ isDriver }) => {
    return(
        <div className='flex flex-row gap-2 justify-center mx-9'>
            <div className='card w-[100%] space-y-6'>
                <div className='card-title'>Documents</div>
                <DocumentsForm isDriver={isDriver}/>
            </div>
        </div>
    )
}

export default DocumentsTab;