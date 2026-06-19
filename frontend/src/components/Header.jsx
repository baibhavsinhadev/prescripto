import { assets } from "../assets/assets";

const Header = () => {
    return (
        <section className="flex flex-col overflow-hidden rounded-lg bg-primary px-6 sm:px-10 lg:px-20 md:flex-row">

            <div className="flex flex-col items-center justify-center gap-5 py-12 text-center md:w-1/2 md:items-start md:py-16 md:text-left">

                <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                    Book Appointment
                    <br className="hidden md:block" />
                    With Trusted Doctors
                </h1>

                <div className="flex flex-col items-center gap-3 text-sm text-white sm:flex-row">
                    <img
                        src={assets.group_profiles}
                        alt="Profiles of registered patients"
                        className="w-28 h-auto"
                        width={112}
                        height={40}
                        loading="lazy"
                        decoding="async"
                    />

                    <p className="max-w-md">
                        Simply browse through our extensive list of trusted
                        doctors and schedule your appointment hassle-free.
                    </p>
                </div>

                <a
                    href="#speciality"
                    aria-label="Browse doctor specialities"
                    className="flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm text-gray-600 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                    Book Appointment

                    <img
                        src={assets.arrow_icon}
                        alt=""
                        aria-hidden="true"
                        className="w-3 h-auto"
                        width={12}
                        height={12}
                        loading="lazy"
                        decoding="async"
                    />
                </a>
            </div>

            <div className="flex justify-center items-end md:w-1/2">
                <img
                    src={assets.header_img}
                    alt="Doctors available for appointment booking"
                    className="w-full max-w-md object-contain lg:max-w-lg"
                    width={600}
                    height={650}
                    fetchPriority="high"
                />
            </div>
        </section>
    );
};

export default Header;