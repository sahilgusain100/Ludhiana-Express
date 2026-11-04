
import { Order } from "../models/order.model.js";

// Place a new order
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      pickupAddress,
      pickupDate,
      pickupTime,
    } = req.body;

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !pickupAddress ||
      !pickupDate ||
      !pickupTime
    ) {
      return res.status(400).json({
        message: "Please provide items and all pickup details",
      });
    }

    for (const item of items) {
      if (
        !item.service ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        typeof item.price !== "number" ||
        !Number.isFinite(item.price) ||
        item.price < 0
      ) {
        return res.status(400).json({
          message: "Each item needs a service, valid quantity and price",
        });
      }
    }

    const parsedPickupDate = new Date(pickupDate);

    if (Number.isNaN(parsedPickupDate.getTime())) {
      return res.status(400).json({
        message: "Please provide a valid pickup date",
      });
    }

    // Calculate the total on the server
    const totalAmount = items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      pickupAddress,
      pickupDate: parsedPickupDate,
      pickupTime,
    });

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error.message);

    return res.status(500).json({
      message: "Could not place order",
    });
  }
};

// Get only the logged-in customer's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error.message);

    return res.status(500).json({
      message: "Could not fetch orders",
    });
  }
};
