import { toast } from "react-toastify";
import { useAdminContext } from "../../context/AdminContext";
import api from "../../api/axios";

const Doctors = () => {

    const { doctors, fetchAllDoctors } = useAdminContext();

    const changeAvailability = async (docId) => {
        try {
            const { data } = await api.post(`/admin/${docId}`);

            if (data.success) {
                toast.success(data.message);
                await fetchAllDoctors();
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
        };
    };

    return (
        <div className="m-5 max-h-[90vh] overflow-y-scroll">
            <h1 className="text-lg font-medium">All Doctors</h1>

            <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
                {doctors.map((doctor) => (
                    <div className="border group border-indigo-300 rounded-sm max-w-56 overflow-hidden cursor-pointer" key={doctor._id}>
                        <img className="bg-indigo-50 group-hover:bg-primary transition-all duration-500" src={doctor.image} alt={doctor.name} />

                        <div className="p-4">
                            <p className="text-neutral-800 text-lg font-medium">{doctor.name}</p>
                            <p className="text-zinc-600 text-sm">{doctor.speciality}</p>

                            <div className="mt-2 flex items-center gap-1 text-sm">
                                <input onChange={() => changeAvailability(doctor._id)} type="checkbox" checked={doctor.available} />

                                <p>{doctor.available ? "Available" : "Unavailable"}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Doctors;