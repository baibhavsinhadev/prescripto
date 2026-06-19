import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { About, Appointments, Auth, Contact, DoctorDetails, Doctors, Home, Profile } from "./pages/pages";
import { Footer, Loading, Navbar, ScrollToTop } from "./components/components";
import { ToastContainer } from "react-toastify"
import { useAppContext } from './context/AppContext';

const App = () => {

    const { isAuth } = useAppContext();

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
                    <Route path='/auth' element={!isAuth ? <Auth /> : <Navigate to="/" replace />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/contact' element={<Contact />} />
                    <Route path='/appointments' element={isAuth ? <Appointments /> : <Navigate to="/" replace />} />
                    <Route path='/profile' element={isAuth ? <Profile /> : <Navigate to="/" replace />} />
                </Routes>
            </Suspense>

            <Footer />
        </div>
    );
};

export default App;