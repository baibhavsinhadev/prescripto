import razorpay from "razorpay";
import Stripe from "stripe";
import Appointment from "../models/Appointment.js";

// Razorpay Instance
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});

// API to make payment of appointment using razorpay : POST /api/payment/razorpay
export const razorpayPayment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointmentData = await Appointment.findById(appointmentId);
        if (!appointmentData) {
            return res.status(400).json({
                success: false,
                message: "Appointment Not Found"
            });
        };

        if (appointmentData.cancelled) {
            return res.status(400).json({
                success: false,
                message: "Appointment is cancelled"
            });
        };

        if (appointmentData.payment) {
            return res.status(400).json({
                success: false,
                message: "Appointment is already paid"
            });
        };

        // Creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        };

        // Creating order for razorpay payment
        const order = await razorpayInstance.orders.create(options);
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    };
};

// API to verify razorpay payment : POST /api/payment/verify-razorpay
export const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === "paid") {
            await Appointment.findByIdAndUpdate(orderInfo.receipt, {
                payment: true,
                paymentMethod: "Razorpay"
            });

            res.status(200).json({
                success: true,
                message: "Payment successful"
            });
        } else {
            res.status(200).json({
                success: false,
                message: "Payment failed"
            });
        };
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    };
};

// Stripe Instance
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// API to create payment of appointment using stripe : POST /api/payment/stripe
export const stripePayment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointmentData = await Appointment.findById(appointmentId);
        if (!appointmentData) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        };

        if (appointmentData.cancelled) {
            return res.status(400).json({
                success: false,
                message: "Appointment is cancelled"
            });
        };

        if (appointmentData.payment) {
            return res.status(400).json({
                success: false,
                message: "Appointment is already paid"
            });
        };

        const line_items = [{
            price_data: {
                currency: process.env.CURRENCY.toLowerCase() || "usd",
                product_data: {
                    name: `Appointment with Dr. ${appointmentData.docData?.name || "Doctor"}`
                },
                unit_amount: appointmentData.amount * 100,
            },
            quantity: 1,
        }];

        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: line_items,
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/payment-success?appointmentId=${appointmentId}`,
            cancel_url: `${process.env.FRONTEND_URL}/my-appointments`,
            metadata: {
                appointmentId,
            }
        });

        return res.status(200).json({
            success: true,
            url: session.url,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    };
};

// API to verify stripe payment : POST /stripe
export const stripeWebhooks = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_KEY
        );
    } catch (err) {
        console.error(err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    };
    
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;
            const appointmentId = session.metadata.appointmentId;

            await Appointment.findByIdAndUpdate(appointmentId, {
                payment: true,
                paymentMethod: "Stripe"
            });
            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
            break;
    };

    return res.json({ received: true });
};