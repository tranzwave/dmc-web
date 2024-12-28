"use client"
import { LoaderCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '~/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { toast } from '~/hooks/use-toast';
import { VoucherSettings } from '~/lib/types/booking';
import { updateTenantVoucherSettings } from '~/server/db/queries/tenants';
import { SelectTenant } from '~/server/db/schemaTypes';

const VoucherSettingsComponent: React.FC<{ tenant: SelectTenant, currencies:string[] }> = ({ tenant, currencies }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [settings, setSettings] = useState<VoucherSettings>(tenant.voucherSettings ?? {
        hotelVoucherCurrency: '',
        restaurantVoucherCurrency: '',
        activityVoucherCurrency: '',
        shopVoucherCurrency: '',
        transportVoucherCurrency: '',
    }
    );

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleSave = async() => {
        setLoading(true);
        // Save the settings to db inside try catch
        try {
            // Save the settings to db
            const updatedTenant = await updateTenantVoucherSettings(tenant.id ?? '', { voucherSettings: settings });
            if (!updatedTenant) {
                throw new Error('Failed to update tenant');
            }
            //Toast success
            toast({
                title: 'Settings Saved',
                description: 'Voucher settings have been saved successfully',
            })
            setLoading(false);
            // setIsModalVisible(false);
            window.location.reload();
        } catch (error) {
            console.error('Failed to save settings:',)
            //Toast error
            toast({
                title: 'Uh Oh!',
                description: 'Failed to save voucher settings'
            })
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleHotelCurrencyChange = (hotelCurrency: string) => {
        setSettings({ ...settings, hotelVoucherCurrency: hotelCurrency });
    };

    const handleRestaurantCurrencyChange = (restaurantCurrency: string) => {
        setSettings({ ...settings, restaurantVoucherCurrency: restaurantCurrency });
    }

    const handleActivityCurrencyChange = (activityCurrency: string) => {
        setSettings({ ...settings, activityVoucherCurrency: activityCurrency });
    }

    const handleShopCurrencyChange = (shopCurrency: string) => {
        setSettings({ ...settings, shopVoucherCurrency: shopCurrency });
    }

    return (
        <div>
            <Dialog open={isModalVisible} onOpenChange={setIsModalVisible}>
                <DialogTrigger asChild>
                    <Button variant="primaryGreen" onClick={showModal}>
                        Open Voucher Settings
                    </Button>
                </DialogTrigger>
                <DialogContent className=''>
                    <DialogTitle>Voucher Settings</DialogTitle>
                    <DialogDescription>
                        You can set the currency for each voucher type.
                    </DialogDescription>
                    <div className='space-y-3'>
                        <div className='flex flex-row gap-2 text-sm w-full items-center'>
                            <div className='w-[60%] font-medium'>Hotel Voucher</div>
                            <div className='w-[40%]'>
                                <Select
                                    value={settings.hotelVoucherCurrency}
                                    onValueChange={handleHotelCurrencyChange}

                                >
                                    <SelectTrigger className="bg-slate-100 shadow-md">
                                        <SelectValue placeholder="Select Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((currency) => (
                                            <SelectItem
                                                key={currency}
                                                value={currency}
                                            >
                                                {currency}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>
                        <div className='flex flex-row gap-2 text-sm w-full items-center'>
                            <div className='w-[60%] font-medium'>Restaurant Voucher</div>
                            <div className='w-[40%]'>
                                <Select
                                    value={settings.restaurantVoucherCurrency}
                                    onValueChange={handleRestaurantCurrencyChange}
                                >
                                    <SelectTrigger className="bg-slate-100 shadow-md">
                                        <SelectValue placeholder="Select Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((currency) => (
                                            <SelectItem
                                                key={currency}
                                                value={currency}
                                            >
                                                {currency}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className='flex flex-row gap-2 text-sm w-full items-center'>
                            <div className='w-[60%] font-medium'>Activity Voucher</div>
                            <div className='w-[40%]'>
                                <Select
                                    value={settings.activityVoucherCurrency}
                                    onValueChange={handleActivityCurrencyChange}
                                >
                                    <SelectTrigger className="bg-slate-100 shadow-md">
                                        <SelectValue placeholder="Select Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((currency) => (
                                            <SelectItem
                                                key={currency}
                                                value={currency}
                                            >
                                                {currency}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className='flex flex-row gap-2 text-sm w-full items-center'>
                            <div className='w-[60%] font-medium'>Shop Voucher</div>
                            <div className='w-[40%]'>
                                <Select
                                    value={settings.shopVoucherCurrency}
                                    onValueChange={handleShopCurrencyChange}
                                >
                                    <SelectTrigger className="bg-slate-100 shadow-md">
                                        <SelectValue placeholder="Select Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((currency) => (
                                            <SelectItem
                                                key={currency}
                                                value={currency}
                                            >
                                                {currency}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className='flex flex-row gap-2 text-sm w-full items-center'>
                            <div className='w-[60%] font-medium'>Transport Voucher</div>
                            <div className='w-[40%]'>
                                <Select
                                    value={settings.transportVoucherCurrency}
                                    onValueChange={handleShopCurrencyChange}
                                >
                                    <SelectTrigger className="bg-slate-100 shadow-md">
                                        <SelectValue placeholder="Select Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((currency) => (
                                            <SelectItem
                                                key={currency}
                                                value={currency}
                                            >
                                                {currency}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                    </div>
                    <div className='flex flex-row items-center justify-end gap-2'>
                        <Button onClick={handleSave} variant={'primaryGreen'} disabled = {loading}>
                            {loading ? (<div className='flex flex-row gap-2 items-center'>
                                <LoaderCircle size={20} className='animate-spin' />
                                <div>Saving</div>
                            </div>) : 'Save'}
                        </Button>
                        <Button onClick={handleCancel} variant={'primaryGreen'}>Cancel</Button>
                    </div>

                </DialogContent>
            </Dialog>
        </div>
    );
};

export default VoucherSettingsComponent;
