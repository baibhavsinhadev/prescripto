import { assets } from "../assets/assets";

const Contact = () => {
    return (
        <main>
            <section className="text-center text-2xl pt-10 text-gray-500">
                <p>CONTACT <span className="text-gray-700 font-medium">US</span></p>
            </section>

            <section className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
                <img className="w-full max-w-90" src={assets.contact_image} alt="contact_image" loading="lazy" decoding="async" />

                <div className="flex flex-col justify-center items-start gap-6">
                    <b className="font-semibold text-lg text-gray-600">OUR OFFICE</b>

                    <div className="text-gray-500">
                        <p>00000 Willms Station</p>
                        <p>Suite 000, Washington, USA</p>
                    </div>

                    <div className="text-gray-500">
                        <p>Tel: +91 9876543210</p>
                        <p>Email: contact@prescripto.com</p>
                    </div>

                    <p className="font-semibold text-lg text-gray-600">CAREERS AT PRESCRIPTO</p>
                    <p className="text-gray-500">Learn more about our teams and job openings.</p>

                    <button className="rounded-sm border border-gray-300 px-8 py-4 text-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 cursor-pointer">Explore Jobs</button>
                </div>
            </section>
        </main>
    );
};

export default Contact;