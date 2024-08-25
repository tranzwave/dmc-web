import Image from "next/image";
import TitleBar from "~/components/common/titleBar";
import Services from "~/components/overview/services";
import StatCards from "~/components/overview/statCards";
import TouristsByCountry from "~/components/overview/touristsByCountry";
import heroImage from '../../../../public/assets/Rectangle 47.png';

const Overview = () => {
    return (
        <div className="flex flex-col gap-3">
            <TitleBar title="Overview" link="toReadMe"/>
            <div className="w-full flex justify-center bg-[#83c9b6] rounded-lg">
                <Image src={heroImage} alt=""/>
            </div>
            <StatCards/>
            <div className="w-full flex flex-row gap-3">
                <div className="w-1/2 card gap-3">
                    <div>
                        <div className="card-title">Services</div>
                        <div className="text-sm text-primary-gray">Services you can interact with</div>
                    </div>
                    <div>
                        <Services/>
                    </div>
                </div>
                <div className="w-1/2 card gap-3">
                    <div>
                        <div className="card-title">Tourists By Country</div>
                        <div className="text-sm text-primary-gray">Countries with highest number of tourists</div>
                    </div>
                    <div>
                        <TouristsByCountry/>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Overview;