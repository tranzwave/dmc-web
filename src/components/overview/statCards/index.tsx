import { ArrowUp } from 'lucide-react';
import React from 'react';
import { Badge } from '~/components/ui/badge';

type CardProps = {
  title: string;
  value: number;
  percentage: number;
};

type StatCardsProps = {
  stats: CardProps[];
};

const formatNumber = (num: number) => {
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
};

const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((card, index) => (
        <Card key={index} title={card.title} value={card.value} percentage={card.percentage} />
      ))}
    </div>
  );
};

const Card: React.FC<CardProps> = ({ title, value, percentage }) => {
  return (
    <div className="flex flex-col gap-1 p-4 rounded-lg border border-primary-borderGray shadow-md">
      <div className="font-normal text-lg text-primary-textGray">{title}</div>
      <div className="text-2xl font-bold text-primary-black">{formatNumber(value)}</div>
      <div className="flex flex-row gap-1 items-center">
        <Badge variant={'outline'} className='text-[#287f71] bg-[#d1ffe1]'>
          <ArrowUp size={10} color='#287f71'/>
          {percentage}%
        </Badge>
        <div className="text-xs text-primary-gray">Compared to last month</div>
      </div>
    </div>
  );
};

export default StatCards;
