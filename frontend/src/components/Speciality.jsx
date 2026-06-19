import { Link } from "react-router-dom";
import { specialityData } from "../assets/assets";

const Speciality = () => {
    return (
        <section
            id="speciality"
            aria-labelledby="speciality-heading"
            className="flex flex-col items-center gap-4 py-16 text-gray-800"
        >
            <h2
                id="speciality-heading"
                className="text-3xl font-medium"
            >
                Find by Speciality
            </h2>

            <p className="text-center text-sm sm:w-[35%]">
                Simply browse through our extensive list of trusted doctors
                and schedule your appointment hassle-free.
            </p>

            <div className="flex w-full gap-4 pt-5 overflow-x-auto sm:justify-center">
                {specialityData.map((data) => (
                    <Link
                        key={data.speciality}
                        to={`/doctors/${data.speciality.toLowerCase()}`}
                        aria-label={`Browse ${data.speciality} doctors`}
                        className="flex shrink-0 flex-col items-center text-xs transition-all duration-500 hover:-translate-y-2.5"
                    >
                        <img
                            src={data.image}
                            alt={`${data.speciality} speciality`}
                            className="mb-2 w-16 sm:w-24"
                            width={96}
                            height={96}
                            loading="lazy"
                            decoding="async"
                        />

                        <span>{data.speciality}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default Speciality;