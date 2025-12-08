import jsPDF from "jspdf";

type QuotePDFData = {
  title: string;
  total: number;
  breakdown: Array<{ item: string; price: number }>;
  delivery: string;
  pages: number;
};

export function generateQuotePDF(data: QuotePDFData) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Instant Web Quote", 20, 20);
  doc.setFontSize(12);
  doc.text(`Project: ${data.title}`, 20, 32);
  doc.text(`Pages: ${data.pages}`, 20, 40);
  if (data.delivery) doc.text(`Delivery: ${data.delivery}`, 20, 48);
  doc.text("Breakdown:", 20, 62);
  let y = 70;
  data.breakdown.forEach(b => {
    doc.text(b.item, 20, y);
    doc.text(`$${b.price}`, 160, y, { align: "right" });
    y += 8;
  });
  doc.line(20, y + 2, 190, y + 2);
  doc.setFontSize(16);
  doc.text(`Total: $${data.total}`, 20, y + 14);
  doc.save("quote.pdf");
}

