import { assets } from "../assets/assets";

const Footer = () => {
    return (
        <footer className="md:mx-10" aria-label="Site Footer">
            <div className="grid gap-14 my-10 mt-40 text-sm sm:grid-cols-[3fr_1fr_1fr]">
                
                {/* Brand */}
                <section>
                    <img
                        src={assets.logo}
                        alt="Prescripto Logo"
                        className="mb-5 w-40 h-auto"
                        width={160}
                        height={44}
                        loading="lazy"
                        decoding="async"
                    />

                    <p className="w-full leading-6 text-gray-600 md:w-2/3">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s.
                    </p>
                </section>

                {/* Company Links */}
                <nav aria-label="Footer Navigation">
                    <h2 className="mb-5 text-xl font-medium">
                        COMPANY
                    </h2>

                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Contact Us</li>
                        <li>Privacy Policy</li>
                    </ul>
                </nav>

                {/* Contact */}
                <address className="not-italic">
                    <h2 className="mb-5 text-xl font-medium">
                        GET IN TOUCH
                    </h2>

                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li>
                            <a
                                href="tel:+919876543210"
                                className="hover:text-primary"
                            >
                                +91 9876543210
                            </a>
                        </li>

                        <li>
                            <a
                                href="mailto:contact@prescripto.com"
                                className="hover:text-primary"
                            >
                                contact@prescripto.com
                            </a>
                        </li>
                    </ul>
                </address>
            </div>

            <div className="border-t border-gray-300">
                <small className="block py-5 text-center text-sm text-gray-600">
                    © {new Date().getFullYear()} Baibhav Sinha. All Rights Reserved.
                </small>
            </div>
        </footer>
    );
};

export default Footer;