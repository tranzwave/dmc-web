import Footer from "~/components/footer/footer";
import { Navbar } from "~/components/navbar/navBar";

export default function RefundPolicy() {
  return (
    <div className="flex flex-col min-h-screen overflow-y-auto">
      <Navbar />
      <div className="flex flex-col max-h-[77vh] w-screen mt-24 overflow-y-scroll">
      <main className="flex-grow container mx-auto py-4">
        <h1 className="text-3xl font-bold mb-6 text-[#287f71]">Refund Policy</h1>
        <div className="space-y-6">
          <section>
            <p>
              At Coord.Travel, we value customer satisfaction and strive to provide the best service experience.
              This Refund Policy outlines the conditions under which refunds are processed for our subscription-based services.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Subscription Cancellations</h2>
            <p>
              Our subscription plans are billed on a recurring basis. You may cancel your subscription at any time, but refunds are only issued under the following conditions:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>If you cancel within 3 days of your initial subscription purchase, you may be eligible for a full refund.</li>
              <li>Refunds are not available for renewal payments unless required by applicable law.</li>
              <li>To request a refund, please contact our support team with your account details and reason for cancellation.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Refund Process</h2>
            <p>
              If your refund request is approved, the amount will be credited to your original payment method within 14 business days.
              Please note that processing times may vary depending on your payment provider.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Non-Refundable Items</h2>
            <p>
              The following services are non-refundable:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>One-time setup fees.</li>
              <li>Custom development or integration services.</li>
              <li>Partial usage of a subscription period.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Service Issues</h2>
            <p>
              If you experience any technical issues or disruptions with our service, please reach out to our support team.
              We will work with you to resolve the issue, and if necessary, a refund may be issued based on our assessment.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
            <p>
              If you have any questions or concerns regarding our Refund Policy, please contact our customer support team.
              We are here to assist you and ensure you have a smooth experience with our platform.
            </p>
          </section>
        </div>
      </main>
      </div>
      <Footer />
    </div>
  );
}
