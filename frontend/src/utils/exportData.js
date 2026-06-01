import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// export products to a PDF file
export const exportProductsToPDF = (products) => {
  const doc = new jsPDF();
  doc.text("Inventory Report", 14, 16);
  autoTable(doc, {
    startY: 22,
    head: [["Name", "Category", "Price", "Quantity", "Value"]],
    body: products.map((p) => [
      p.name,
      p.category,
      p.price,
      p.quantity,
      (Number(p.price) * Number(p.quantity)).toFixed(2),
    ]),
  });
  doc.save("inventory-report.pdf");
};

// export products to an Excel file
export const exportProductsToExcel = (products) => {
  const rows = products.map((p) => ({
    Name: p.name,
    SKU: p.sku,
    Category: p.category,
    Price: p.price,
    Quantity: p.quantity,
    Value: (Number(p.price) * Number(p.quantity)).toFixed(2),
  }));
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
  XLSX.writeFile(workbook, "inventory-report.xlsx");
};
