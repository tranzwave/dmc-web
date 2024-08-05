import { Shop } from "~/components/bookings/addBooking/forms/shopsForm/columns";
import { Driver, VehicleType } from "./types/driver/type";
import { Hotel } from "~/components/bookings/addBooking/forms/hotelsForm/columns";

export const driversMockData: Driver[] = [
    // Existing drivers
    {
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
          primary:true,
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
          primary:true,
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
          primary:true,
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
          primary:true,
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
          primary:true,
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
  ];


export const shopsMockData: Shop[] = [
  {
    shopType: "Mall",
    city: "New York",
    productType: "Clothing",
    date: "2024-08-01",
    time: "10:00 AM",
    headCount: 5,
    hours: 2,
    remarks: "Seasonal Sale"
  },
  {
    shopType: "Boutique",
    city: "Paris",
    productType: "Accessories",
    date: "2024-08-02",
    time: "11:00 AM",
    headCount: 3,
    hours: 1,
    remarks: "Exclusive collection"
  },
  {
    shopType: "Supermarket",
    city: "London",
    productType: "Groceries",
    date: "2024-08-03",
    time: "09:00 AM",
    headCount: 10,
    hours: 3
  },
  {
    shopType: "Department Store",
    city: "Tokyo",
    productType: "Electronics",
    date: "2024-08-04",
    time: "02:00 PM",
    headCount: 6,
    hours: 4,
    remarks: "Tech Expo"
  },
  {
    shopType: "Flea Market",
    city: "Berlin",
    productType: "Antiques",
    date: "2024-08-05",
    time: "01:00 PM",
    headCount: 8,
    hours: 5,
    remarks: "Monthly Market"
  },
  {
    shopType: "Bookstore",
    city: "San Francisco",
    productType: "Books",
    date: "2024-08-06",
    time: "10:30 AM",
    headCount: 2,
    hours: 1,
    remarks: "Author Signing Event"
  },
  {
    shopType: "Gift Shop",
    city: "Sydney",
    productType: "Souvenirs",
    date: "2024-08-07",
    time: "03:00 PM",
    headCount: 4,
    hours: 1,
    remarks: "Tourist season"
  },
  {
    shopType: "Pharmacy",
    city: "Toronto",
    productType: "Medicines",
    date: "2024-08-08",
    time: "09:30 AM",
    headCount: 3,
    hours: 2,
    remarks: "Health Camp"
  },
  {
    shopType: "Jewelry Store",
    city: "Dubai",
    productType: "Jewelry",
    date: "2024-08-09",
    time: "11:00 AM",
    headCount: 2,
    hours: 3,
    remarks: "Gold Fest"
  },
  {
    shopType: "Bakery",
    city: "Rome",
    productType: "Pastries",
    date: "2024-08-10",
    time: "08:00 AM",
    headCount: 6,
    hours: 1,
    remarks: "Morning Specials"
  }
]


export const hotelsMockData: Hotel[] = [
  {
    hotelName: "The Plaza",
    quantity: 2,
    roomCount: 4,
    checkInDate: "2024-08-01",
    checkInTime: "03:00 PM",
    checkOutDate: "2024-08-05",
    checkOutTime: "11:00 AM",
    roomType: "Suite",
    basis: "Bed and Breakfast",
    remarks: "Include spa access"
  },
  {
    hotelName: "Grand Hyatt",
    quantity: 1,
    roomCount: 2,
    checkInDate: "2024-08-02",
    checkInTime: "02:00 PM",
    checkOutDate: "2024-08-06",
    checkOutTime: "12:00 PM",
    roomType: "Deluxe",
    basis: "Half Board",
    remarks: "Sea view room"
  },
  {
    hotelName: "Hilton Garden Inn",
    quantity: 3,
    roomCount: 6,
    checkInDate: "2024-08-03",
    checkInTime: "04:00 PM",
    checkOutDate: "2024-08-07",
    checkOutTime: "10:00 AM",
    roomType: "Standard",
    basis: "Full Board"
  },
  {
    hotelName: "Marriott Marquis",
    quantity: 2,
    roomCount: 4,
    checkInDate: "2024-08-04",
    checkInTime: "01:00 PM",
    checkOutDate: "2024-08-08",
    checkOutTime: "11:30 AM",
    roomType: "Executive",
    basis: "All Inclusive",
    remarks: "Free airport shuttle"
  },
  {
    hotelName: "Ritz-Carlton",
    quantity: 1,
    roomCount: 1,
    checkInDate: "2024-08-05",
    checkInTime: "12:00 PM",
    checkOutDate: "2024-08-09",
    checkOutTime: "12:00 PM",
    roomType: "Presidential Suite",
    basis: "Bed and Breakfast",
    remarks: "Private butler service"
  },
  {
    hotelName: "Sheraton",
    quantity: 4,
    roomCount: 8,
    checkInDate: "2024-08-06",
    checkInTime: "03:30 PM",
    checkOutDate: "2024-08-10",
    checkOutTime: "11:00 AM",
    roomType: "Family Room",
    basis: "Half Board",
    remarks: "Adjoining rooms"
  },
  {
    hotelName: "Holiday Inn",
    quantity: 2,
    roomCount: 2,
    checkInDate: "2024-08-07",
    checkInTime: "02:30 PM",
    checkOutDate: "2024-08-11",
    checkOutTime: "10:00 AM",
    roomType: "Double",
    basis: "Full Board",
    remarks: "Late check-out"
  },
  {
    hotelName: "Four Seasons",
    quantity: 1,
    roomCount: 1,
    checkInDate: "2024-08-08",
    checkInTime: "01:30 PM",
    checkOutDate: "2024-08-12",
    checkOutTime: "11:00 AM",
    roomType: "King Suite",
    basis: "All Inclusive",
    remarks: "Ocean view"
  },
  {
    hotelName: "InterContinental",
    quantity: 3,
    roomCount: 3,
    checkInDate: "2024-08-09",
    checkInTime: "04:00 PM",
    checkOutDate: "2024-08-13",
    checkOutTime: "10:30 AM",
    roomType: "Twin",
    basis: "Bed and Breakfast"
  },
  {
    hotelName: "Westin",
    quantity: 1,
    roomCount: 2,
    checkInDate: "2024-08-10",
    checkInTime: "02:00 PM",
    checkOutDate: "2024-08-14",
    checkOutTime: "12:00 PM",
    roomType: "Single",
    basis: "Half Board",
    remarks: "Complimentary breakfast"
  }
]