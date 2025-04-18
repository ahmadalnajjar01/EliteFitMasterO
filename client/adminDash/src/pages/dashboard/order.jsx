import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Avatar,
  Spinner,
  Alert,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  XCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentEditingOrder, setCurrentEditingOrder] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    color: "green",
  });

  const statusOptions = [
    { value: "pending", label: "Pending", icon: ClockIcon, color: "amber" },
    {
      value: "preparing",
      label: "Preparing",
      icon: ArrowPathIcon,
      color: "blue",
    },
    { value: "shipped", label: "Shipped", icon: TruckIcon, color: "indigo" },
    {
      value: "delivered",
      label: "Delivered",
      icon: CheckCircleIcon,
      color: "green",
    },
    { value: "cancelled", label: "Cancelled", icon: XCircleIcon, color: "red" },
  ];

  // Function to export orders to PDF
  const exportToPDF = () => {
    setLoading(true);
    try {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(20);
      doc.text("Orders Report", 105, 15, { align: "center" });

      // Prepare data for the table
      const tableData = orders.map((order) => {
        const statusInfo = statusOptions.find(
          (opt) => opt.value === order.status
        );
        const customerName = order.user
          ? `${order.user.firstName} ${order.user.lastName}`
          : order.shippingName;

        return [
          `#${order.id}`,
          customerName,
          `$${order.total}`,
          statusInfo?.label || order.status,
          new Date(order.createdAt).toLocaleDateString(),
        ];
      });

      // Create the table
      autoTable(doc, {
        head: [["Order ID", "Customer", "Amount", "Status", "Date"]],
        body: tableData,
        startY: 25,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 40 },
          2: { cellWidth: 20 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
        },
      });

      // Save the PDF
      doc.save("orders_report.pdf");
      showNotification("PDF exported successfully", "green");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showNotification("Failed to export PDF", "red");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/orders/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      showNotification("Order status updated successfully!", "green");
      setOpenStatusDialog(false);
    } catch (err) {
      showNotification(err.message, "red");
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOpenOrderDialog(true);
  };

  const openStatusPopup = (order) => {
    setCurrentEditingOrder(order);
    setOpenStatusDialog(true);
  };

  const showNotification = (message, color) => {
    setNotification({
      open: true,
      message,
      color,
    });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const StatusBadge = ({ status }) => {
    const statusInfo = statusOptions.find((opt) => opt.value === status);
    const Icon = statusInfo?.icon || ClockIcon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${statusInfo?.color}-100 text-${statusInfo?.color}-800`}
      >
        <Icon className={`h-4 w-4 mr-1 text-${statusInfo?.color}-500`} />
        {statusInfo?.label || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        icon={<ExclamationTriangleIcon className="h-6 w-6" />}
        color="red"
        className="my-4"
      >
        {error}
      </Alert>
    );
  }

  return (
    <div className="p-4">
      <Card className="mb-8">
        <CardHeader
          variant="gradient"
          className="mb-8 p-6 bg-[#181818]"
        >
          <div className="flex justify-between items-center">
            <Typography variant="h6" color="white">
              Order Management
            </Typography>
            <Button
              variant="gradient"
              color="white"
              onClick={exportToPDF}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? <Spinner className="h-4 w-4" /> : <>Export to PDF</>}
            </Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Order ID",
                  "Customer",
                  "Amount",
                  "Status",
                  "Date",
                  "Actions",
                ].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const className = `py-3 px-5 border-b border-blue-gray-50`;
                const currentStatus = statusOptions.find(
                  (opt) => opt.value === order.status
                );

                return (
                  <tr key={order.id}>
                    <td className={className}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        #{order.id}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            order.user
                              ? `${order.user.firstName} ${order.user.lastName}`
                              : order.shippingName
                          )}&background=random`}
                          alt={
                            order.user
                              ? `${order.user.firstName} ${order.user.lastName}`
                              : order.shippingName
                          }
                          size="sm"
                        />
                        <div>
                          <Typography variant="small" className="font-medium">
                            {order.user
                              ? `${order.user.firstName} ${order.user.lastName}`
                              : order.shippingName}
                          </Typography>
                          <Typography
                            variant="small"
                            className="text-blue-gray-500"
                          >
                            {order.user?.email || "Guest order"}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        className="font-medium text-blue-gray-600"
                      >
                        ${order.total}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={order.status} />
                        <Button
                          size="sm"
                          variant="outlined"
                          onClick={() => openStatusPopup(order)}
                          className="flex items-center gap-1"
                        >
                          <span>Change</span>
                        </Button>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        className="font-medium text-blue-gray-600"
                      >
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Tooltip content="View Details">
                        <IconButton
                          variant="text"
                          color="blue-gray"
                          onClick={() => viewOrderDetails(order)}
                        >
                          <EyeIcon className="h-5 w-5" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Order Details Dialog */}
      <Dialog
        open={openOrderDialog}
        handler={() => setOpenOrderDialog(false)}
        size="lg"
      >
        <DialogHeader>Order Details #{selectedOrder?.id}</DialogHeader>
        <DialogBody divider>
          {selectedOrder && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Customer Information
                </Typography>
                <div className="space-y-2">
                  <Typography>
                    <strong>Name:</strong> {selectedOrder.shippingName}
                  </Typography>
                  <Typography>
                    <strong>Address:</strong> {selectedOrder.shippingAddress}
                  </Typography>
                  <Typography>
                    <strong>City:</strong> {selectedOrder.shippingCity}
                  </Typography>
                  <Typography>
                    <strong>State/Zip:</strong> {selectedOrder.shippingState}{" "}
                    {selectedOrder.shippingPostalCode}
                  </Typography>
                </div>
              </div>

              <div>
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Order Information
                </Typography>
                <div className="space-y-2">
                  <Typography>
                    <strong>Status:</strong>{" "}
                    <StatusBadge status={selectedOrder.status} />
                  </Typography>
                  <Typography>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </Typography>
                  <Typography>
                    <strong>Total:</strong> ${selectedOrder.total}
                  </Typography>
                </div>
              </div>

              <div className="md:col-span-2">
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Products
                </Typography>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 bg-blue-gray-50 text-left">
                          Product ID
                        </th>
                        <th className="py-2 px-4 bg-blue-gray-50 text-left">
                          Size
                        </th>
                        <th className="py-2 px-4 bg-blue-gray-50 text-left">
                          Color
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.productIds.map((id, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "bg-blue-gray-50" : ""}
                        >
                          <td className="py-2 px-4">{id}</td>
                          <td className="py-2 px-4">
                            {selectedOrder.size?.[index] || "-"}
                          </td>
                          <td className="py-2 px-4">
                            {selectedOrder.color?.[index] || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenOrderDialog(false)}
            className="mr-1"
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Status Selection Dialog */}
      <Dialog
        open={openStatusDialog}
        handler={() => setOpenStatusDialog(false)}
        size="sm"
      >
        <DialogHeader>
          Change Status for Order #{currentEditingOrder?.id}
        </DialogHeader>
        <DialogBody divider>
          <List>
            {statusOptions.map(({ value, label, icon: Icon, color }) => (
              <ListItem
                key={value}
                onClick={() => updateOrderStatus(currentEditingOrder.id, value)}
                className="hover:bg-blue-gray-50"
              >
                <ListItemPrefix>
                  <Icon className={`h-5 w-5 text-${color}-500`} />
                </ListItemPrefix>
                {label}
                {currentEditingOrder?.status === value && (
                  <span className="ml-auto">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </span>
                )}
              </ListItem>
            ))}
          </List>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenStatusDialog(false)}
            className="mr-1"
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Notification */}
      {notification.open && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert
            open={notification.open}
            color={notification.color}
            icon={
              notification.color === "green" ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                <ExclamationTriangleIcon className="h-5 w-5" />
              )
            }
            animate={{
              mount: { y: 0 },
              unmount: { y: 100 },
            }}
          >
            {notification.message}
          </Alert>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
