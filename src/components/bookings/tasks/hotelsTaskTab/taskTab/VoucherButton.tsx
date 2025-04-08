import React, { ReactElement } from "react";
import ReactDOM from "react-dom/client"; // Import ReactDOM for new root rendering
import { Button } from "~/components/ui/button";

interface VoucherButtonProps {
  voucherComponent: ReactElement; // Accepts any React component
  buttonText?: string;
  title?: string;
}

const VoucherButton: React.FC<VoucherButtonProps> = ({ voucherComponent, buttonText, title }) => {
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
            font-size: 13px;
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
            html, body {
              height: 100%;
              margin: 0;
              padding: 0;
            }

            #print-container {
              display: flex;
              flex-direction: column;
              min-height: 100vh;
            }

            #root {
              flex-grow: 1;
            }

            #footer-wrapper {
              page-break-before: avoid;
              page-break-after: avoid;
              page-break-inside: avoid;
            }
          }


        </style>
      </head>
      <body>
        <div id="print-container" class="flex flex-col min-h-screen print:min-h-[100vh]">
          <div id="root" class="flex-grow">
            <!-- Your React component will render here -->
          </div>

          <!-- Footer placed only after the content -->
          <div id="footer-wrapper" class="mt-4 pt-2 border-t text-center text-gray-700 text-[10px] print:mt-12">
            This is a computer generated document and doesn't require a signature
          </div>
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
