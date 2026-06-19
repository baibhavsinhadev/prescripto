import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAdminContext } from "../context/AdminContext";
import { useDoctorContext } from "../context/DoctorContext";

const NAV_ADMIN_LINKS = [
    { label: "Dashboard", path: "/", image: assets.home_icon },
    { label: "Add Doctors", path: "/add", image: assets.add_icon },
    { label: "All Appointments", path: "/appointments", image: assets.appointment_icon },
    { label: "Doctors List", path: "/doctors", image: assets.people_icon },
];

const NAV_DOCTOR_LINKS = [
    { label: "Dashboard", path: "/", image: assets.home_icon },
    { label: "Appointments", path: "/appointments", image: assets.appointment_icon },
    { label: "Profile", path: "/profile", image: assets.people_icon },
];

const Sidebar = () => {

    const { isAdmin } = useAdminContext();
    const { isDoctor } = useDoctorContext();

    return (
        <div className="min-h-screen bg-white border-r border-gray-300 shrink-0">
            {isAdmin ? (
                <div className="text-[#515151]">
                    {NAV_ADMIN_LINKS.map((link) => (
                        <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 ${isActive ? "bg-[#F2F3FF] border-r-4 rounded-r-sm border-primary" : "hover:bg-[#F2F3FF] hover:border-r-4 rounded-r-sm"}`} key={link.label} to={link.path}>
                            <img src={link.image} alt={link.label} />
                            <p className="max-sm:hidden">{link.label}</p>
                        </NavLink>
                    ))}
                </div>
            ) : (
                <div className="text-[#515151]">
                    {NAV_DOCTOR_LINKS.map((link) => (
                        <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 ${isActive ? "bg-[#F2F3FF] border-r-4 rounded-r-sm border-primary" : "hover:bg-[#F2F3FF] hover:border-r-4 rounded-r-sm"}`} key={link.label} to={link.path}>
                            <img src={link.image} alt={link.label} />
                            <p className="max-sm:hidden">{link.label}</p>
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Sidebar;