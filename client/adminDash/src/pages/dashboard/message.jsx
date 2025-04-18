import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Spinner,
  IconButton,
} from "@material-tailwind/react";
import {
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Theme colors with additional shades
  const colors = {
    white: "#FFFFFF",
    offWhite: "#F9F9F9",
    gold: {
      light: "#F8E1BC",
      main: "#F0BB78",
      dark: "#D9A666",
    },
    dark: {
      lighter: "#444444",
      main: "#181818",
      darker: "#0A0A0A",
    },
    gray: {
      light: "#F5F5F5",
      medium: "#E0E0E0",
      dark: "#9E9E9E",
    },
  };

  // Fetch all messages from backend
  const fetchMessages = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get("http://localhost:5000/api/messages");
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Handle reply submission
  const handleReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/api/messages/${selectedMessage.id}/reply`,
        {
          replyContent,
        }
      );

      // Close dialog and reset
      setOpenDialog(false);
      setReplyContent("");

      // Show success toast (using alert temporarily)
      const Toast = ({ message }) => (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg">
          {message}
        </div>
      );

      // In a real implementation, use a toast component
      alert("Reply sent successfully!");
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-center">
          <Spinner
            className="h-12 w-12 mb-4"
            style={{ color: colors.gold.main }}
          />
          <Typography variant="h6" style={{ color: colors.dark.main }}>
            Loading messages...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Typography
            variant="h3"
            className="font-semibold"
            style={{ color: colors.dark.main }}
          >
            Contact Messages
          </Typography>
          <Button
            className="flex items-center gap-2"
            style={{
              backgroundColor: colors.gold.main,
              color: colors.dark.main,
              boxShadow: "none",
            }}
            onClick={() => {
              fetchMessages();
            }}
            disabled={refreshing}
          >
            <ArrowPathIcon
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardBody className="flex items-center gap-4">
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: colors.gold.light }}
              >
                <EnvelopeIcon
                  className="h-6 w-6"
                  style={{ color: colors.gold.dark }}
                />
              </div>
              <div>
                <Typography className="text-gray-600 text-sm">
                  Total Messages
                </Typography>
                <Typography variant="h4" style={{ color: colors.dark.main }}>
                  {messages.length}
                </Typography>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardBody className="flex items-center gap-4">
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: colors.gold.light }}
              >
                <UserIcon
                  className="h-6 w-6"
                  style={{ color: colors.gold.dark }}
                />
              </div>
              <div>
                <Typography className="text-gray-600 text-sm">
                  Unique Senders
                </Typography>
                <Typography variant="h4" style={{ color: colors.dark.main }}>
                  {new Set(messages.map((m) => m.email)).size}
                </Typography>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardBody className="flex items-center gap-4">
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: colors.gold.light }}
              >
                <CalendarDaysIcon
                  className="h-6 w-6"
                  style={{ color: colors.gold.dark }}
                />
              </div>
              <div>
                <Typography className="text-gray-600 text-sm">
                  New Today
                </Typography>
                <Typography variant="h4" style={{ color: colors.dark.main }}>
                  {
                    messages.filter(
                      (m) =>
                        new Date(m.createdAt).toDateString() ===
                        new Date().toDateString()
                    ).length
                  }
                </Typography>
              </div>
            </CardBody>
          </Card>
        </div>

        {messages.length === 0 ? (
          <Card className="text-center p-12 shadow-sm">
            <EnvelopeIcon
              className="h-16 w-16 mx-auto mb-4 opacity-30"
              style={{ color: colors.gray.dark }}
            />
            <Typography
              variant="h5"
              className="mb-2"
              style={{ color: colors.dark.main }}
            >
              No messages yet
            </Typography>
            <Typography style={{ color: colors.dark.lighter }}>
              When visitors send messages through your contact form, they will
              appear here.
            </Typography>
          </Card>
        ) : (
          <div className="grid gap-6">
            {messages.map((message) => (
              <Card
                key={message.id}
                className="overflow-hidden transition-all hover:shadow-md"
              >
                <CardHeader
                  floated={false}
                  shadow={false}
                  color="transparent"
                  className="px-6 pt-6 pb-0 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
                >
                  <div>
                    <Typography
                      variant="h5"
                      className="font-medium"
                      style={{ color: colors.dark.main }}
                    >
                      {message.subject}
                    </Typography>
                    <div className="flex items-center gap-2 mt-2">
                      <UserIcon
                        className="h-4 w-4"
                        style={{ color: colors.gold.main }}
                      />
                      <Typography
                        className="font-medium"
                        style={{ color: colors.dark.lighter }}
                      >
                        {message.name}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Chip
                      value={
                        <div className="flex items-center gap-1">
                          <CalendarDaysIcon className="h-3 w-3" />
                          <span>
                            {new Date(message.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      }
                      size="sm"
                      style={{
                        backgroundColor: colors.gold.light,
                        color: colors.dark.main,
                      }}
                    />

                    {/* Show time ago for recent messages */}
                    {(() => {
                      const messageDate = new Date(message.createdAt);
                      const now = new Date();
                      const diffHours = (now - messageDate) / (1000 * 60 * 60);

                      if (diffHours < 24) {
                        return (
                          <Typography variant="small" className="text-gray-500">
                            {diffHours < 1
                              ? `${Math.round(diffHours * 60)} minutes ago`
                              : `${Math.round(diffHours)} hours ago`}
                          </Typography>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </CardHeader>

                <CardBody className="px-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Contact Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon
                          className="h-4 w-4"
                          style={{ color: colors.gold.main }}
                        />
                        <Typography style={{ color: colors.dark.main }}>
                          {message.email}
                        </Typography>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneIcon
                          className="h-4 w-4"
                          style={{ color: colors.gold.main }}
                        />
                        <Typography
                          style={{
                            color: message.phoneNumber
                              ? colors.dark.main
                              : colors.gray.dark,
                          }}
                        >
                          {message.phoneNumber || "Not provided"}
                        </Typography>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="md:col-span-2">
                      <div
                        className="p-4 rounded-lg"
                        style={{
                          backgroundColor: colors.gray.light,
                          border: `1px solid ${colors.gray.medium}`,
                        }}
                      >
                        <Typography
                          style={{
                            color: colors.dark.main,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {message.message}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </CardBody>

                <CardFooter className="pt-0 px-6 pb-6">
                  <Button
                    className="flex items-center gap-2"
                    style={{
                      backgroundColor: colors.gold.main,
                      color: colors.dark.main,
                      boxShadow: "none",
                    }}
                    onClick={() => {
                      setSelectedMessage(message);
                      setOpenDialog(true);
                    }}
                  >
                    <PaperAirplaneIcon className="h-4 w-4" />
                    Reply
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Reply Dialog */}
      <Dialog
        open={openDialog}
        handler={() => setOpenDialog(!openDialog)}
        size="md"
        className="rounded-lg"
      >
        <DialogHeader className="flex items-center justify-between border-b border-gray-200 p-4">
          <Typography variant="h5" style={{ color: colors.dark.main }}>
            Reply to {selectedMessage?.name}
          </Typography>
          <IconButton
            variant="text"
            color="gray"
            onClick={() => setOpenDialog(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </DialogHeader>

        <DialogBody className="p-6">
          <div className="space-y-4">
            <div
              className="flex items-center gap-2 p-3 rounded-md"
              style={{ backgroundColor: colors.gray.light }}
            >
              <UserIcon
                className="h-5 w-5"
                style={{ color: colors.gold.dark }}
              />
              <Typography
                className="font-medium"
                style={{ color: colors.dark.main }}
              >
                {selectedMessage?.name}
              </Typography>
              <Typography
                className="ml-auto text-sm"
                style={{ color: colors.gray.dark }}
              >
                {selectedMessage?.email}
              </Typography>
            </div>

            <div>
              <Typography
                className="mb-1 font-medium"
                style={{ color: colors.dark.lighter }}
              >
                Original Subject
              </Typography>
              <Input
                value={selectedMessage?.subject || ""}
                disabled
                className="!border !border-gray-200"
                containerProps={{ className: "min-w-0" }}
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>

            <div>
              <Typography
                className="mb-1 font-medium"
                style={{ color: colors.dark.lighter }}
              >
                Your Reply
              </Typography>
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={8}
                className="!border !border-gray-200"
                containerProps={{ className: "min-w-0" }}
                labelProps={{
                  className: "hidden",
                }}
                placeholder="Type your response here..."
              />
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="flex justify-end gap-2 border-t border-gray-200 p-4">
          <Button
            variant="outlined"
            style={{
              color: colors.dark.main,
              borderColor: colors.gray.medium,
            }}
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </Button>
          <Button
            style={{
              backgroundColor: colors.gold.main,
              color: colors.dark.main,
              boxShadow: "none",
            }}
            className="flex items-center gap-2"
            onClick={handleReply}
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            Send Reply
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default MessagesPage;
