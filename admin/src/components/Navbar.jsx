import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { useAdminContext } from "../context/AdminContext";
import { useDoctorContext } from "../context/DoctorContext";
import api from "../api/axios";

const Navbar = () => {

    const { isAdmin, setIsAdmin } = useAdminContext();
    const { isDoctor, setIsDoctor } = useDoctorContext();

    const handleLogout = async () => {
        try {
            if (isAdmin) {
                const { data } = await api.post("/admin/logout");

                if (data.success) {
                    toast.success(data.message);
                    setIsAdmin(false);
                }
            } else {
                const { data } = await api.post("/doctor/logout");

                if (data.success) {
                    toast.success(data.message);
                    setIsDoctor(false);
                };
            };
        } catch (error) {
            toast.error(error.response?.data?.message);
        };
    };

    return (
        <nav className="flex justify-between items-center px-4 sm:px-10 py-3 border-b border-gray-300 bg-white">
            <div className="flex items-center gap-3 text-xs">
                <Link to="/">
                    <img src={assets.admin_logo} alt="admin_logo" className="w-36 sm:w-40" />
                </Link>

                <p className="border border-gray-300 px-2.5 py-0.5 rounded-full text-gray-600">{isAdmin ? "Admin" : "Doctor"}</p>
            </div>

            <button onClick={handleLogout} className="bg-primary text-white text-sm px-10 py-2 rounded-full hover:scale-105 active:scale-95 transition-all duration-500 cursor-pointer">Logout</button>
        </nav>
    );
};

export default Navbar;