import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { toast } from "react-toastify";

const TABLE_HEAD = [
  "Comment ID",
  "Author",
  "Content",
  "Created At",
  "Reports Count",
  "Status",
  "Actions",
];

const CommentAndReport = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [openReportsDialog, setOpenReportsDialog] = useState(false);
  const [currentReports, setCurrentReports] = useState([]);

  // Custom color theme
  const theme = {
    white: "#ffffff",
    gold: "#F0BB78",
    dark: "#181818",
  };

  useEffect(() => {
    fetchCommentsWithReports();
  }, []);

  const fetchCommentsWithReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/comment-reports/comments-with-reports"
      );
      setComments(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch comments");
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!selectedComment) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/comment-reports/comment/${selectedComment.id}`
      );
      toast.success("Comment deleted successfully");
      fetchCommentsWithReports();
    } catch (error) {
      toast.error("Failed to delete comment");
      console.error("Error deleting comment:", error);
    } finally {
      setOpenDeleteDialog(false);
      setSelectedComment(null);
    }
  };

  const handleViewReports = (comment) => {
    setSelectedComment(comment);
    setCurrentReports(comment.reports || []);
    setOpenReportsDialog(true);
  };

  const filteredComments = comments.filter((comment) => {
    const commentText = comment.comment || "";
    const username = comment.User?.username || comment.User?.email || "";

    const matchesSearch =
      commentText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "reported" && comment.reportCount > 0) ||
      (selectedStatus === "clean" && comment.reportCount === 0);

    return matchesSearch && matchesStatus;
  });

  const getStatusChip = (comment) => {
    if (!comment.reportCount || comment.reportCount === 0) {
      return <Chip color="green" value="Clean" size="sm" />;
    } else if (comment.reportCount > 3) {
      return <Chip color="red" value="Critical" size="sm" />;
    } else {
      return (
        <Chip
          style={{ backgroundColor: theme.gold, color: theme.dark }}
          value="Reported"
          size="sm"
        />
      );
    }
  };

  return (
    <div className="p-4" style={{ backgroundColor: theme.white }}>
      <Typography variant="h2" className="mb-6" style={{ color: theme.dark }}>
        Comment Management
      </Typography>

      <Card
        className="p-4 mb-6"
        style={{ borderColor: theme.gold, borderWidth: "1px" }}
      >
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-72">
            <Input
              label="Search comments"
              icon={
                <MagnifyingGlassIcon
                  className="h-5 w-5"
                  style={{ color: theme.gold }}
                />
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              labelProps={{ style: { color: theme.dark } }}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            />
          </div>
          <div className="w-full md:w-56">
            <Select
              label="Filter by status"
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value)}
              labelProps={{ style: { color: theme.dark } }}
              menuProps={{ style: { backgroundColor: theme.white } }}
            >
              <Option value="all">All Comments</Option>
              <Option value="reported">Reported Only</Option>
              <Option value="clean">Clean Only</Option>
            </Select>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Typography variant="h5" style={{ color: theme.dark }}>
            Loading comments...
          </Typography>
        </div>
      ) : (
        <Card
          className="overflow-scroll"
          style={{
            backgroundColor: theme.white,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr style={{ backgroundColor: theme.dark }}>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="p-4">
                    <Typography
                      variant="small"
                      style={{ color: theme.white, fontWeight: "600" }}
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredComments.map((comment, index) => (
                <tr
                  key={comment.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? theme.white : "#f9f3e9",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <td className="p-4">
                    <Typography variant="small" style={{ color: theme.dark }}>
                      {comment.id}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" style={{ color: theme.dark }}>
                      {comment.User?.username ||
                        comment.User?.email ||
                        "Anonymous"}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      style={{ color: theme.dark }}
                      className="max-w-xs truncate"
                    >
                      {comment.comment}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" style={{ color: theme.dark }}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" style={{ color: theme.dark }}>
                      {comment.reportCount || 0}
                    </Typography>
                  </td>
                  <td className="p-4">{getStatusChip(comment)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: theme.gold,
                          color: theme.dark,
                          opacity:
                            !comment.reportCount || comment.reportCount === 0
                              ? 0.5
                              : 1,
                        }}
                        onClick={() => handleViewReports(comment)}
                        disabled={
                          !comment.reportCount || comment.reportCount === 0
                        }
                      >
                        View Reports
                      </Button>
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: theme.dark,
                          color: theme.white,
                        }}
                        onClick={() => {
                          setSelectedComment(comment);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredComments.length === 0 && (
            <div className="p-8 text-center">
              <Typography variant="h5" style={{ color: theme.dark }}>
                No comments found
              </Typography>
            </div>
          )}
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        handler={() => setOpenDeleteDialog(!openDeleteDialog)}
        style={{ backgroundColor: theme.white }}
      >
        <DialogHeader style={{ color: theme.dark }}>
          Delete Comment
        </DialogHeader>
        <DialogBody>
          <Typography style={{ color: theme.dark }}>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </Typography>
          {selectedComment && (
            <div
              className="mt-4 p-4 rounded"
              style={{ backgroundColor: "#f9f3e9" }}
            >
              <Typography
                variant="small"
                className="font-bold"
                style={{ color: theme.dark }}
              >
                Comment Content:
              </Typography>
              <Typography variant="small" style={{ color: theme.dark }}>
                {selectedComment.comment}
              </Typography>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            style={{ color: theme.dark }}
            onClick={() => setOpenDeleteDialog(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: theme.dark, color: theme.white }}
            onClick={handleDeleteComment}
          >
            Confirm Delete
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Reports Dialog */}
      <Dialog
        open={openReportsDialog}
        handler={() => setOpenReportsDialog(!openReportsDialog)}
        size="xl"
        style={{ backgroundColor: theme.white }}
      >
        <DialogHeader
          style={{ color: theme.dark, borderBottom: `2px solid ${theme.gold}` }}
        >
          Reports for Comment #{selectedComment?.id || ""}
        </DialogHeader>
        <DialogBody className="max-h-[60vh] overflow-y-auto">
          {currentReports.length === 0 ? (
            <Typography style={{ color: theme.dark }}>
              No reports for this comment
            </Typography>
          ) : (
            <div className="space-y-4">
              {currentReports.map((report) => (
                <Card
                  key={report.id}
                  className="p-4"
                  style={{ borderLeft: `4px solid ${theme.gold}` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Typography variant="h6" style={{ color: theme.dark }}>
                        Reporter:{" "}
                        {report.User?.username ||
                          report.User?.email ||
                          "Anonymous"}
                      </Typography>
                      <Typography
                        variant="small"
                        className="mt-1"
                        style={{ color: theme.dark }}
                      >
                        Reason: {report.reason || "No reason provided"}
                      </Typography>
                      <Typography
                        variant="small"
                        className="mt-1"
                        style={{ color: theme.dark }}
                      >
                        Status:{" "}
                        <Chip
                          value={report.status || "pending"}
                          size="sm"
                          style={{
                            backgroundColor:
                              report.status === "pending"
                                ? theme.gold
                                : report.status === "resolved"
                                ? "#4CAF50"
                                : "#2196F3",
                            color:
                              report.status === "pending"
                                ? theme.dark
                                : theme.white,
                          }}
                        />
                      </Typography>
                    </div>
                    <Typography variant="small" style={{ color: theme.dark }}>
                      {new Date(report.createdAt).toLocaleString()}
                    </Typography>
                  </div>
                  {report.moderatorNotes && (
                    <div
                      className="mt-2 p-2 rounded"
                      style={{ backgroundColor: "#f9f3e9" }}
                    >
                      <Typography
                        variant="small"
                        className="font-bold"
                        style={{ color: theme.dark }}
                      >
                        Moderator Notes:
                      </Typography>
                      <Typography variant="small" style={{ color: theme.dark }}>
                        {report.moderatorNotes}
                      </Typography>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            style={{ backgroundColor: theme.gold, color: theme.dark }}
            onClick={() => setOpenReportsDialog(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default CommentAndReport;
