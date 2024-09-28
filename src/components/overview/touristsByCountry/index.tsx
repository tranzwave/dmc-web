import ReactCountryFlag from 'react-country-flag';
import { Progress } from '~/components/ui/progress';

// Define prop types
export type TouristData = {
  country: string;
  code:string;
  count: number;
};

// Define the props for the TouristsByCountry component
type TouristsByCountryProps = {
  data: TouristData[];
};

const TouristsByCountry: React.FC<TouristsByCountryProps> = ({ data }) => {
  const totalClients = data.reduce((sum, country) => sum + country.count, 0);
  console.log(data)

  return (
    <div className="space-y-1">
      {data.map((country, index) => (
        <CountryCard
          key={index}
          name={country.country}
          tourists={country.count}
          total={totalClients}
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
