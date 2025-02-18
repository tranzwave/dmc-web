import Footer from "~/components/landingPage/footer";
import { Navbar } from "~/components/landingPage/navBar";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col max-h-[77vh] w-screen mt-24 overflow-y-scroll">
      <main className="flex-grow container mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold mb-6 text-[#287f71]">Privacy Policy</h1>
        <div className="space-y-6">
          <section>
            <p>
              At Coord.Travel, we are committed to protecting the privacy and security of our customers' personal information.
              This Privacy Policy outlines how we collect, use, and safeguard your information when you use our services. By using our services,
              you consent to the practices described in this policy.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
            <p>
              When you use our platform, we may collect the following information:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>Business and account information provided during registration, such as company name, email, and contact details.</li>
              <li>Payment and billing information required for subscription processing, securely handled by third-party payment processors.</li>
              <li>Usage data, including IP address, browser type, and device information, collected through cookies and tracking technologies.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Use of Information</h2>
            <p>
              We may use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>To manage accounts, process subscriptions, and facilitate payments.</li>
              <li>To provide customer support and communicate service-related updates.</li>
              <li>To enhance the platform's functionality and optimize user experience.</li>
              <li>To prevent fraud, unauthorized access, and service abuse.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Information Sharing</h2>
            <p>
              We do not sell, trade, or transfer your personal information to third parties, except under these circumstances:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li><strong>Trusted Service Providers:</strong> We may share necessary information with third-party providers assisting in payment processing, hosting, and analytics.</li>
              <li><strong>Legal Compliance:</strong> We may disclose data if required by law or in response to valid legal requests.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information. However, no method of transmission over the internet is entirely secure,
              and we cannot guarantee absolute security.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar technologies to enhance platform usability and analyze user interactions. You can disable cookies in your browser settings,
              though this may affect certain platform features.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Changes to This Privacy Policy</h2>
            <p>
              We reserve the right to update or modify this Privacy Policy at any time. Any changes will be reflected on this page with an updated revision date.
              We encourage you to review this policy periodically.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us through the details provided on our website.
            </p>
          </section>
        </div>
      </main>
      </div>
      <Footer />
    </div>
  );
}
