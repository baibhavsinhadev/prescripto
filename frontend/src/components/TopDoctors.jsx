import { Link } from "react-router-dom";
import { DoctorCard } from "../components/components";
import { useAppContext } from "../context/AppContext";

const TopDoctors = () => {

    const { doctors } = useAppContext();

    return (
        <section aria-labelledby="top-doctors-heading" className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
            <h2 id="top-doctors-heading" className="text-3xl font-medium">Top Doctors to Book</h2>
            <p className="sm:w-[35%] text-center text-sm">Simply browse through our extensive list of trusted doctors.</p>

            <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6" role="list"
                aria-label="Top doctors">
                {doctors.slice(0, 10).map((doctor) => (
                    <DoctorCard doctor={doctor} key={doctor._id} role="listitem" />
                ))}
            </div>

            <Link to="/doctors" aria-label="View all doctors" className="bg-blue-50 border border-blue-300 px-12 py-3 rounded-full mt-10">
                see more doctors
            </Link>
        </section>
    );
};

export default TopDoctors;