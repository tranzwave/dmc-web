import { Globe, Users, Calendar, CreditCard, Box, Clock } from "lucide-react";
import { Card } from "../ui/card";

export default function FeaturesSection() {
  const features = [
    {
      icon: Globe,
      title: "Expand Your Market",
      description:
        "Reach travelers worldwide with real-time availability and multi-currency support.",
    },
    {
      icon: Users,
      title: "Effortless Customer Management",
      description:
        "Centralize guest profiles, preferences, and booking history for personalized experiences.",
    },
    {
      icon: Calendar,
      title: "Automated Scheduling",
      description:
        "Optimize bookings and resources with smart calendar syncing and instant confirmations.",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description:
        "Accept payments globally with integrated, secure, and flexible payment options.",
    },
    {
      icon: Box,
      title: "Inventory Control",
      description:
        "Manage your products and tours efficiently with real-time stock and availability tracking.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description:
        "Reliable customer support to assist you and your guests anytime, anywhere.",
    },
  ];

  return (
    <section className="py-20 pt-5 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" id="features">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Platform Your Travel Business Will Love
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Streamline operations, enhance guest experiences, and scale your business with our
            all-in-one travel management solution.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, description }, i) => (
            <Card key={i} className="p-6 flex flex-col items-center text-center bg-white rounded-xl border border-gray-200 shadow-sm transition duration-400 ease-in-out hover:shadow-lg hover:-translate-y-[1px] hover:scale-[1.001] hover:bg-gradient-to-br hover:from-white hover:via-[#e6f6f1]/60 hover:to-white cursor-pointer">
              <Icon className="w-14 h-14 text-[#287f71] mb-5" />
              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
