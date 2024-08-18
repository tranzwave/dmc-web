'use client'
import { useEffect, useState } from "react"
import { DataTable } from "~/components/bookings/home/dataTable"
import { columns, Hotel, voucherColumns } from "./columns"
import HotelsForm from "./hotelsForm"
import { HotelVoucher, useAddBooking } from "~/app/dashboard/bookings/add/context"
import { Button } from "~/components/ui/button"
import { SelectHotel, SelectHotelVoucher, SelectHotelVoucherLine } from "~/server/db/schemaTypes"
import { Loader2Icon } from "lucide-react"

const HotelsTab = () => {
    const [addedHotels, setAddedHotels] =useState<Hotel[]>([])
    const { addHotelVoucher,bookingDetails } = useAddBooking();
    const [loading,setLoading] = useState(false);
    const [hotels,setHotels] = useState<SelectHotel[]>([]);
    const [error,setError] = useState<string | null>()

    const updateHotels = (data:SelectHotelVoucherLine,isNewVoucher:boolean,hotel:any)=>{
        console.log(data);
        if(isNewVoucher){
          const voucher:SelectHotelVoucher = {
            hotelId:hotel?.id ?? "",
            bookingLineId:"",
            coordinatorId:"",
            createdAt:new Date,
            id:"",
            updatedAt:new Date
          }
          const hotelVoucher:HotelVoucher = {
            hotel:hotel as SelectHotel,
            voucher:voucher,
            voucherLines:[data]
          }
          addHotelVoucher(hotelVoucher)
        } else{
          const voucher:SelectHotelVoucher = {
            hotelId:hotel?.id ?? "",
            bookingLineId:"",
            coordinatorId:"",
            createdAt:new Date,
            id:"",
            updatedAt:new Date
          } 
        }
        // addHotelVoucher(hotel);
    }

    const getHotels = async () => {
        setLoading(true);
      
        try {
          const response = await fetch('/api/hotels', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
      
          const result = await response.json();
          console.log('Fetched Hotels:', result);
      
          
          setHotels(result.allHotels);
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('An unknown error occurred');
          }
          console.error('Error:', error);
        } finally {
          setLoading(false); 
        }
      };

    useEffect(()=>{
        getHotels()
    },[])


    if(loading){
        return (
            <div>Loading</div>
        )
    }
    return (
        <div className="flex flex-col gap-3 justify-center items-center ">
            <div className='w-full flex flex-row gap-2 justify-center'>
                <div className='w-[25%]'>
                    <div className='card'>
                        Calendar
                    </div>
                </div>
                <div className='card w-[70%] space-y-6'>
                    <div className='card-title'>Hotel Information</div>
                    {hotels && <HotelsForm onAddHotel={updateHotels} hotels={hotels}/>}
                    
                </div>
            </div>
            <div className='flex flex-col gap-2 items-center justify-center w-[95%]'>
                <div className='w-full'>
                    <DataTable columns={voucherColumns} data={bookingDetails.vouchers}/>
                </div>
                <div className="w-full flex justify-end">
                <Button variant={"primaryGreen"}>Next</Button>
            </div>
            </div>
            
        </div>
    );
}


export default HotelsTab;