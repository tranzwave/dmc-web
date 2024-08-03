import Image from 'next/image'; // Import the Progress component from ShadCN
import { Progress } from '~/components/ui/progress';
import ReactCountryFlag from 'react-country-flag';

// Mock Data
const touristsByCountry = [
  { name: 'USA', tourists: 1235, total: 12348, code: 'US' },
  { name: 'France', tourists: 5241, total: 12348, code: 'FR' },
  { name: 'Italy', tourists: 2354, total: 12348, code: 'IT' },
  { name: 'Spain', tourists: 1233, total: 12348, code: 'ES' },
];

const TouristsByCountry = () => {
  return (
    <div className="space-y-1">
      {touristsByCountry.map((country, index) => (
        <CountryCard
          key={index}
          name={country.name}
          tourists={country.tourists}
          total={country.total}
          code={country.code}
        />
      ))}
    </div>
  );
};

type CountryCardProps = {
  name: string;
  tourists: number;
  total: number;
  code: string;
};

const CountryCard: React.FC<CountryCardProps> = ({ name, tourists, total, code }) => {
  const progressPercentage = (tourists / total) * 100;

  return (
    <div className="flex flex-row gap-4 items-center p-2 rounded-lg">
      <div className="w-12 h-12 rounded-full border overflow-hidden flex justify-center">
        <div>
        <ReactCountryFlag
          countryCode={code}
          svg
          style={{
            transform: 'scale(5)', 
            transformOrigin: 'center',
          }}
        />
        </div>

      </div>
      <div className="w-full">
        <div className="flex flex-row justify-between mb-2">
          <div className="text-sm text-primary-textGray font-medium">{name}</div>
          <div className="text-sm text-primary-textGray font-medium">{tourists.toLocaleString()}</div>
        </div>
        <div className="mb-4">
          <Progress value={progressPercentage} max={100} className='h-2'/>
        </div>
        {/* <div className="text-xs text-gray-500 text-right">
          {progressPercentage.toFixed(1)}% of total
        </div> */}
      </div>
    </div>
  );
};

export default TouristsByCountry;
