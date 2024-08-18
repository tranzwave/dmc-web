import { ArrowLeft } from "lucide-react";

interface ContactBoxProps {
    title: string;
    description: string;
    location: string;
    address: string;
    phone: string;
    email: string;
}

const ContactBox: React.FC<ContactBoxProps> = ({ title, description, location, address, phone, email }) => {
    return (
        <div className="max-w-[400px] rounded overflow-hidden shadow-lg border border-gray-200">
            <div className="bg-gray-200 h-60 flex items-center justify-center">
                <span className="text-gray-500 text-lg">Image Placeholder</span>
            </div>
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{title}</div>
                <p className="text-gray-700 text-base">
                    {description}
                </p>
            </div>
            <div className="px-6 pt-4 pb-4">
                <div className="flex items-center mb-3">
                    <div className="bg-gray-300 rounded-full p-2 mr-3">
                        <img className="w-6 h-6 text-gray-600"/>
                        <ArrowLeft></ArrowLeft>
                    </div>
                    <div className="my-4">
                        <div className="text-sm text-gray-600 font-semibold">{location}</div>
                        <div className="text-sm text-gray-500">{address}</div>
                    </div>
                </div>
                <div className="flex justify-between gap-2">
                    <button className="bg-primary-green text-white  py-2 px-4 rounded hover:bg-primary-green/90" >
                        {phone}
                    </button>
                    <button className="border border-primary-green text-primary-green  py-2 px-4 rounded hover:bg-primary-green/10">
                        {email}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactBox;
