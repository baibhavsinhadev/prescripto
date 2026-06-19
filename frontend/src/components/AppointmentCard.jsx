import { useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";
import api from "../api/axios";

const AppointmentCard = ({ appointment, cancelAppointment, fetchAppointments }) => {

    const { navigate } = useAppContext();

    const [showPaymentMethod, setShowPaymentMethod] = useState(false);

    const [day, month, year] = appointment.slotDate.split("_");
    const formattedDate = new Date(year, month - 1, day).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            amount: order.amount,
            currency: order.currency,
            name: "Prescripto Healthcare",
            description: `Appointment consultation fee for Dr. ${appointment.docData.name}`,
            order_id: order.id,
            receipt: order.receipt,
            prefill: {
                name: appointment.userData.name,
                email: appointment.userData.email,
                contact: appointment.userData.phone,
            },

            notes: {
                doctor: appointment.docData.name,
                speciality: appointment.docData.speciality,
                appointmentDate: formattedDate,
                appointmentTime: appointment.slotTime,
            },

            theme: {
                color: "#5F6FFF",
            },

            handler: async (response) => {
                try {
                    const { data } = await api.post("/payment/verify-razorpay", response);

                    if (data.success) {
                        toast.success(data.message);
                        await fetchAppointments();
                        navigate("/appointments")
                    }
                } catch (error) {
                    toast.error(error?.response?.data?.message)
                };
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const razorpayMethod = async (appointmentId) => {
        try {
            const { data } = await api.post("/payment/razorpay", { appointmentId });

            if (data.success) {
                initPay(data.order)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        };
    };

    const stripeMethod = async (appointmentId) => {
        try {
            const { data } = await api.post("/payment/stripe", { appointmentId });

            if (data.success) {
                window.location.href = data.url;
            };
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <div className="border border-gray-300 rounded-sm p-5 flex flex-col md:flex-row gap-6">
            <img src={appointment.docData.image} alt={appointment.docData.name} className="w-32 object-cover bg-indigo-50 rounded-sm" loading="lazy" decoding="async" />

            <div className="flex-1">
                <h3 className="text-lg font-semibold text-zinc-800">{appointment.docData.name}</h3>
                <p className="text-zinc-500">{appointment.docData.speciality}</p>

                <div className="mt-4">
                    <p className="font-medium text-zinc-700">Address</p>
                    <p className="text-zinc-500">{appointment.userData.address.line1}</p>
                    <p className="text-zinc-500">{appointment.userData.address.line2}</p>
                </div>

                <p className="mt-4 text-zinc-600">
                    <span className="font-medium">Date & Time: </span>
                    {formattedDate} | {appointment.slotTime}
                </p>
            </div>

            <div className="flex flex-col gap-3 md:w-52 justify-end">
                {appointment.cancelled ? (
                    <span className="w-full text-center bg-red-100 text-red-600 py-3 rounded-sm font-medium">
                        Cancelled
                    </span>
                ) : appointment.payment ? (
                    <span className="w-full text-center bg-green-100 text-green-600 py-3 rounded-sm font-medium">
                        Paid
                    </span>
                ) : appointment.isCompleted ? (
                    <span className="w-full text-center bg-green-100 text-green-600 py-3 rounded-sm font-medium">
                        Completed
                    </span>
                ) : (
                    <>
                        {
                            showPaymentMethod ? (
                                <div className="flex flex-col gap-3 md:w-52 justify-end" >
                                    <button onClick={() => razorpayMethod(appointment._id)} className="flex items-center justify-center gap-3 w-full py-3 rounded-sm border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all duration-300 cursor-pointer">
                                        <img
                                            src={assets.razorpay_logo}
                                            alt="Razorpay"
                                            className="h-6 object-contain"
                                        />
                                    </button>

                                    <button onClick={() => stripeMethod(appointment._id)} className="flex items-center justify-center gap-3 w-full py-3 rounded-sm border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all duration-300 cursor-pointer">
                                        <img
                                            src={assets.stripe_logo}
                                            alt="Stripe"
                                            className="h-6 object-contain"
                                        />
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => setShowPaymentMethod(true)} className="w-full border border-primary text-primary py-3 rounded-sm hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
                                    Pay Online
                                </button>
                            )}

                        <button onClick={() => cancelAppointment(appointment._id)} className="w-full border border-red-400 text-red-500 py-3 rounded-sm hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer">
                            Cancel Appointment
                        </button>
                    </>
                )
                }
            </div >
        </div >
    );
};

export default AppointmentCard;