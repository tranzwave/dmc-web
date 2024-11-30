import React, { ReactElement } from "react";
import ReactDOM from "react-dom/client"; // Import ReactDOM for new root rendering

interface VoucherButtonProps {
  voucherComponent: ReactElement; // Accepts any React component
}

const VoucherButton: React.FC<VoucherButtonProps> = ({ voucherComponent }) => {
  const handleDownloadPdf = () => {
    const newWindow = window.open("", "_blank");

    if (!newWindow) {
      console.error("Failed to open new tab. Check popup blocker settings.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hotel Voucher</title>
        <script>
          setTimeout(() => window.print(), 500); 
        </script>
        <!-- Link to TailwindCSS CDN -->
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          /* Custom styles */
          body {
            font-family: sans-serif;
          }

          /* Define bg-primary-green color */
          .bg-primary-green {
            background-color: #287f71;
          }

          /* Set the size to A4 (in pixels) */
          .a4-size {
            width: 1000px; /* A4 width in px */
            height: 1123px; /* A4 height in px */
            padding: 5px
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
      </body>
      </html>
    `;

    newWindow.document.write(htmlContent);
    newWindow.document.close();

    // Render the React component after the document is ready
    renderVoucherComponentInNewWindow(newWindow, voucherComponent);
  };

  // This function handles component rendering in the new window
  const renderVoucherComponentInNewWindow = (newWindow: Window, component: ReactElement) => {
    setTimeout(() => {
      const rootElement = newWindow.document.getElementById("root");
      if (rootElement) {
        const root = ReactDOM.createRoot(rootElement); // Create root using the new API
        root.render(component); // Render the component
      }
    }, 0);
  };

  return (
    <button
      onClick={handleDownloadPdf}
      className="px-4 py-2 bg-primary-green text-white rounded-md hover:bg-opacity-80 transition"
    >
      Download Voucher as PDF
    </button>
  );
};

export default VoucherButton;
