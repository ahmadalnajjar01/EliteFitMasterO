import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Button,
} from "@material-tailwind/react";

// Import jsPDF and autoTable correctly
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function Tables() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/customers-users")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCustomers(response.data);
        } else {
          console.error("Expected an array but got:", response.data);
          setCustomers([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
        setCustomers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const exportToPDF = () => {
    // Create new jsPDF instance
    const doc = new jsPDF();

    // Add title
    doc.setTextColor(24, 24, 24); // #181818
    doc.text("Customers List", 14, 15);

    // Prepare data for the table
    const tableData = customers.map((customer) => [
      `${customer.firstName} ${customer.lastName}`,
      customer.email,
      customer.role,
      new Date(customer.createdAt).toLocaleDateString(),
    ]);

    // Generate the table using autoTable
    autoTable(doc, {
      head: [["Name", "Email", "Role", "Created At"]],
      body: tableData,
      startY: 20,
      styles: {
        cellPadding: 2,
        fontSize: 10,
        valign: "middle",
        halign: "left",
      },
      headStyles: {
        fillColor: [24, 24, 24], // #181818
        textColor: [255, 255, 255], // #FFFFFF
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 187, 120, 0.1], // #F0BB78 with opacity
      },
    });

    // Save the PDF
    doc.save("customers-list.pdf");
  };

  if (loading) {
    return <Typography className="text-[#181818]">Loading...</Typography>;
  }

  if (error) {
    return <Typography className="text-red-500">{error}</Typography>;
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card className="bg-white shadow-lg">
        <CardHeader className="mb-8 p-6 flex justify-between items-center bg-[#181818]">
          <Typography variant="h6" className="text-white">
            Customers Table
          </Typography>
          <Button
            className="bg-[#F0BB78] text-[#181818] flex items-center gap-2 hover:bg-[#F0BB78]/90"
            size="sm"
            onClick={exportToPDF}
          >
            Export to PDF
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Name", "Email", "Role", "Created At", ""].map((el) => (
                  <th
                    key={el}
                    className="border-b border-[#F0BB78]/20 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-[#181818]"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map(
                ({ id, firstName, lastName, email, role, createdAt }, key) => {
                  const className = `py-3 px-5 ${
                    key === customers.length - 1
                      ? ""
                      : "border-b border-[#F0BB78]/10"
                  }`;

                  return (
                    <tr
                      key={id}
                      className={key % 2 === 0 ? "bg-[#F0BB78]/5" : ""}
                    >
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              className="font-semibold text-[#181818]"
                            >
                              {`${firstName} ${lastName}`}
                            </Typography>
                            <Typography className="text-xs font-normal text-[#181818]/70">
                              {email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-[#181818]">
                          {email}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={role === "customer" ? "amber" : "gray"}
                          value={role}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit bg-[#F0BB78] text-[#181818]"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-[#181818]">
                          {new Date(createdAt).toLocaleDateString()}
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Tables;
