// lib/api.ts
import { Booking } from "~/components/bookings/home/columns";

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
