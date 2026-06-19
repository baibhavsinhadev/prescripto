import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useDoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import Loading from "../../components/Loading";
import DashboardSkeleton from "../../components/DashboardSkeleton";

const DoctorDashboard = () => {

    const { isDoctor } = useDoctorContext();
    const { currency } = useAppContext();

    const [dashboardData, setDashboardData] = useState([]);
    const [loading, setLoading] = useState(false)

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/doctor/dashboard");

            if (data.success) {
                setDashboardData(data.dashboardData)
            };
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false);
        };
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await api.put("/doctor/cancel", { appointmentId });

            if (data.success) {
                toast.success(data.message);
                await fetchAppointments();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        };
    };

    const dashStats = [
        {
            label: "Earnings",
            value: `${currency}${dashboardData?.earnings}`,
            icon: assets.earning_icon
        },
        {
            label: "Appointments",
            value: dashboardData?.appointments,
            icon: assets.appointments_icon
        },
        {
            label: "Patients",
            value: dashboardData?.patients,
            icon: assets.patients_icon
        }
    ];

    useEffect(() => {
        if (isDoctor) {
            fetchDashboardData();
        };
    }, [isDoctor]);

    if (loading && !dashboardData) {
        return <DashboardSkeleton />;
    }

    return dashboardData && (
        <div className="m-5">
            <div className="flex flex-wrap gap-3">
                {dashStats.map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border border-gray-300 cursor-pointer hover:scale-105 transition-all">
                        <img className="w-14" src={stat.icon} alt={stat.label} />

                        <div>
                            <p className="text-xl font-semibold text-gray-600">{stat.value}</p>
                            <p className="text-gray-400">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white">
                <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border border-gray-300">
                    <img src={assets.list_icon} alt="list_icon" />
                    <p className="font-semibold">Latest Appointments</p>
                </div>

                <div className="border border-t-0 border-gray-300">
                    {dashboardData?.recentAppointments?.length > 0 ? (dashboardData?.recentAppointments.map((appointment) => {
                        const [day, month, year] = appointment.slotDate.split("_");
                        const formattedDate = new Date(year, month - 1, day).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        });

                        return (
                            <div className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100" key={appointment._id}>
                                <img className="rounded-full bg-indigo-50 w-10" src={appointment.userData.image} alt={appointment.userData.name} />

                                <div className="flex-1 text-sm">
                                    <p className="text-gray-800 font-medium">{appointment.userData.name}</p>
                                    <p className="text-gray-600">{formattedDate}</p>
                                </div>

                                {appointment.cancelled ? (
                                    <p className="text-red-400 text-xs font-medium">Cancelled</p>
                                ) : appointment.isCompleted ? (
                                    <p className="text-green-400 text-xs font-medium">Completed</p>
                                ) : (
                                    <img onClick={() => cancelAppointment(appointment._id)} src={assets.cancel_icon} alt="Cancel" className="w-10 cursor-pointer" />
                                )}
                            </div>
                        )
                    })) : (
                        <p className="text-gray-600 font-medium text-sm py-4 col-span-3 text-center">No appointments found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;