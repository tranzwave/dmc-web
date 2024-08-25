import { useState } from "react";
import { useAddHotel } from "~/app/dashboard/hotels/add/context"
import { Button } from "~/components/ui/button";

const AddHotelSubmitView = () =>{
    const {hotelGeneral,restaurants,hotelRooms,hotelStaff} = useAddHotel()
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const addHotel = async()=>{
        console.log({
            hotelGeneral,restaurants,hotelRooms,hotelStaff
        })

        try {
            const response = await fetch('/api/hotels', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                hotelGeneral,
                hotelStaff,
                hotelRooms
              }),
            });
      
            if (!response.ok) {
              throw new Error(`Error: ${response.statusText}`);
            }
      
            const result = await response.json();
            console.log('Success:', result);
      
            // Handle successful response (e.g., show a success message)
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
        }

    return(
        <div className="flex justify-center">
            <Button variant={"primaryGreen"} onClick={addHotel}>Submit Now</Button>
        </div>
    )

}

export default AddHotelSubmitView;