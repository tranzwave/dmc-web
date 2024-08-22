// lib/api.ts
import { BookingDetails } from "~/app/dashboard/bookings/add/context";
import { Hotel } from "~/components/bookings/addBooking/forms/hotelsForm/columns";
import { Shop } from "~/components/bookings/addBooking/forms/shopsForm/columns";
import { Booking } from "~/components/bookings/home/columns";
import { driversMockData, hotelsMockData, shopsMockData } from "./mockData";
import { Activity } from "./types/activity/type";
import { Driver, VehicleType } from "./types/driver/type";

export interface BookingSchema extends BookingDetails {
  createdAt: number,
  id: string
}

let bookings: BookingSchema[] = [];

if (typeof window !== "undefined") {  //use this for checck browser environment
  bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
}

// Mock data for storing bookings
// let bookings: BookingSchema[] = JSON.parse(localStorage.getItem('bookings') || '[]');

export async function addBooking(bookingDetails: BookingDetails): Promise<{ success: boolean; message: string; id: string }> {

  const time = Date.now()
  const id = 'B' + time;

  const booking = {
    ...bookingDetails,
    createdAt: time,
    id: id
  };

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Add the booking to the mock data
  bookings.push(booking);

  // Save the updated bookings to local storage
  localStorage.setItem('bookings', JSON.stringify(bookings));

  return { success: true, message: "Booking added successfully", id: booking.id };
}

// Mock API function to get a booking by ID
export async function getBookingById(id: string): Promise<BookingSchema | null> {
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Retrieve bookings from local storage
  const bookingsJson = localStorage.getItem('bookings');
  if (!bookingsJson) {
    return null; // No bookings found
  }

  const bookings: BookingSchema[] = JSON.parse(bookingsJson);

  // Find the booking by ID
  const booking = bookings.find(b => b.id === id);

  // Return the booking or null if not found
  return booking || null;
}




export async function getData(): Promise<Booking[]> {
  // Fetch data from your API here.
  return [
    {
      id: "B123456",
      client: "John Doe",
      date: "2024-08-01",
      days: 5,
      progress: 75,
      details: {
        hotels: {
          title: "Hotels & Restaurants",
          vouchersToFinalize: 5,
          done: 2,
          totalVouchers: 7,
          locked: false
        },
        transport: {
          title: "Transport",
          vouchersToFinalize: 2,
          done: 3,
          totalVouchers: 5,
          locked: true
        },
        activities: {
          title: "Activities",
          vouchersToFinalize: 6,
          done: 4,
          totalVouchers: 10,
          locked: true
        },
        shops: {
          title: "Shops",
          vouchersToFinalize: 2,
          done: 3,
          totalVouchers: 5,
          locked: true
        }
      }
    },
    {
      id: "B234567",
      client: "Jane Smith",
      date: "2024-08-15",
      days: 3,
      progress: 50,
      details: {
        hotels: {
          title: "Hotels & Restaurants",
          vouchersToFinalize: 4,
          done: 1,
          totalVouchers: 5,
          locked: false
        },
        transport: {
          title: "Transport",
          vouchersToFinalize: 1,
          done: 2,
          totalVouchers: 3,
          locked: true
        },
        activities: {
          title: "Activities",
          vouchersToFinalize: 5,
          done: 3,
          totalVouchers: 8,
          locked: true
        },
        shops: {
          title: "Shops",
          vouchersToFinalize: 3,
          done: 1,
          totalVouchers: 4,
          locked: true
        }
      }
    },
    {
      id: "B345678",
      client: "Alice Johnson",
      date: "2024-09-01",
      days: 7,
      progress: 85,
      details: {
        hotels: {
          title: "Hotels & Restaurants",
          vouchersToFinalize: 6,
          done: 3,
          totalVouchers: 9,
          locked: false
        },
        transport: {
          title: "Transport",
          vouchersToFinalize: 3,
          done: 4,
          totalVouchers: 7,
          locked: true
        },
        activities: {
          title: "Activities",
          vouchersToFinalize: 8,
          done: 5,
          totalVouchers: 13,
          locked: true
        },
        shops: {
          title: "Shops",
          vouchersToFinalize: 4,
          done: 2,
          totalVouchers: 6,
          locked: true
        }
      }
    },
    {
      id: "B456789",
      client: "Bob Brown",
      date: "2024-09-10",
      days: 2,
      progress: 40,
      details: {
        hotels: {
          title: "Hotels & Restaurants",
          vouchersToFinalize: 2,
          done: 1,
          totalVouchers: 3,
          locked: false
        },
        transport: {
          title: "Transport",
          vouchersToFinalize: 1,
          done: 2,
          totalVouchers: 3,
          locked: true
        },
        activities: {
          title: "Activities",
          vouchersToFinalize: 3,
          done: 2,
          totalVouchers: 5,
          locked: true
        },
        shops: {
          title: "Shops",
          vouchersToFinalize: 1,
          done: 1,
          totalVouchers: 2,
          locked: true
        }
      }
    },
    {
      id: "B567890",
      client: "Charlie Davis",
      date: "2024-09-20",
      days: 4,
      progress: 60,
      details: {
        hotels: {
          title: "Hotels & Restaurants",
          vouchersToFinalize: 3,
          done: 2,
          totalVouchers: 5,
          locked: false
        },
        transport: {
          title: "Transport",
          vouchersToFinalize: 2,
          done: 3,
          totalVouchers: 5,
          locked: true
        },
        activities: {
          title: "Activities",
          vouchersToFinalize: 5,
          done: 3,
          totalVouchers: 8,
          locked: true
        },
        shops: {
          title: "Shops",
          vouchersToFinalize: 2,
          done: 2,
          totalVouchers: 4,
          locked: true
        }
      }
    },
    {
      id: "B678901",
      client: "Diana Evans",
      date: "2024-10-05",
      days: 6,
      progress: 70,
      details: {
        hotels: {
          title: "Hotels & Restaurants",
          vouchersToFinalize: 5,
          done: 3,
          totalVouchers: 8,
          locked: false
        },
        transport: {
          title: "Transport",
          vouchersToFinalize: 3,
          done: 2,
          totalVouchers: 5,
          locked: true
        },
        activities: {
          title: "Activities",
          vouchersToFinalize: 4,
          done: 3,
          totalVouchers: 7,
          locked: true
        },
        shops: {
          title: "Shops",
          vouchersToFinalize: 2,
          done: 1,
          totalVouchers: 3,
          locked: true
        }
      }
    },
    {
      id: "B789012",
      client: "Edward Green",
      date: "2024-10-12",
      days: 5,
      progress: 90,
      details: {
        hotels: {
          title: "Hotels & Restaurants",
          vouchersToFinalize: 4,
          done: 2,
          totalVouchers: 6,
          locked: false
        },
        transport: {
          title: "Transport",
          vouchersToFinalize: 2,
          done: 3,
          totalVouchers: 5,
          locked: true
        },
        activities: {
          title: "Activities",
          vouchersToFinalize: 5,
          done: 4,
          totalVouchers: 9,
          locked: true
        },
        shops: {
          title: "Shops",
          vouchersToFinalize: 3,
          done: 1,
          totalVouchers: 4,
          locked: true
        }
      }
    },
    {
      id: "B890123",
      client: "Fiona Harris",
      date: "2024-11-01",
      days: 8,
      progress: 65,
      details: {
        hotels: {
          title: "Hotels & Restaurants",
          vouchersToFinalize: 6,
          done: 3,
          totalVouchers: 9,
          locked: false
        },
        transport: {
          title: "Transport",
          vouchersToFinalize: 4,
          done: 2,
          totalVouchers: 6,
          locked: true
        },
        activities: {
          title: "Activities",
          vouchersToFinalize: 7,
          done: 4,
          totalVouchers: 11,
          locked: true
        },
        shops: {
          title: "Shops",
          vouchersToFinalize: 3,
          done: 2,
          totalVouchers: 5,
          locked: true
        }
      }
    },
    {
      id: "B901234",
      client: "George Irwin",
      date: "2024-11-15",
      days: 3,
      progress: 55,
      details: {
        hotels: {
          title: "Hotels & Restaurants",
          vouchersToFinalize: 4,
          done: 1,
          totalVouchers: 5,
          locked: false
        },
        transport: {
          title: "Transport",
          vouchersToFinalize: 3,
          done: 2,
          totalVouchers: 5,
          locked: true
        },
        activities: {
          title: "Activities",
          vouchersToFinalize: 5,
          done: 3,
          totalVouchers: 8,
          locked: true
        },
        shops: {
          title: "Shops",
          vouchersToFinalize: 2,
          done: 2,
          totalVouchers: 4,
          locked: true
        }
      }
    },
    {
      id: "B012345",
      client: "Hannah James",
      date: "2024-12-01",
      days: 10,
      progress: 80,
      details: {
        hotels: {
          title: "Hotels & Restaurants",
          vouchersToFinalize: 7,
          done: 4,
          totalVouchers: 11,
          locked: false
        },
        transport: {
          title: "Transport",
          vouchersToFinalize: 5,
          done: 3,
          totalVouchers: 8,
          locked: true
        },
        activities: {
          title: "Activities",
          vouchersToFinalize: 9,
          done: 5,
          totalVouchers: 14,
          locked: true
        },
        shops: {
          title: "Shops",
          vouchersToFinalize: 4,
          done: 3,
          totalVouchers: 7,
          locked: true
        }
      }
    }
  ];
}


export async function getDrivers(): Promise<Hotel[]> {
  return [];
}


export async function getTransportData(): Promise<Driver[]> {
  return [
    // Existing drivers
    {
      id: 1,
      general: {
        name: "John Doe",
        languages: ["English", "Spanish"],
        primaryEmail: "john.doe@example.com",
        primaryContactNumber: "+1234567890",
        address: {
          streetName: "123 Elm Street",
          city: "Springfield",
          province: "IL",
        },
        guide: true,
      },
      vehicles: [
        {
          primary: true,
          vehicleType: VehicleType.BUS,
          numberPlate: "XYZ 1234",
          seats: 12,
          make: "Ford",
          model: "Transit",
          year: 2020,
          licenseID: "LIC123456",
        },
      ],
      charges: {
        feePerKm: 0.5,
        fuelAllowance: 100,
        accommodationAllowance: 50,
        mealAllowance: 20,
      },
      documents: {
        driversLicense: "DL123456789",
        guideLicense: "GL987654321",
        vehicleEmissionTest: "EM123456",
        insurance: "INS123456",
      },
    },
    {
      id: 2,
      general: {
        name: "Jane Smith",
        languages: ["English", "French"],
        primaryEmail: "jane.smith@example.com",
        primaryContactNumber: "+0987654321",
        address: {
          streetName: "456 Maple Avenue",
          city: "Riverside",
          province: "CA",
        },
        guide: false,
      },
      vehicles: [
        {
          primary: true,
          vehicleType: VehicleType.BUS,
          numberPlate: "ABC 5678",
          seats: 4,
          make: "Toyota",
          model: "Camry",
          year: 2018,
          licenseID: "LIC654321",
        },
      ],
      charges: {
        feePerKm: 0.6,
        fuelAllowance: 80,
        accommodationAllowance: 40,
        mealAllowance: 15,
      },
      documents: {
        driversLicense: "DL987654321",
        guideLicense: "GL123456789",
        vehicleEmissionTest: "EM654321",
        insurance: "INS654321",
      },
    },
    // New drivers
    {
      id: 3,
      general: {
        name: "Emily Johnson",
        languages: ["English", "German"],
        primaryEmail: "emily.johnson@example.com",
        primaryContactNumber: "+1122334455",
        address: {
          streetName: "789 Birch Road",
          city: "Greenwood",
          province: "WA",
        },
        guide: true,
      },
      vehicles: [
        {
          primary: true,
          vehicleType: VehicleType.CAR,
          numberPlate: "LMN 9876",
          seats: 7,
          make: "Honda",
          model: "Pilot",
          year: 2021,
          licenseID: "LIC789123",
        },
      ],
      charges: {
        feePerKm: 0.7,
        fuelAllowance: 120,
        accommodationAllowance: 60,
        mealAllowance: 25,
      },
      documents: {
        driversLicense: "DL321654987",
        guideLicense: "GL456789123",
        vehicleEmissionTest: "EM987654",
        insurance: "INS987654",
      },
    },
    {
      id: 4,
      general: {
        name: "Michael Brown",
        languages: ["English", "Chinese"],
        primaryEmail: "michael.brown@example.com",
        primaryContactNumber: "+2233445566",
        address: {
          streetName: "101 Oak Lane",
          city: "Hillside",
          province: "TX",
        },
        guide: false,
      },
      vehicles: [
        {
          primary: true,
          vehicleType: VehicleType.BUS,
          numberPlate: "OPQ 4567",
          seats: 2,
          make: "Chevrolet",
          model: "Silverado",
          year: 2019,
          licenseID: "LIC321987",
        },
      ],
      charges: {
        feePerKm: 0.8,
        fuelAllowance: 150,
        accommodationAllowance: 70,
        mealAllowance: 30,
      },
      documents: {
        driversLicense: "DL654321987",
        guideLicense: "GL789456123",
        vehicleEmissionTest: "EM456789",
        insurance: "INS456789",
      },
    },
    {
      id: 5,
      general: {
        name: "Sophia Davis",
        languages: ["English", "Japanese"],
        primaryEmail: "sophia.davis@example.com",
        primaryContactNumber: "+3344556677",
        address: {
          streetName: "202 Pine Street",
          city: "Lakeside",
          province: "FL",
        },
        guide: true,
      },
      vehicles: [
        {
          primary: true,
          vehicleType: VehicleType.CAR,
          numberPlate: "RST 2345",
          seats: 8,
          make: "Kia",
          model: "Carnival",
          year: 2022,
          licenseID: "LIC987123",
        },
      ],
      charges: {
        feePerKm: 0.9,
        fuelAllowance: 110,
        accommodationAllowance: 55,
        mealAllowance: 22,
      },
      documents: {
        driversLicense: "DL987321654",
        guideLicense: "GL321456987",
        vehicleEmissionTest: "EM321654",
        insurance: "INS321654",
      },
    }
  ]
}

export async function getHotelData(): Promise<Hotel[]> {
  // Mock data
  const mockData: Hotel[] = hotelsMockData

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData), 1000); // Simulate network delay
  });
}


export type DriverSearchParams = {
  vehicleType: VehicleType;
  languages: string[];
  type: string
}

export async function searchDriverData(searchParams: DriverSearchParams): Promise<Driver[]> {
  // Simulate a delay for the async function
  await new Promise(resolve => setTimeout(resolve, 500));

  // Filter drivers based on search parameters
  return driversMockData.filter(driver => {
    const matchesVehicleType = driver.vehicles.some(vehicle => vehicle.vehicleType === searchParams.vehicleType);

    // Check if at least one language matches
    const matchesLanguages = searchParams.languages.some(language => driver.general.languages.includes(language));

    const matchesGuideType = (
      searchParams.type === 'Both' ||
      (searchParams.type === 'Guide' && driver.general.guide) ||
      (searchParams.type === 'Driver' && !driver.general.guide)
    );

    return matchesVehicleType && matchesLanguages && matchesGuideType;
  });
};

export type ShopsSearchParams = {
  shopType: string;
  city: string;
  productType: string;
}

export async function searchShopsData(searchParams: ShopsSearchParams): Promise<Shop[]> {
  // Simulate a delay for the async function
  await new Promise(resolve => setTimeout(resolve, 500));

  // Filter drivers based on search parameters
  return shopsMockData.filter(shop => {
    const matchesShopType = shop.shopType === searchParams.shopType;

    // Check if at least one language matches
    const matchesShopCity = searchParams.city === shop.city;

    const matchesProductType = shop.productType === searchParams.productType;

    return matchesShopType && matchesShopCity && matchesProductType;
  });
}

export const getActivityData = async (): Promise<Activity[]> => {
  // Implement the actual fetch logic here
  // For demonstration purposes, we return a static list
  return [
    {
      id: 1,
      general: {
        vendorName: "Vendor 1",
        activity: "Activity 1",
        primaryEmail: "email1@example.com",
        primaryContactNumber: "123-456-7890",
        address: {
          streetName: "Street 1",
          city: "City 1",
          province: "Province 1"
        },
        capacity: 50
      }
    },
    {
      id: 2,
      general: {
        vendorName: "Vendor 2",
        activity: "Activity 2",
        primaryEmail: "email2@example.com",
        primaryContactNumber: "098-765-4321",
        address: {
          streetName: "Street 2",
          city: "City 2",
          province: "Province 2"
        },
        capacity: 30
      }
    }
  ];
};

// lib/api.ts

export async function getActivityDataById(id: number): Promise<Activity> {
  // Simulate a fetch request; replace with actual API request if available
  const activities = await getActivityData(); // Assuming this gets all activities
  const activity = activities.find(activity => activity.id === id);
  if (!activity) {
    throw new Error("Activity not found");
  }
  return activity;
}









export type { Activity };


export type { Driver };

