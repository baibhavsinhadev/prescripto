import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { About, Appointments, Auth, Contact, DoctorDetails, Doctors, Home, Profile } from "./pages/pages";
import { Footer, Loading, Navbar, ScrollToTop } from "./components/components";
import { ToastContainer } from "react-toastify"

const App = () => {
    return (
        <div className="mx-4 sm:mx-[10%]">
            <ScrollToTop />
            <ToastContainer />
            <Navbar />

            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/doctors' element={<Doctors />} />
                    <Route path='/doctors/:speciality' element={<Doctors />} />
                    <Route path='/doctor/:docId' element={<DoctorDetails />} />
                    <Route path='/auth' element={<Auth />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/contact' element={<Contact />} />
                    <Route path='/appointments' element={<Appointments />} />
                    <Route path='/profile' element={<Profile />} />
                </Routes>
            </Suspense>

            <Footer />
        </div>
    );
};

export default App;