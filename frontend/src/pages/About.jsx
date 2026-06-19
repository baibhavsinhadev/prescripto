import { assets } from "../assets/assets";

const About = () => {

    const whyChooseUs = [
        {
            title: "EFFICIENCY:",
            subTitle: "Streamlined appointment scheduling that fits into your busy lifestyle."
        },
        {
            title: "CONVENIENCE:",
            subTitle: "Access to a network of trusted healthcare professionals in your area."
        },
        {
            title: "PERSONALIZATION:",
            subTitle: "Tailored recommendations and reminders to help you stay on top of your health."
        },
    ]

    return (
        <main>
            <section className="text-center text-2xl pt-10 text-gray-500">
                <p>ABOUT <span className="text-gray-700 font-medium">US</span></p>
            </section>

            <section className="my-10 flex flex-col md:flex-row gap-12">
                <img src={assets.about_image} alt="about_image" className="w-full max-w-90" loading="lazy" decoding="async" />

                <div className="flex flex-col justify-center gap-6 md:w-1/2 text-sm text-gray-600">
                    <p>Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>

                    <p>Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.</p>

                    <b className="text-gray-800">Our Vision</b>

                    <p>Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
                </div>
            </section>

            <section className="text-xl my-4 text-gray-500">
                <p>WHY <span className="text-gray-700 font-medium">CHOOSE US</span></p>
            </section>

            <section className="flex flex-col md:flex-row mb-20">
                {whyChooseUs.map((item, index) => (
                    <div className="border border-gray-200 px-10 md:px-16 py-8 md:py-16 flex flex-col gap-5 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 text-gray-600 cursor-pointer text-[15px]" key={index}>
                        <b>{item.title}</b>
                        <p>{item.subTitle}</p>
                    </div>
                ))}
            </section>
        </main>
    );
};

export default About;