import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Banner = () => {
    return (
        <section
            aria-labelledby="banner-heading"
            className="flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10"
        >
            <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5">
                <h2
                    id="banner-heading"
                    className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white"
                >
                    Book Appointment

                    <span className="block mt-4">
                        with 100+ trusted doctors
                    </span>
                </h2>

                <Link
                    to="/auth"
                    aria-label="Create a new account"
                    className="inline-block bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 active:scale-95 transition-all duration-500"
                >
                    Create account
                </Link>
            </div>

            <div className="hidden md:block md:w-1/2 lg:w-92.5 relative">
                <img
                    src={assets.appointment_img}
                    alt="Doctor appointment booking"
                    width={450}
                    height={500}
                    loading="lazy"
                    decoding="async"
                    className="w-full absolute bottom-0 right-0 max-w-md"
                />
            </div>
        </section>
    );
};

export default Banner;