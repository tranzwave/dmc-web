// lib/api.ts
import { Hotel } from "~/components/bookings/addBooking/forms/hotelsForm/columns";
import { Shop } from "~/components/bookings/addBooking/forms/shopsForm/columns";
import { Booking } from "~/components/bookings/home/columns";
import { driversMockData, hotelsMockData, shopsMockData } from "./mockData";
import { Activity } from "./types/activity/type";
import { Driver, VehicleType } from "./types/driver/type";

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
  // Mock data
  const mockData: Driver[] = driversMockData

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData), 1000); // Simulate network delay
  });
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




