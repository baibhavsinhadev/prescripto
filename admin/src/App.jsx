import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify"
import { useAdminContext } from "./context/AdminContext";
import { useDoctorContext } from "./context/DoctorContext";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import AddDoctor from "./pages/admin/AddDoctor";
import AllAppointments from "./pages/admin/AllAppointments";
import Doctors from "./pages/admin/Doctors";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";

const App = () => {

    const { isAdmin } = useAdminContext();
    const { isDoctor } = useDoctorContext();

    return isAdmin || isDoctor ? (
        isAdmin ? (
            <div className="bg-[#F8F9FD]">
                <ToastContainer />
                <Navbar />

                <div className="flex items-start">
                    <Sidebar />

                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/add" element={<AddDoctor />} />
                        <Route path="/appointments" element={<AllAppointments />} />
                        <Route path="/doctors" element={<Doctors />} />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </div>
        ) : (
            <div className="bg-[#F8F9FD]">
                <ToastContainer />
                <Navbar />

                <div className="flex items-start">
                    <Sidebar />

                    <Routes>
                        <Route path="/" element={<DoctorDashboard />} />
                        <Route path="/profile" element={<DoctorProfile />} />
                        <Route path="/appointments" element={<DoctorAppointments />} />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </div>
        )
    ) : (
        <>
            <Login />
            <ToastContainer />
        </>
    );
};

export default App;