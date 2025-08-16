import {Footer} from "~/components/footer/footer";
import { Navbar } from "~/components/navbar/navBar";

export default function TermsAndConditions() {
  return (
    <div className="flex flex-col h-auto">
      <Navbar />
      <div className="flex flex-col w-full mt-24 overflow-y-scroll">
      <main className="flex-grow container mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold mb-6 text-[#287f71]">Terms and Conditions</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Coord.Travel, you agree to comply with and be bound by these Terms and Conditions.
              If you do not agree with any part of these terms, you may not use the service.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">2. Subscription and Payment</h2>
            <p>
              Our platform operates on a subscription-based model. By subscribing, you agree to pay all applicable fees associated with your chosen plan.
              Failure to process payments may result in suspension or termination of access to the platform.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">3. Use License</h2>
            <p>
              Subject to your compliance with these terms, we grant you a non-exclusive, non-transferable, and revocable license to use our platform
              for managing DMC operations. Any misuse, resale, or unauthorized distribution of our software is strictly prohibited.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">4. Data and Privacy</h2>
            <p>
              You retain ownership of all business data entered into the system. However, we may collect anonymized usage data for improving our services.
              We implement appropriate security measures to protect your data but do not guarantee complete security.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">5. Service Availability</h2>
            <p>
              We strive to maintain uptime and ensure seamless service. However, we do not guarantee uninterrupted availability.
              Downtime due to maintenance, unforeseen technical issues, or third-party service disruptions may occur.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">6. Disclaimer</h2>
            <p>
              Our platform is provided "as is" without warranties of any kind. We disclaim all warranties, including but not limited to
              merchantability, fitness for a particular purpose, and non-infringement.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">7. Limitation of Liability</h2>
            <p>
              We shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform,
              including but not limited to loss of data, revenue, or business operations.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">8. Modifications</h2>
            <p>
              We reserve the right to update or modify these Terms and Conditions at any time. Continued use of the platform
              after modifications constitutes acceptance of the updated terms.
            </p>
          </section>
        </div>
      </main>
      </div>
      <Footer />
    </div>
  );
}