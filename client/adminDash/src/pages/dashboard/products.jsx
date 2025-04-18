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
  Avatar,
  Spinner,
  Alert,
  Switch,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    status: true,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/getAllProducts"
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch products");
        setProducts(data.products);
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to export products to PDF
  const exportToPDF = async () => {
    setLoading(true);
    try {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(20);
      doc.setTextColor(24, 24, 24); // #181818
      doc.text("Products Report", 105, 15, { align: "center" });

      // Prepare data for the table
      const tableData = await Promise.all(
        products.map(async (product) => {
          // Convert image to data URL
          let imgData = "";
          try {
            const response = await fetch(
              `http://localhost:5000/${product.image}`
            );
            const blob = await response.blob();
            imgData = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });
          } catch (error) {
            console.error("Error loading image:", error);
          }

          return [
            { content: product.name, styles: { fontStyle: "bold" } },
            product.description.substring(0, 50) + "...",
            `$${product.price}`,
            product.stock,
            product.status === "active" ? "Active" : "Inactive",
            { content: "", styles: { cellWidth: 20 } }, // Placeholder for image
          ];
        })
      );

      // Create the table
      autoTable(doc, {
        head: [
          ["Product Name", "Description", "Price", "Stock", "Status", "Image"],
        ],
        body: tableData,
        startY: 25,
        styles: { fontSize: 9 },
        headStyles: {
          fillColor: [24, 24, 24], // #181818
          textColor: [255, 255, 255], // #FFFFFF
        },
        alternateRowStyles: {
          fillColor: [240, 187, 120, 0.1], // #F0BB78 with opacity
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 60 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 30 },
        },
        didDrawCell: async (data) => {
          // Add images to the last column
          if (data.column.index === 5 && data.row.index >= 0) {
            const product = products[data.row.index];
            if (product.image) {
              try {
                const response = await fetch(
                  `http://localhost:5000/${product.image}`
                );
                const blob = await response.blob();
                const imgData = await new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result);
                  reader.readAsDataURL(blob);
                });

                const imgProps = doc.getImageProperties(imgData);
                const width = 20;
                const height = (imgProps.height * width) / imgProps.width;

                doc.addImage(
                  imgData,
                  "JPEG",
                  data.cell.x + 5,
                  data.cell.y + 2,
                  width,
                  height
                );
              } catch (error) {
                console.error("Error adding image to PDF:", error);
              }
            }
          }
        },
      });

      // Save the PDF
      doc.save("products_report.pdf");
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to export PDF");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete product
  const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products-delete/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete product");

      setProducts(products.filter((product) => product.id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle edit button click
  const handleEditClick = (product) => {
    setEditingProduct(product.id);
    setEditFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      status: product.status === "active",
      image: product.image,
    });
    setImagePreview(product.image);
  };

  // Handle edit form input changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Handle status toggle
  const handleStatusToggle = () => {
    setEditFormData({
      ...editFormData,
      status: !editFormData.status,
    });
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData({
        ...editFormData,
        image: file,
      });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async (productId) => {
    try {
      const formData = new FormData();
      formData.append("name", editFormData.name);
      formData.append("description", editFormData.description);
      formData.append("price", editFormData.price);
      formData.append("stock", editFormData.stock);
      formData.append("status", editFormData.status ? "active" : "inactive");

      if (editFormData.image instanceof File) {
        formData.append("image", editFormData.image);
      }

      const response = await fetch(
        `http://localhost:5000/api/update-products/${productId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update product");

      setProducts(
        products.map((product) =>
          product.id === productId ? data.product : product
        )
      );
      setEditingProduct(null);
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  // View product details
  const viewProductDetails = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-12 w-12 text-[#F0BB78]" />
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
      <Card className="mb-8 bg-white shadow-lg">
        <CardHeader className="mb-8 p-6 bg-[#181818]">
          <div className="flex justify-between items-center">
            <Typography variant="h6" className="text-white">
              Products Management
            </Typography>
            <Button
              className="bg-[#F0BB78] text-[#181818] hover:bg-[#F0BB78]/90 flex items-center gap-2"
              onClick={exportToPDF}
              disabled={loading}
            >
              {loading ? (
                <Spinner className="h-4 w-4 text-[#181818]" />
              ) : (
                "Export to PDF"
              )}
            </Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Product",
                  "Description",
                  "Price",
                  "Stock",
                  "Status",
                  "Actions",
                ].map((el) => (
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
              {products.map((product, index) => {
                const className = `py-3 px-5 border-b border-[#F0BB78]/10`;

                return (
                  <tr
                    key={product.id}
                    className={index % 2 === 0 ? "bg-[#F0BB78]/5" : ""}
                  >
                    <td className={className}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={`http://localhost:5000/${product.image}`}
                          alt={product.name}
                          size="sm"
                          variant="rounded"
                          className="border border-[#F0BB78]/20"
                        />
                        <div>
                          <Typography
                            variant="small"
                            className="font-medium text-[#181818]"
                          >
                            {product.name}
                          </Typography>
                          <Typography
                            variant="small"
                            className="text-[#181818]/60"
                          >
                            ID: #{product.id}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        className="font-medium text-[#181818]"
                      >
                        {product.description.substring(0, 50)}...
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        className="font-medium text-[#181818]"
                      >
                        ${product.price}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        className="font-medium text-[#181818]"
                      >
                        {product.stock}
                      </Typography>
                    </td>
                    <td className={className}>
                      {editingProduct === product.id ? (
                        <Switch
                          color="amber"
                          checked={editFormData.status}
                          onChange={handleStatusToggle}
                          label={
                            <div>
                              <Typography className="font-medium text-[#181818]">
                                {editFormData.status ? "Active" : "Inactive"}
                              </Typography>
                            </div>
                          }
                          className="checked:bg-[#F0BB78]"
                        />
                      ) : (
                        <Switch
                          color="amber"
                          checked={product.status === "active"}
                          readOnly
                          label={
                            <div>
                              <Typography className="font-medium text-[#181818]">
                                {product.status === "active"
                                  ? "Active"
                                  : "Inactive"}
                              </Typography>
                            </div>
                          }
                          className="checked:bg-[#F0BB78]"
                        />
                      )}
                    </td>
                    <td className={className}>
                      <div className="flex gap-2">
                        <Tooltip content="View Details">
                          <IconButton
                            variant="text"
                            className="text-[#181818] hover:bg-[#F0BB78]/10"
                            onClick={() => viewProductDetails(product)}
                          >
                            <EyeIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        {editingProduct === product.id ? (
                          <>
                            <Tooltip content="Save">
                              <IconButton
                                variant="text"
                                className="text-[#F0BB78] hover:bg-[#F0BB78]/10"
                                onClick={() => handleEditSubmit(product.id)}
                              >
                                <CheckIcon className="h-5 w-5" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="Cancel">
                              <IconButton
                                variant="text"
                                className="text-red-500 hover:bg-red-500/10"
                                onClick={handleCancelEdit}
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <Tooltip content="Edit">
                              <IconButton
                                variant="text"
                                className="text-[#F0BB78] hover:bg-[#F0BB78]/10"
                                onClick={() => handleEditClick(product)}
                              >
                                <PencilIcon className="h-5 w-5" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="Delete">
                              <IconButton
                                variant="text"
                                className="text-red-500 hover:bg-red-500/10"
                                onClick={() => handleDelete(product.id)}
                              >
                                <TrashIcon className="h-5 w-5" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Product Details Dialog */}
      <Dialog open={openDialog} handler={() => setOpenDialog(false)} size="lg">
        <DialogHeader className="bg-[#181818] text-white">
          Product Details #{selectedProduct?.id}
        </DialogHeader>
        <DialogBody divider className="bg-white">
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <Avatar
                    src={`http://localhost:5000/${selectedProduct.image}`}
                    alt={selectedProduct.name}
                    size="xxl"
                    variant="rounded"
                    className="border border-[#F0BB78]/20"
                  />
                </div>
                <Typography variant="h6" className="mb-2 text-[#181818]">
                  {selectedProduct.name}
                </Typography>
                <Typography className="mb-4 text-[#181818]">
                  {selectedProduct.description}
                </Typography>
              </div>
              <div>
                <div className="space-y-4">
                  <div>
                    <Typography
                      variant="small"
                      className="font-bold text-[#181818]"
                    >
                      Price
                    </Typography>
                    <Typography className="text-[#181818]">
                      ${selectedProduct.price}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      className="font-bold text-[#181818]"
                    >
                      Stock
                    </Typography>
                    <Typography className="text-[#181818]">
                      {selectedProduct.stock}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      className="font-bold text-[#181818]"
                    >
                      Status
                    </Typography>
                    <Switch
                      color="amber"
                      checked={selectedProduct.status === "active"}
                      readOnly
                      label={
                        <Typography className="font-medium text-[#181818]">
                          {selectedProduct.status === "active"
                            ? "Active"
                            : "Inactive"}
                        </Typography>
                      }
                      className="checked:bg-[#F0BB78]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter className="bg-white">
          <Button
            variant="text"
            className="text-red-500 hover:bg-red-500/10 mr-1"
            onClick={() => setOpenDialog(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit Form Dialog */}
      {editingProduct && (
        <Dialog open={!!editingProduct} handler={handleCancelEdit} size="xl">
          <DialogHeader className="bg-[#181818] text-white">
            Edit Product #{editingProduct}
          </DialogHeader>
          <DialogBody divider className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <Typography variant="small" className="mb-2 text-[#181818]">
                    Product Image
                  </Typography>
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={
                        imagePreview?.startsWith("blob:")
                          ? imagePreview
                          : `http://localhost:5000/${imagePreview}`
                      }
                      alt="Product"
                      size="xxl"
                      variant="rounded"
                      className="border border-[#F0BB78]/20"
                    />
                    <label className="cursor-pointer">
                      <Button
                        variant="outlined"
                        className="flex items-center gap-2 text-[#181818] border-[#F0BB78] hover:bg-[#F0BB78]/10"
                      >
                        <ArrowUpTrayIcon className="h-4 w-4" />
                        Upload New Image
                      </Button>
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-4">
                  <Input
                    label="Product Name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                    className="!border-[#F0BB78]/50 focus:!border-[#F0BB78]"
                    labelProps={{
                      className: "text-[#181818]",
                    }}
                  />
                  <Textarea
                    label="Description"
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditFormChange}
                    className="!border-[#F0BB78]/50 focus:!border-[#F0BB78]"
                    labelProps={{
                      className: "text-[#181818]",
                    }}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      label="Price"
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditFormChange}
                      className="!border-[#F0BB78]/50 focus:!border-[#F0BB78]"
                      labelProps={{
                        className: "text-[#181818]",
                      }}
                    />
                    <Input
                      type="number"
                      label="Stock"
                      name="stock"
                      value={editFormData.stock}
                      onChange={handleEditFormChange}
                      className="!border-[#F0BB78]/50 focus:!border-[#F0BB78]"
                      labelProps={{
                        className: "text-[#181818]",
                      }}
                    />
                  </div>
                  <Switch
                    color="amber"
                    checked={editFormData.status}
                    onChange={handleStatusToggle}
                    label={
                      <Typography className="font-medium text-[#181818]">
                        {editFormData.status ? "Active" : "Inactive"}
                      </Typography>
                    }
                    className="checked:bg-[#F0BB78]"
                  />
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="bg-white">
            <Button
              variant="text"
              className="text-red-500 hover:bg-red-500/10 mr-1"
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#F0BB78] text-[#181818] hover:bg-[#F0BB78]/90"
              onClick={() => handleEditSubmit(editingProduct)}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
};

export default Products;
