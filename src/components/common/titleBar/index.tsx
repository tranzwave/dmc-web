import { FC } from 'react';

type TitleBarProps = {
  title: string;
  link: string;
};

const TitleBar: FC<TitleBarProps> = ({ title, link }) => {
  return (
    <div className="flex flex-row justify-between">
      <div className='font-semibold text-2xl text-primary-black'>{title}</div>
      {/* <Button variant={'outline'}>Read Me</Button> */}
    </div>
  );
};

export default TitleBar;
