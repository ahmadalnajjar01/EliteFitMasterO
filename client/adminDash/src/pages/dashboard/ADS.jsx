import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  CardBody,
  CardHeader,
  Tooltip,
  IconButton,
  Spinner,
  Chip,
} from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";

const ADS = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentAd, setCurrentAd] = useState({
    id: "",
    description: "",
    status: "active",
  });

  // Fetch all ads
  const fetchAds = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/ads");
      if (!response.ok) throw new Error("Failed to fetch ads");
      const data = await response.json();
      setAds(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Update ad
  const updateAd = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/ads/${currentAd.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: currentAd.description }),
        }
      );

      if (!response.ok) throw new Error("Failed to update ad");
      fetchAds();
      setOpenEditDialog(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Open edit dialog
  const handleEditClick = (ad) => {
    setCurrentAd(ad);
    setOpenEditDialog(true);
  };

  // Handle input change for edit
  const handleInputChange = (e) => {
    setCurrentAd({ ...currentAd, description: e.target.value });
  };

  useEffect(() => {
    fetchAds();
  }, []);

  if (loading && ads.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Spinner className="h-12 w-12 text-blue-500" />
        <Typography className="mt-4 text-blue-gray-600">
          Loading advertisements...
        </Typography>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50 mb-5">
      <Card className="shadow-lg border border-blue-gray-100">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none bg-white border-b border-blue-gray-100"
        >
          <div className="p-4">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              Advertisement Management
            </Typography>
            <Typography color="blue-gray" className="mt-1 font-normal text-sm">
              View and edit your campaign advertisements
            </Typography>
          </div>
        </CardHeader>

        <CardBody className="overflow-x-auto px-0">
          {error && (
            <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <Typography color="red" className="font-medium">
                Error: {error}
              </Typography>
              <Button
                color="red"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setError(null);
                  fetchAds();
                }}
              >
                Try Again
              </Button>
            </div>
          )}

          {loading && ads.length > 0 && (
            <div className="flex justify-center p-4">
              <Spinner className="h-8 w-8" />
            </div>
          )}

          {!loading && ads.length === 0 ? (
            <div className="text-center p-8">
              <Typography color="blue-gray" className="font-medium">
                No advertisements found
              </Typography>
            </div>
          ) : (
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold leading-none"
                    >
                      ID
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold leading-none"
                    >
                      Description
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold leading-none"
                    >
                      Status
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold leading-none"
                    >
                      Actions
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad, index) => {
                  const isLast = index === ads.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr
                      key={ad.id}
                      className="hover:bg-blue-gray-50/30 transition-colors"
                    >
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium"
                        >
                          {ad.id}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray">
                          {ad.description}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Chip
                          variant="ghost"
                          color={ad.status === "active" ? "green" : "blue-gray"}
                          value={ad.status === "active" ? "Active" : "Inactive"}
                          className="w-min capitalize"
                        />
                      </td>
                      <td className={classes}>
                        <Tooltip content="Edit Ad">
                          <IconButton
                            variant="text"
                            color="blue"
                            onClick={() => handleEditClick(ad)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        handler={() => setOpenEditDialog(false)}
        size="xs"
      >
        <DialogHeader className="border-b border-blue-gray-100">
          Edit Advertisement
        </DialogHeader>
        <DialogBody divider className="py-6">
          <div className="grid gap-6">
            <Input label="Advertisement ID" value={currentAd.id} disabled />
            <Input
              label="Description"
              value={currentAd.description}
              onChange={handleInputChange}
            />
          </div>
        </DialogBody>
        <DialogFooter className="justify-between gap-2 border-t border-blue-gray-100">
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenEditDialog(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={updateAd}>
            Save Changes
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ADS;
