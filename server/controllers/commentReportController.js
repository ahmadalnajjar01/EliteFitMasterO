// controllers/commentReportController.js
const { CommentReport, User, Comment } = require("../models");
const jwt = require("jsonwebtoken");

module.exports = {
  // Report a comment
  async createReport(req, res) {
    try {
      // Verify token manually (like in your working order controller)
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: Token missing" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId; // Use the same property name as your token

      // Validate required fields
      const { commentId, reason } = req.body;
      if (!commentId || !reason) {
        return res.status(400).json({
          message: "Comment ID and reason are required",
        });
      }

      // Verify user exists
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if comment exists
      const comment = await Comment.findByPk(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // Check for existing report
      const existingReport = await CommentReport.findOne({
        where: { userId, commentId },
      });

      if (existingReport) {
        return res.status(400).json({
          message: "You've already reported this comment",
          reportId: existingReport.id,
          status: existingReport.status,
        });
      }

      // Create the report
      const report = await CommentReport.create({
        userId,
        commentId,
        reason,
        status: "pending",
      });

      return res.status(201).json({
        message: "Report submitted successfully",
        report: {
          id: report.id,
          commentId: report.commentId,
          status: report.status,
          createdAt: report.createdAt,
        },
      });
    } catch (error) {
      console.error("Report creation error:", error);

      // Handle specific error cases
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }

      return res.status(500).json({
        message: "Failed to create report",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Get all reports (for admin/moderators)
  async getAllReports(req, res) {
    try {
      const reports = await CommentReport.findAll({
        include: [
          { model: User, attributes: ["id", "username", "email"] },
          { model: Comment },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json(reports);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Update report status (for admin/moderators)
  async updateReportStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, moderatorNotes } = req.body;

      const report = await CommentReport.findByPk(id);

      if (!report) {
        return res.status(404).json({ message: "Report not found." });
      }

      report.status = status || report.status;
      report.moderatorNotes = moderatorNotes || report.moderatorNotes;

      await report.save();

      return res.status(200).json(report);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Delete report (optional, admin functionality)
  async deleteReport(req, res) {
    try {
      const { id } = req.params;

      const report = await CommentReport.findByPk(id);

      if (!report) {
        return res.status(404).json({ message: "Report not found." });
      }

      await report.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getAllCommentsWithReports(req, res) {
    try {
      const comments = await Comment.findAll({
        include: [
          {
            model: CommentReport,
            include: [{ model: User, attributes: ["id", "username", "email"] }],
            where: {},
            required: false,
          },
          {
            model: User,
            attributes: ["id", "username"],
          },
        ],
        order: [
          ["createdAt", "DESC"],
          [CommentReport, "createdAt", "DESC"],
        ],
      });

      const formattedComments = comments.map((comment) => {
        const commentJson = comment.toJSON();
        return {
          ...commentJson,
          reportCount: commentJson.CommentReports
            ? commentJson.CommentReports.length
            : 0,
          reports: commentJson.CommentReports || [],
        };
      });

      return res.status(200).json(formattedComments);
    } catch (error) {
      console.error("Error fetching comments with reports:", error);
      return res.status(500).json({
        message: "Failed to fetch comments",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  async deleteComment(req, res) {
    try {
      const { id } = req.params;

      const comment = await Comment.findByPk(id);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found." });
      }

      const transaction = await Comment.sequelize.transaction();
      try {
        await CommentReport.destroy({
          where: { commentId: id },
          transaction,
        });

        await comment.destroy({ transaction });

        await transaction.commit();

        return res.status(200).json({
          message: "Comment and all associated reports deleted successfully",
        });
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res.status(500).json({
        message: "Failed to delete comment",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};
