import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { RelatedDoctors } from "../components/components";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import api from "../api/axios";

const DoctorDetails = () => {
    const daysOfWeek = [
        "SUN",
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT",
    ];

    const { docId } = useParams();

    const {
        navigate,
        currency,
        isAuth,
        fetchDoctorData
    } = useAppContext();

    const [docData, setDocData] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [doctorRes, slotsRes] = await Promise.all([
                api.get(`/doctor/${docId}`),
                api.get(`/doctor/${docId}/slots`)
            ]);

            if (doctorRes.data.success) {
                setDocData(doctorRes.data.doctor);
            } else {
                toast.error(doctorRes.data.message);
            }

            if (slotsRes.data.success) {
                setDocSlots(slotsRes.data.slots);

                if (
                    slotsRes.data.slots.length > 0 &&
                    slotsRes.data.slots[0].slots.length > 0
                ) {
                    setSlotTime(
                        slotsRes.data.slots[0].slots[0].time
                    );
                }
            } else {
                toast.error(slotsRes.data.message);
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Internal Server Error"
            );
        } finally {
            setLoading(false);
        }
    };

    const bookAppointment = async () => {
        if (!isAuth) {
            return toast.warn("Login to book appointment");
        }

        if (!slotTime) {
            return toast.warn("Please select a time slot");
        }

        try {
            const slotDate = docSlots[slotIndex]?.date;

            const { data } = await api.post(
                "/appointment/create",
                {
                    docId,
                    slotDate,
                    slotTime
                }
            );

            if (data.success) {
                toast.success(data.message);
                await fetchDoctorData();
                navigate("/appointments");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Internal Server Error"
            );
        }
    };

    useEffect(() => {
        fetchData();
    }, [docId]);

    if (loading || !docData) {
        return <Loading />;
    }

    return (
        <main>
            <section className="flex flex-col sm:flex-row gap-4">
                <div>
                    <img
                        className="bg-primary w-full sm:max-w-72 rounded-lg"
                        src={docData.image}
                        alt={docData.name}
                    />
                </div>

                <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 -mt-20 sm:mt-0">
                    <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
                        {docData.name}
                        <img
                            className="w-5"
                            src={assets.verified_icon}
                            alt="verified_icon"
                        />
                    </p>

                    <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                        <p>
                            {docData.degree} -{" "}
                            {docData.speciality}
                        </p>

                        <span className="py-0.5 px-2 border border-gray-300 text-xs rounded-full">
                            {docData.experience}
                        </span>

                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${docData.available ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
                            <span className={`w-2 h-2 rounded-full ${docData.available ? "bg-green-500" : "bg-red-500"}`} />

                            {docData.available ? "Available" : "Unavailable"}
                        </span>
                    </div>

                    <div>
                        <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                            About
                            <img
                                src={assets.info_icon}
                                alt="info_icon"
                            />
                        </p>

                        <p className="text-sm text-gray-500 max-w-175 mt-1">
                            {docData.about}
                        </p>
                    </div>

                    <p className="text-gray-500 font-medium mt-4">
                        Appointment Fee:{" "}
                        <span className="text-gray-600">
                            {currency}
                            {docData.fees}
                        </span>
                    </p>
                </div>
            </section>

            <section className="font-medium text-gray-700 mt-12">
                <p>Booking slots</p>

                <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                    {docSlots.map((docItem, idx) => (
                        <div key={idx} onClick={() => {
                            setSlotIndex(idx);

                            if (docItem.slots.length > 0) {
                                setSlotTime(docItem.slots[0].time);
                            }
                        }} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === idx ? "bg-primary text-white" : "border border-gray-200"}`}>
                            <p>{daysOfWeek[docItem.day]}</p>
                            <p>{docItem.dayNumber}</p>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
                    {docSlots[slotIndex]?.slots?.map((item, idx) => (
                        <span key={idx} onClick={() => setSlotTime(item.time)} className={`text-sm font-light shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? "bg-primary text-white" : "text-gray-400 border border-gray-200"}`}>
                            {item.time.toLowerCase()}
                        </span>
                    ))}
                </div>

                <button
                    onClick={bookAppointment}
                    className="bg-primary text-white text-sm font-medium px-14 py-3 rounded-full my-6 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                    Book appointment
                </button>
            </section>

            <RelatedDoctors
                id={docId}
                speciality={docData.speciality}
            />
        </main>
    );
};

export default DoctorDetails;