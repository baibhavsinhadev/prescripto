import { toast } from "react-toastify";
import api from "../../api/axios";
import { useState } from "react";
import { useAdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loading from "../../components/Loading";

const AllAppointments = () => {

    const { isAdmin } = useAdminContext();
    const { currency } = useAppContext();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAllAppointments = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/admin/appointments");

            if (data.success) {
                setAppointments(data.appointments);
            };
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        };
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await api.post("/admin/appointment/cancel", { appointmentId });

            if (data.success) {
                toast.success(data.message);
                await fetchAllAppointments();
            };
        } catch (error) {
            toast.error(error?.response?.data?.message);
        };
    };

    const getAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        };

        return age;
    };

    useEffect(() => {
        if (isAdmin) {
            fetchAllAppointments();
        }
    }, [isAdmin])

    return (
        <div className="w-full max-w-6xl m-5">
            <p className="text-lg font-medium mb-3">All appointments</p>

            {loading ? (
                <Loading />
            ) : (
                <div className="bg-white border border-gray-300 rounded text-sm min-h-[60vh] max-h-[80vh] overflow-y-scroll">
                    <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-gray-300">
                        <p>#</p>
                        <p>Patient</p>
                        <p>Age</p>
                        <p>Date & Time</p>
                        <p>Doctor</p>
                        <p>Fees</p>
                        <p>Action</p>
                    </div >

                    {
                        appointments.length > 0 ? (
                            appointments.map((appointment, index) => {
                                const [day, month, year] = appointment.slotDate.split("_");
                                const formattedDate = new Date(year, month - 1, day).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                });

                                return (
                                    <div className="flex flex-wrap justify-between max-sm:gap-2 sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b border-gray-300 hover:bg-gray-100 cursor-pointer transition-all" key={appointment._id}>
                                        <p className="max-sm:hidden">{index + 1}</p>

                                        <div className="flex items-center gap-2">
                                            <img className="w-8 rounded-full bg-indigo-50" src={appointment.userData.image} alt={appointment.userData.name} />

                                            <p>{appointment.userData.name}</p>
                                        </div>

                                        <p className="max-sm:hidden">{getAge(appointment.userData.dob)}</p>
                                        <p>{formattedDate}, {appointment.slotTime}</p>

                                        <div className="flex items-center gap-2">
                                            <img className="w-8 rounded-full bg-indigo-50" src={appointment.docData.image} alt={appointment.docData.name} />

                                            <p>{appointment.docData.name}</p>
                                        </div>

                                        <p>{currency}{appointment.amount}</p>

                                        {appointment.cancelled ? (
                                            <p className="text-red-400 text-xs font-medium">Cancelled</p>
                                        ) : appointment.isCompleted ? (
                                            <p className="text-green-500 text-xs font-medium">
                                                Completed
                                            </p>
                                        ) : appointment.payment ? (
                                            <p className="text-green-400 text-xs font-medium">Paid</p>
                                        ) : (
                                            <img onClick={() => cancelAppointment(appointment._id)} src={assets.cancel_icon} alt="Cancel" className="w-10 cursor-pointer" />
                                        )}
                                    </div>
                                )
                            })
                        ) : (
                            <p className="text-gray-600 font-medium text-lg py-4 text-center flex items-center justify-center">No appointments found</p>
                        )
                    }
                </div >
            )}
        </div >
    );
};

export default AllAppointments;