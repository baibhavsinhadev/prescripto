import { Link } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
    return (
        <Link
            to={`/doctor/${doctor._id}`}
            aria-label={`View profile of Dr. ${doctor.name}`}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2.5 transition-all duration-500"
        >
            <img
                src={doctor.image}
                alt={`Dr. ${doctor.name}`}
                loading="lazy"
                decoding="async"
                width={320}
                height={320}
                className="bg-blue-50 w-full aspect-square object-cover"
            />

            <div className="p-4">
                <div
                    className={`flex items-center gap-2 text-sm ${doctor.available ? "text-green-500" : "text-red-500"}`}
                    aria-label="Doctor is available"
                >
                    <span
                        className={`w-2 h-2 ${doctor.available ? "bg-green-500" : "bg-red-500"} rounded-full`}
                        aria-hidden="true"
                    />
                    <span>{doctor.available ? "Available" : "Unavailable"}</span>
                </div>

                <h3 className="text-gray-900 text-lg font-medium">
                    {doctor.name}
                </h3>

                <p className="text-gray-600 text-sm">
                    {doctor.speciality}
                </p>
            </div>
        </Link>
    );
};

export default DoctorCard;