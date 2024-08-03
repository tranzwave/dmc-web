import { SearchIcon, Info, Settings, Bell, User } from "lucide-react";
import Image from "next/image";

const TopBar = () => {
    return (
        <div className="w-full flex flex-row justify-between items-center p-4 bg-white">
            <div className="flex flex-row gap-2 items-center">
                <SearchIcon size={20} color="#697077"/>
                <div className="font-sans font-light text-[#697077] text-base">
                    Search anything here
                </div>
            </div>
            <div className="flex flex-row gap-8 items-center">
                <div className="flex flex-row gap-3 items-center">
                    <Info size={20} color="#697077" className="cursor-pointer"/>
                    <Settings size={20} color="#697077" className="cursor-pointer"/>
                    <Bell size={20} color="#697077" className="cursor-pointer"/>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                <Image
                        src="https://xsgames.co/randomusers/avatar.php?g=male"
                        alt="Profile"
                        width={32}
                        height={32}
                        className="object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default TopBar;
