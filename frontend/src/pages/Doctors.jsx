import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { DoctorCard } from "../components/components"
import { useEffect, useState } from "react";
import { assets } from "../assets/assets";

const Doctors = () => {

    const specialities = [
        "General physician",
        "Gynecologist",
        "Dermatologist",
        "Pediatricians",
        "Neurologist",
        "Gastroenterologist",
    ]

    const { speciality } = useParams();
    const { doctors, navigate } = useAppContext();

    const [showFilters, setShowFilters] = useState(false);
    const [filteredDoctors, setFilteredDoctors] = useState([]);

    const applyFilter = () => {
        if (speciality) {
            setFilteredDoctors(doctors.filter((doctor) => doctor.speciality.toLowerCase() === speciality));
        } else {
            setFilteredDoctors(doctors);
        };
    };

    useEffect(() => {
        applyFilter();
    }, [doctors, speciality])

    return (
        <main>
            <p className="text-gray-600">Browse through the doctors specialist.</p>

            <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
                <div className="w-full sm:w-auto relative z-20">
                    <button onClick={() => setShowFilters(!showFilters)} className="sm:hidden w-full border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between bg-white cursor-pointer">
                        <span>
                            {speciality ? specialities.find(spec => spec.toLowerCase() === speciality.toLowerCase()) : "Select Specialty"}
                        </span>

                        <img src={assets.dropdown_icon} alt="dropdown_icon" loading="lazy" decoding="async" className={`w-3 transition-transform duration-300 ${showFilters ? "" : "rotate-180"}`} />
                    </button>

                    <div className={`sm:hidden absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg overflow-hidden transition-all duration-300 z-50 ${showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-0"}`}>
                        {specialities.map((spec, i) => (
                            <p key={i} onClick={() => { speciality?.toLowerCase() === spec.toLowerCase() ? navigate("/doctors") : navigate(`/doctors/${spec.toLowerCase()}`); setShowFilters(false); }} className={`px-4 py-3 cursor-pointer transition-colors ${speciality?.toLowerCase() === spec.toLowerCase() ? "bg-indigo-100 text-black" : "hover:bg-gray-50"}`}>
                                {spec}
                            </p>
                        ))}
                    </div>

                    <div className="hidden sm:flex flex-col gap-4 text-sm text-gray-600">
                        {specialities.map((spec, i) => (
                            <p key={i} onClick={() => speciality?.toLowerCase() === spec.toLowerCase() ? navigate("/doctors") : navigate(`/doctors/${spec.toLowerCase()}`)} className={`pl-3 py-1.5 pr-16 border border-gray-300 rounded-all cursor-pointer ${speciality?.toLowerCase() === spec.toLowerCase() ? "bg-indigo-100 text-black" : ""}`}>
                                {spec}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="w-full grid grid-cols-auto gap-4 pt-1 gap-y-6">
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doctor) => (
                            <DoctorCard doctor={doctor} key={doctor._id} />
                        ))
                    ) : (
                        <div className="col-span-full min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
                            <h3 className="text-xl font-semibold text-gray-800">No Doctors Found</h3>

                            <p className="mt-2 max-w-md text-gray-500">We couldn't find any doctors for this specialty at the moment. Try selecting another specialty.</p>

                            <button onClick={() => navigate("/doctors")} className="mt-6 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors cursor-pointer">
                                View All Doctors
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Doctors;