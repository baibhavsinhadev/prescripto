import { Banner, Header, Speciality, TopDoctors } from "../components/components";
import { Helmet } from "react-helmet-async"

const Home = () => {
    return (
        <>
            <Helmet>
                <title>Prescripto | Book Doctor Appointments</title>

                <meta name="description" content="Book appointments with trusted doctors online. Browse specialties and schedule appointments hassle-free." />
            </Helmet>

            <main>
                <Header />
                <Speciality />
                <TopDoctors />
                <Banner />
            </main>
        </>
    );
};

export default Home;