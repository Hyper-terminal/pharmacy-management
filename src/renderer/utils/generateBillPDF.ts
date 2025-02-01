import { jsPDF } from 'jspdf';

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
}

export const generateBillPDF = async (data: BillPDFData): Promise<Blob> => {
  const doc = new jsPDF();

  // Helper function to add text with proper encoding
  const addText = (text: string, x: number, y: number, options?: any) => {
    doc.text(text, x, y, options);
  };

  // Add letterhead
  doc.setFontSize(20);
  addText('PHARMACY BILL', doc.internal.pageSize.width/2, 20, { align: 'center' });

  // Add bill details
  doc.setFontSize(10);
  addText(`Bill No: ${data.billNo}`, 160, 30);
  addText(`Date: ${data.date}`, 160, 35);

  // Add customer details
  doc.setFontSize(12);
  addText('Customer Details:', 20, 45);
  doc.setFontSize(10);
  addText(`Name: ${data.customerDetails.name}`, 20, 52);
  addText(`Phone: ${data.customerDetails.phone}`, 20, 57);

  // Add doctor details
  doc.setFontSize(12);
  addText('Doctor Details:', 20, 67);
  doc.setFontSize(10);
  addText(`Name: ${data.doctorDetails.name}`, 20, 74);
  addText(`Phone: ${data.doctorDetails.phone}`, 20, 79);
  addText(`Registration: ${data.doctorDetails.registration}`, 20, 84);

  // Add table headers
  const tableTop = 100;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  addText('Code', 20, tableTop);
  addText('Description', 45, tableTop);
  addText('Qty', 120, tableTop);
  addText('Price', 140, tableTop);
  addText('Disc%', 160, tableTop);
  addText('Amount', 180, tableTop);

  // Add table content
  doc.setFont('helvetica', 'normal');
  let y = tableTop + 10;
  data.items.forEach((item) => {
    if (y > 270) { // Check if we need a new page
      doc.addPage();
      y = 20;
    }

    addText(item.batchCode, 20, y);
    addText(item.name.substring(0, 30), 45, y);
    addText(item.quantity.toString(), 120, y);
    addText(`₹${item.price.toFixed(2)}`, 140, y);
    addText(`${item.discount}%`, 160, y);
    addText(`₹${item.finalPrice.toFixed(2)}`, 180, y);

    y += 10;
  });

  // Add total
  y += 10;
  doc.setFont('helvetica', 'bold');
  addText('Total Amount:', 140, y);
  addText(`₹${data.totalAmount.toFixed(2)}`, 180, y);

  // Add footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  addText('Thank you for your business!', doc.internal.pageSize.width/2, 280, { align: 'center' });

  // Return as blob
  return doc.output('blob');
};
