import React, { ReactElement } from "react";
import ReactDOM from "react-dom/client"; // Import ReactDOM for new root rendering
import { Button } from "~/components/ui/button";

interface VoucherButtonProps {
  voucherComponent: ReactElement; // Accepts any React component
  buttonText?: string;
  title?: string;
}

const VoucherButton: React.FC<VoucherButtonProps> = ({ voucherComponent, buttonText,title }) => {
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
        <title>${title ?? "Download PDF"}</title>
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
          @page {
            size: A4;
            margin: 0;
          }

          @media print {
            body {
              margin: 0;
              padding: 0;
            }
          }

          #footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            color: #374151;
            font-size: 12px;
          }

          #footer-bar {
            width: 100%;
            height: 35px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <div id="footer">
          <div>This is a computer generated document and doesn't require a signature</div>
          <div id="footer-bar"></div>
        </div>
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
    <Button
      onClick={handleDownloadPdf}
      variant={"primaryGreen"}
    >
      {buttonText ?? "Download Voucher as PDF"}
    </Button>
  );
};

export default VoucherButton;
