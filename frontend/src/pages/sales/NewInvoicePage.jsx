import React, { useState } from "react";
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

  const generatePDF = () => {
    const doc = new jsPDF();

    // Set Company Details (Placeholder from screenshot)
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Kayaa Electronics Pvt Ltd", 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Tamil Nadu, India", 14, 28);
    doc.text("91-9003065660", 14, 33);
    doc.text("vimal@gmail.com", 14, 38);

    doc.setFontSize(22);
    doc.setTextColor(0);
    doc.text("TAX INVOICE", 140, 30);

    // Invoice Info Box
    doc.setFontSize(10);
    const tableFunc = autoTable.default || autoTable;
    tableFunc(doc, {
      startY: 50,
      body: [
        ["Invoice#:", formData.invoiceNumber],
        ["Invoice Date:", formData.invoiceDate],
        ["Due Date:", formData.dueDate],
      ],
      theme: "plain",
      styles: { cellPadding: 1, fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold", width: 30 } },
      margin: { left: 140 },
    });

    // Bill To Section
    doc.text("Bill To", 14, 55);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(formData.customerName || "Customer Name", 14, 62);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Items Table
    const tableColumn = ["#", "Item & Description", "Qty", "Rate", "Amount"];
    const tableRows = formData.items.map((item, index) => [
      index + 1,
      item.details,
      item.quantity,
      Number(item.rate || 0).toFixed(2),
      Number(item.amount || 0).toFixed(2),
    ]);

    tableFunc(doc, {
      startY: 80,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
    });

    // Totals Section
    const finalY = doc.lastAutoTable.finalY + 10;
    tableFunc(doc, {
      startY: finalY,
      body: [
        ["Sub Total", `INR ${Number(subTotal).toFixed(2)}`],
        [
          `${formData.taxType} (${formData.taxRate}%)`,
          `(-) INR ${Number(taxAmount).toFixed(2)}`,
        ],
        ["Adjustment", `INR ${Number(formData.adjustment || 0).toFixed(2)}`],
        ["Total", `INR ${Number(total).toFixed(2)}`],
      ],
      theme: "plain",
      styles: { halign: "right", fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold", width: 40 } },
      margin: { left: 130 },
    });

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
              <option value="Customer A">Customer A</option>
              <option value="Customer B">Customer B</option>
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
