import { Message } from "../models/message.model.js";

// Send a new message (Authenticated)
export const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const trimmedMessage = message?.trim();
    if (!trimmedMessage) {
      return res.status(400).json({
        message: "Message content is required",
      });
    }

    const customerName = name?.trim() || req.user.name;
    const customerEmail = email?.trim().toLowerCase() || req.user.email;
    const messageSubject = subject?.trim() || "General Inquiry";

    if (!customerName || !customerEmail) {
      return res.status(400).json({
        message: "Customer name and email are required",
      });
    }

    const newMessage = await Message.create({
      user: req.user._id,
      name: customerName,
      email: customerEmail,
      subject: messageSubject,
      message: trimmedMessage,
      status: "Pending",
    });

    return res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Create message error:", error.message);
    return res.status(500).json({
      message: "Could not send message. Please try again later.",
    });
  }
};

// Get logged-in customer's message history
export const getMyMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error.message);
    return res.status(500).json({
      message: "Could not fetch message history",
    });
  }
};

// Get a single message by ID (strictly isolated to owner)
export const getMessageById = async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    return res.status(200).json({
      message,
    });
  } catch (error) {
    console.error("Get single message error:", error.message);
    return res.status(500).json({
      message: "Could not fetch message details",
    });
  }
};

