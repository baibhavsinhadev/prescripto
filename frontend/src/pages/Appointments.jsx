import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import api from "../api/axios";
import AppointmentCard from "../components/AppointmentCard";

const Appointments = () => {

    const { isAuth } = useAppContext();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAppointments = async () => {
        setLoading(true);

        try {
            const { data } = await api.get("/appointment/user");

            if (data.success) {
                setAppointments(data.appointments)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false)
        };
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await api.post("/appointment/cancel", { appointmentId });

            if (data.success) {
                toast.success(data.message);
                await fetchAppointments();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        };
    };

    useEffect(() => {
        if (isAuth) {
            fetchAppointments();
        }
    }, [isAuth])

    return (
        <main>
            <p className="pb-3 mt-12 text-lg font-semibold text-zinc-700 border-b border-gray-300">My Appointments</p>

            <section className="mt-6 space-y-6">
                {appointments.map((appointment) => (
                    <AppointmentCard key={appointment._id} appointment={appointment} cancelAppointment={cancelAppointment} fetchAppointments={fetchAppointments} />
                ))}
            </section>
        </main>
    );
};

export default Appointments;