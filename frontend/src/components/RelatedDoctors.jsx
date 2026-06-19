import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import DoctorCard from "./DoctorCard";

const RelatedDoctors = ({ id, speciality }) => {

    const { doctors } = useAppContext();
    const [relatedDoc, setRelatedDoc] = useState([]);

    // Fetch Related Doctors
    const fetchRelatedDoctors = () => {
        if (doctors.length > 0 && speciality) {
            const docData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== id);

            setRelatedDoc(docData);
        };
    };

    useEffect(() => {
        fetchRelatedDoctors();
    }, [doctors, speciality, id])

    return (
        <section className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
            <h1 className="text-3xl font-medium">Related Doctors</h1>
            <p className="sm:w-[35%] text-center text-sm">Simply browse through our extensive list of trusted doctors.</p>

            <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
                {relatedDoc.slice(0, 5).map((doctor) => (
                    <DoctorCard doctor={doctor} key={doctor._id} />
                ))}
            </div>

            <Link to="/doctors" className="bg-blue-50 border border-blue-300 px-12 py-3 rounded-full mt-10">
                see more doctors
            </Link>
        </section>
    );
};

export default RelatedDoctors;