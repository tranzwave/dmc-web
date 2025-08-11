"use client";
import { FC, useEffect, useState } from 'react';
import VoucherSettingsComponent from './voucherSettingsComponent';
import cc from 'currency-codes';
import { SelectTenant } from '~/server/db/schemaTypes';
import { get } from 'http';
import { getTenantById } from '~/server/db/queries/tenants';
import { Button } from '~/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { useOrganization } from '@clerk/nextjs';

type TitleBarProps = {
  title: string;
  link: string;
};

const TitleBar: FC<TitleBarProps> = ({ title, link }) => {
  const [tenant, setTenant] = useState<SelectTenant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {organization, isLoaded} = useOrganization();

  const currencies = cc.codes();
  const previousSettings = {
    hotelVoucherCurrency: 'USD',
    restaurantVoucherCurrency: 'USD',
    activityVoucherCurrency: 'USD',
    shopVoucherCurrency: 'USD',
    transportVoucherCurrency: 'USD',
  };

  const fetchTenant = async () => {
    setLoading(true);
    try {
      const tenant = await getTenantById(organization?.id ?? '');
      if (!tenant) {
        throw new Error('Tenant not found');
      }
      setTenant(tenant);
      //Set to local storage
      localStorage.setItem('voucherSettings', JSON.stringify(tenant.voucherSettings ?? previousSettings));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch tenant:', error);
      setError('Failed to load voucher settings.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if(title.includes('Tasks'))
    {
      fetchTenant();
    }
  }, []);



  return (
    <div className="w-full flex flex-row justify-between items-center">
      <div className='font-semibold text-2xl text-primary-black'>{title}</div>
      <div>
        { loading || !isLoaded && <div>
          <Button variant={'primaryGreen'} disabled={true} className='flex flex-row gap-2'>
            <div>
              <LoaderCircle size={20} className='animate-spin'/>
            </div>
            <div>Loading Voucher Settings</div>
          </Button>
        </div> }
        { error && <div className='text-red-500 text-[13px]'>Please Refresh</div> }
        { title.includes('Tasks') && !loading && !error && tenant && <VoucherSettingsComponent tenant={tenant} currencies={currencies} onSettingsUpdate={fetchTenant}/> }
      </div>
      {/* <Button variant={'outline'}>Read Me</Button> */}
    </div>
  );
};

export default TitleBar;
