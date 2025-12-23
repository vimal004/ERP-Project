import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import {
  MD3Input,
  MD3Select,
  MD3Textarea,
  MD3Button,
  MD3Divider,
  MD3TotalBox,
} from "../../Components/ui/MD3FormComponents";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getAllCustomers } from "../../services/customersService";

const INDIAN_TAX_OPTIONS = [
  { label: "GST (5%)", value: 5 },
  { label: "GST (12%)", value: 12 },
  { label: "GST (18%)", value: 18 },
  { label: "GST (28%)", value: 28 },
  { label: "TDS (1%)", value: 1 },
  { label: "TDS (2%)", value: 2 },
  { label: "TDS (5%)", value: 5 },
  { label: "TDS (10%)", value: 10 },
  { label: "TCS (0.1%)", value: 0.1 },
  { label: "TCS (1%)", value: 1 },
];

/**
 * NewInvoicePage - Material Design 3 (Google Store Aesthetic)
 */
const NewInvoicePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: "",
    invoiceNumber: "INV-000001",
    orderNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    terms: "Due on Receipt",
    dueDate: new Date().toISOString().split("T")[0],
    salesperson: "",
    subject: "",
    items: [{ details: "", quantity: 1, rate: 0, discount: 0, amount: 0 }],
    taxType: "TDS",
    taxRate: 0,
    adjustment: 0,
  });

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getAllCustomers();
        setCustomers(data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };
    fetchCustomers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    const qty = parseFloat(updatedItems[index].quantity) || 0;
    const rate = parseFloat(updatedItems[index].rate) || 0;
    const discount = parseFloat(updatedItems[index].discount) || 0;
    updatedItems[index].amount = qty * rate * (1 - discount / 100);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { details: "", quantity: 1, rate: 0, discount: 0, amount: 0 },
      ],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const subTotal = formData.items.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const taxAmount = (subTotal * (formData.taxRate || 0)) / 100;
  const total = subTotal - taxAmount + (parseFloat(formData.adjustment) || 0);

  // Helper for Number to Words (Indian Format)
  const numberToWords = (num) => {
    const a = [
      "",
      "One ",
      "Two ",
      "Three ",
      "Four ",
      "Five ",
      "Six ",
      "Seven ",
      "Eight ",
      "Nine ",
      "Ten ",
      "Eleven ",
      "Twelve ",
      "Thirteen ",
      "Fourteen ",
      "Fifteen ",
      "Sixteen ",
      "Seventeen ",
      "Eighteen ",
      "Nineteen ",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const inWords = (n) => {
      if ((n = n.toString()).length > 9) return "overflow";
      let n_array = ("000000000" + n)
        .substr(-9)
        .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n_array) return "";
      let str = "";
      str +=
        n_array[1] != 0
          ? (a[Number(n_array[1])] ||
              b[n_array[1][0]] + " " + a[n_array[1][1]]) + "Crore "
          : "";
      str +=
        n_array[2] != 0
          ? (a[Number(n_array[2])] ||
              b[n_array[2][0]] + " " + a[n_array[2][1]]) + "Lakh "
          : "";
      str +=
        n_array[3] != 0
          ? (a[Number(n_array[3])] ||
              b[n_array[3][0]] + " " + a[n_array[3][1]]) + "Thousand "
          : "";
      str +=
        n_array[4] != 0
          ? (a[Number(n_array[4])] ||
              b[n_array[4][0]] + " " + a[n_array[4][1]]) + "Hundred "
          : "";
      str +=
        n_array[5] != 0
          ? (str != "" ? "and " : "") +
            (a[Number(n_array[5])] ||
              b[n_array[5][0]] + " " + a[n_array[5][1]]) +
            "Only"
          : "";
      return str;
    };

    return `Indian Rupee ${inWords(Math.floor(num))}`;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableFunc = autoTable.default || autoTable;

    // --- Header ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Kayaa Electronics Pvt Ltd", 14, 20);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Tamil Nadu", 14, 26);
    doc.text("India", 14, 31);
    doc.text("91-9003065660", 14, 36);
    doc.text("arulmani.g@gmail.com", 14, 41);

    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("TAX INVOICE", 155, 35);

    // Separator line
    doc.setDrawColor(200);
    doc.line(14, 48, 196, 48);

    // --- Invoice Metadata ---
    doc.setFontSize(10);
    doc.setTextColor(0);

    // Metadata Table (Layout)
    tableFunc(doc, {
      startY: 50,
      body: [
        ["#", ": " + formData.invoiceNumber],
        ["Invoice Date", ": " + formData.invoiceDate],
        ["Terms", ": " + formData.terms],
        ["Due Date", ": " + formData.dueDate],
        ["P.O.#", ": " + (formData.orderNumber || "001")],
      ],
      theme: "plain",
      styles: { cellPadding: 1, fontSize: 9 },
      columnStyles: { 0: { fontStyle: "normal", width: 25 } },
      margin: { left: 14 },
    });

    // --- Bill To / Ship To ---
    const midY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Bill To", 14, midY);
    doc.text("Ship To", 100, midY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 136, 229); // Blue for customer name
    doc.text(formData.customerName || "Customer Name", 14, midY + 6);
    doc.text("ferferf", 100, midY + 6); // Mock ship to

    doc.setTextColor(100);
    doc.setFontSize(9);
    doc.text("ferferf", 14, midY + 11);
    doc.text("fff", 14, midY + 16);
    doc.text("Chennai, Tamil Nadu, India", 14, midY + 21);
    doc.text("Tamil Nadu", 14, midY + 26);
    doc.text("Afghanistan", 14, midY + 31);

    doc.text("ferferf", 100, midY + 11);
    doc.text("fff", 100, midY + 16);
    doc.text("Chennai, Tamil Nadu, India", 100, midY + 21);
    doc.text("Tamil Nadu", 100, midY + 26);
    doc.text("Afghanistan", 100, midY + 31);

    // --- Items Table ---
    const tableColumn = ["#", "Item & Description", "Qty", "Rate", "Amount"];
    const tableRows = formData.items.map((item, index) => [
      index + 1,
      item.details,
      Number(item.quantity).toFixed(2),
      Number(item.rate || 0).toFixed(2),
      Number(item.amount || 0).toFixed(2),
    ]);

    tableFunc(doc, {
      startY: midY + 40,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [245, 245, 245],
        textColor: [40, 40, 40],
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
      },
      styles: {
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
        fontSize: 9,
      },
      columnStyles: {
        0: { width: 10 },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
      },
    });

    // --- Financials Summary ---
    const finalY = doc.lastAutoTable.finalY + 10;

    // Total in Words
    doc.setTextColor(0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Total In Words", 14, finalY);
    doc.setFont("helvetica", "italic");
    doc.text(numberToWords(total), 14, finalY + 5);

    // Totals Table
    tableFunc(doc, {
      startY: finalY,
      body: [
        ["Sub Total", Number(subTotal).toFixed(2)],
        ["Total", "INR " + Number(total).toFixed(2)],
        ["Payment Made", "(-) " + Number(total).toFixed(2)],
        ["Balance Due", "INR 0.00"],
      ],
      theme: "plain",
      styles: { halign: "right", fontSize: 9, cellPadding: 1 },
      columnStyles: { 0: { fontStyle: "normal", width: 130 } },
      margin: { left: 14 },
    });

    // Notes
    const notesY = doc.lastAutoTable.finalY + 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Notes", 14, notesY);
    doc.text("Thanks for your business.", 14, notesY + 6);

    doc.save(`${formData.invoiceNumber}.pdf`);
  };

  return (
    <div
      className="p-6 sm:p-8"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/sales/invoices"
            className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
            style={{ color: "#5f6368" }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#e8f0fe" }}
            >
              <DocumentTextIcon
                className="w-5 h-5"
                style={{ color: "#1a73e8" }}
              />
            </div>
            <h1 className="text-2xl font-normal" style={{ color: "#202124" }}>
              New Invoice
            </h1>
          </div>
        </div>
        <Link
          to="/sales/invoices"
          className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
          style={{ color: "#5f6368" }}
        >
          <XMarkIcon className="w-5 h-5" />
        </Link>
      </div>

      {/* Form Container */}
      <div
        className="p-6 sm:p-8 space-y-8"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          boxShadow:
            "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
        }}
      >
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <MD3Select
              label="Customer Name"
              required
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
            >
              <option value="">Select or add a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.displayName}>
                  {customer.displayName}
                </option>
              ))}
            </MD3Select>
            <MD3Input
              label="Invoice#"
              required
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleInputChange}
            />
            <MD3Input
              label="Order Number"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <MD3Input
                label="Invoice Date"
                required
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleInputChange}
              />
              <MD3Input
                label="Due Date"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
              />
            </div>
            <MD3Select
              label="Payment Terms"
              name="terms"
              value={formData.terms}
              onChange={handleInputChange}
            >
              <option value="Due on Receipt">Due on Receipt</option>
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
            </MD3Select>
            <MD3Select
              label="Salesperson"
              name="salesperson"
              value={formData.salesperson}
              onChange={handleInputChange}
            >
              <option value="">Select or Add Salesperson</option>
            </MD3Select>
          </div>
        </div>

        {/* Subject */}
        <MD3Textarea
          label="Subject"
          name="subject"
          placeholder="Let your customer know what this Invoice is for"
          value={formData.subject}
          onChange={handleInputChange}
        />

        <MD3Divider />

        {/* Item Table */}
        <div>
          <h3 className="text-lg font-medium mb-4" style={{ color: "#202124" }}>
            Item Table
          </h3>
          <div
            className="overflow-x-auto"
            style={{ border: "1px solid #e8eaed", borderRadius: "16px" }}
          >
            <table
              className="min-w-full divide-y"
              style={{ borderColor: "#e8eaed" }}
            >
              <thead style={{ backgroundColor: "#f8f9fa" }}>
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/2"
                    style={{ color: "#5f6368" }}
                  >
                    Item Details
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#5f6368" }}
                  >
                    Quantity
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#5f6368" }}
                  >
                    Rate
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#5f6368" }}
                  >
                    Discount (%)
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#5f6368" }}
                  >
                    Amount
                  </th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#e8eaed" }}>
                {formData.items.map((item, index) => (
                  <tr key={index} style={{ backgroundColor: "#ffffff" }}>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="Type or click to select an item."
                        value={item.details}
                        onChange={(e) =>
                          handleItemChange(index, "details", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm focus:outline-none"
                        style={{
                          backgroundColor: "#f8f9fa",
                          border: "none",
                          borderRadius: "6px",
                          color: "#202124",
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm text-right focus:outline-none"
                        style={{
                          backgroundColor: "#f8f9fa",
                          border: "none",
                          borderRadius: "6px",
                          color: "#202124",
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(index, "rate", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm text-right focus:outline-none"
                        style={{
                          backgroundColor: "#f8f9fa",
                          border: "none",
                          borderRadius: "6px",
                          color: "#202124",
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) =>
                          handleItemChange(index, "discount", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm text-right focus:outline-none"
                        style={{
                          backgroundColor: "#f8f9fa",
                          border: "none",
                          borderRadius: "6px",
                          color: "#202124",
                        }}
                      />
                    </td>
                    <td
                      className="px-4 py-3 text-right text-sm font-medium"
                      style={{ color: "#202124" }}
                    >
                      ₹{item.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {formData.items.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="p-1.5 rounded-full transition-all duration-200 hover:bg-red-50"
                          style={{ color: "#d93025" }}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-4 inline-flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: "#e8f0fe",
              color: "#1a73e8",
              borderRadius: "9999px",
            }}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add another line
          </button>

          {/* Total Section */}
          <div className="mt-8">
            <MD3TotalBox
              subTotal={subTotal}
              taxType={formData.taxType}
              setTaxType={(val) =>
                setFormData((prev) => ({ ...prev, taxType: val }))
              }
              taxRate={formData.taxRate}
              setTaxRate={(val) =>
                setFormData((prev) => ({ ...prev, taxRate: val }))
              }
              taxOptions={INDIAN_TAX_OPTIONS}
              adjustment={formData.adjustment}
              setAdjustment={(val) =>
                setFormData((prev) => ({ ...prev, adjustment: val }))
              }
              total={total}
            />
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-8 flex justify-start gap-3 pb-8">
        <MD3Button variant="secondary">Save as Draft</MD3Button>
        <MD3Button onClick={generatePDF}>
          <div className="flex items-center gap-2">
            <ArrowDownTrayIcon className="w-5 h-5" />
            Save and Send
          </div>
        </MD3Button>
        <Link
          to="/sales/invoices"
          className="py-3 px-6 text-sm font-medium transition-all duration-200"
          style={{
            backgroundColor: "transparent",
            color: "#1a73e8",
            borderRadius: "9999px",
          }}
        >
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default NewInvoicePage;
