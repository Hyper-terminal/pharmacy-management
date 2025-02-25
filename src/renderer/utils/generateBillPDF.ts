import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface BillPDFData {
  billNo: string;
  date: string;
  customerDetails: {
    name: string;
    phone: string;
  };
  doctorDetails: {
    name: string;
    phone: string;
    registration: string;
  };
  items: Array<{
    name: string;
    batchCode: string;
    quantity: number;
    price: number;
    discount: number;
    finalPrice: number;
  }>;
  totalAmount: number;
  pharmacyDetails: {
    name: string;
    address: string;
    phone: string;
    license: string;
    gstin: string;
    registration: string;
  };
}

export const generateBillPDF = async (data: BillPDFData): Promise<Blob> => {
  // Create hidden container for PDF generation
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.className = 'p-8 bg-white';
  document.body.appendChild(container);

  // Generate HTML template
  container.innerHTML = `
    <div class="w-[210mm] min-h-[297mm] p-12 font-sans bg-white">
      <!-- Header -->
      <header class="mb-8 border-b-2 border-blue-800 pb-6">
        <div class="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 class="text-3xl font-bold text-blue-800 tracking-tight">${data.pharmacyDetails.name}</h1>
            <div class="mt-2 space-y-1">
              <p class="text-gray-800 text-sm">${data.pharmacyDetails.address}</p>
              <div class="flex gap-2 text-xs text-gray-600">
                <span>📞 ${data.pharmacyDetails.phone}</span>
                <span>|</span>
                <span>🖂 ${data.pharmacyDetails.license}</span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <h2 class="text-2xl font-bold text-blue-800 mb-2">TAX INVOICE</h2>
            <div class="space-y-1 text-sm text-gray-700">
              <p class="font-medium">Invoice #: ${data.billNo}</p>
              <p>Date: ${data.date}</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Customer/Doctor Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">BILL TO</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="font-medium text-gray-900">${data.customerDetails.name}</p>
            <p class="text-sm text-gray-600">📱 ${data.customerDetails.phone}</p>
          </div>
        </div>
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">REFERRED BY</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="font-medium text-gray-900">${data.doctorDetails.name}</p>
            <p class="text-sm text-gray-600">
              📱 ${data.doctorDetails.phone} | Reg: ${data.doctorDetails.registration}
            </p>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <table class="w-full mb-8">
        <thead class="bg-blue-50">
          <tr>
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">#</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Medicine</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Batch</th>
            <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">Qty</th>
            <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
            <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">Disc%</th>
            <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${data.items
            .map(
              (item, index) => `
            <tr class="${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">
              <td class="py-3 px-4 text-sm text-gray-700">${index + 1}.</td>
              <td class="py-3 px-4 text-sm text-gray-900 font-medium">${item.name.substring(0, 40)}${item.name.length > 40 ? '...' : ''}</td>
              <td class="py-3 px-4 text-sm text-gray-600">${item.batchCode}</td>
              <td class="py-3 px-4 text-sm text-right text-gray-700">${item.quantity}</td>
              <td class="py-3 px-4 text-sm text-right text-gray-700">₹${item.price.toFixed(2)}</td>
              <td class="py-3 px-4 text-sm text-right text-gray-700">${item.discount}%</td>
              <td class="py-3 px-4 text-sm text-right font-semibold text-blue-800">₹${item.finalPrice.toFixed(2)}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>

      <!-- Totals -->
      <div class="ml-auto w-full md:w-96">
        ${[
          { label: 'Subtotal:', value: data.totalAmount },
          { label: 'CGST (9%):', value: data.totalAmount * 0.09 },
          { label: 'SGST (9%):', value: data.totalAmount * 0.09 },
          { label: 'Grand Total:', value: data.totalAmount * 1.18 },
        ]
          .map(
            (total, index) => `
          <div class="flex justify-between items-center py-2 ${index === 3 ? 'border-t-2 border-blue-800 pt-3' : ''}">
            <span class="text-sm ${index === 3 ? 'font-bold text-gray-900' : 'text-gray-700'}">${total.label}</span>
            <span class="text-sm ${index === 3 ? 'font-bold text-blue-800' : 'text-gray-900'}">
              ₹${total.value.toFixed(2)}
            </span>
          </div>
        `,
          )
          .join('')}
      </div>

      <!-- Footer -->
      <footer class="mt-12 pt-6 border-t-2 border-gray-200 text-xs text-gray-600">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold mb-2 text-gray-800">Terms & Conditions:</h4>
            <ul class="list-disc list-inside space-y-1">
              <li>Goods once sold are not returnable</li>
              <li>Subject to jurisdiction of local courts</li>
              <li>E. & O.E.</li>
            </ul>
          </div>
          <div class="text-center md:text-right">
            <p class="font-semibold text-blue-800 mb-3">Authorized Signatory</p>
            <div class="mt-4 border-t-2 border-blue-800 w-32 mx-auto md:ml-auto"></div>
          </div>
        </div>
        <div class="mt-6 text-center text-gray-500">
          <p>${data.pharmacyDetails.name} | GSTIN: ${data.pharmacyDetails.gstin}</p>
          <p>Thank you for your patronage!</p>
        </div>
      </footer>
    </div>
  `;

  // Convert to PDF
  const canvas = await html2canvas(container);
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgData = canvas.toDataURL('image/png');

  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  document.body.removeChild(container);

  return pdf.output('blob');
};
