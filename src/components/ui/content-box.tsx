import { User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface ContactBoxProps {
  title: string;
  description: string;
  location: string;
  address: string;
  phone: string;
  email: string;
}

const ContactBox: React.FC<ContactBoxProps> = ({
  title,
  description,
  location,
  address,
  phone,
  email,
}) => {
  return (
    <div className="max-w-[400px] overflow-hidden rounded border border-gray-200 shadow-lg">
      <div className="flex h-60 items-center justify-center bg-gray-200">
        <span className="text-lg text-gray-500">Image Placeholder</span>
      </div>
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">{title}</div>
        <p className="text-base text-gray-700">{description}</p>
      </div>
      <div className="px-6 pb-4 pt-4">
        <div className="mb-3 flex items-center">
          <div className="mr-3 rounded-full bg-gray-300 p-2">
            <User></User>
          </div>
          <div className="my-4">
            <div className="text-sm font-semibold text-gray-600">
              {location}
            </div>
            <div className="text-sm text-gray-500">{address}</div>
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <Popover>
            <PopoverTrigger className="w-full p-1 bg-primary-green hover:bg-primary-green/90 text-white rounded-sm h-10 text-base">Contact Details</PopoverTrigger>
            <PopoverContent className="border border-primary-green space-y-4">
              <div className="bg-slate-100 p-2">
                <div className="text-base font-semibold">
                    Email
                </div>
                <div className="text-sm font-normal text-zinc-800">
                    {email}
                </div>
              </div>
              <div className="bg-slate-100 p-2">
                <div className="text-base font-semibold">
                    Contact Number
                </div>
                <div className="text-sm font-normal text-zinc-800">
                    {phone}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default ContactBox;
