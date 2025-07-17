export default function Footer() {
    return (
      <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Coord.Travel. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6 text-[13px]">
            <a href="/terms-and-conditions" className="hover:underline">Terms & Conditions</a>
            <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
            <a href="/refund-policy" className="hover:underline">Refund Policy</a>
          </div>
        </div>
      </footer>
    )
  }
  
  