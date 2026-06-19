import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import api from "../api/axios";

const NAV_LINKS = [
    { label: "HOME", path: "/" },
    { label: "ALL DOCTORS", path: "/doctors" },
    { label: "ABOUT", path: "/about" },
    { label: "CONTACT", path: "/contact" },
];

const Navbar = () => {

    const { isAuth, setIsAuth, userData } = useAppContext();

    const logout = async () => {
        try {
            const { data } = await api.post("/user/logout");

            if (data.success) {
                setIsAuth(false);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            };
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
        };
    };

    return (
        <nav
            aria-label="Main Navigation"
            className="flex items-center justify-between py-4 mb-5 border-b border-gray-300"
        >
            {/* Logo */}
            <Link to="/" aria-label="Go to homepage">
                <img
                    src={assets.logo}
                    alt="Prescripto Logo"
                    className="w-44 h-auto"
                    width={176}
                    height={48}
                    fetchPriority="high"
                />
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-5 font-medium text-sm">
                {NAV_LINKS.map((link) => (
                    <li key={link.path}>
                        <NavLink
                            to={link.path}
                            aria-label={link.label}
                            className={({ isActive }) =>
                                `flex flex-col items-center py-0.5 transition-colors ${isActive
                                    ? "text-primary font-medium"
                                    : "text-gray-600 hover:text-primary"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span>{link.label}</span>

                                    {isActive && (
                                        <span
                                            aria-hidden="true"
                                            className="mt-1 h-0.5 w-3/5 bg-primary rounded"
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>

            {/* User Actions */}
            <div className="flex items-center gap-4">
                {isAuth ? (
                    <div className="relative group">
                        <button
                            type="button"
                            aria-label="User menu"
                            aria-haspopup="menu"
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <img
                                src={userData?.image}
                                alt="User Profile"
                                className="w-8 h-8 rounded-full object-cover bg-indigo-100"
                                width={32}
                                height={32}
                                loading="lazy"
                                decoding="async"
                            />

                            <img
                                src={assets.dropdown_icon}
                                alt=""
                                aria-hidden="true"
                                className="w-2.5 h-auto"
                                width={10}
                                height={10}
                                loading="lazy"
                                decoding="async"
                            />
                        </button>

                        <div className="absolute top-0 right-0 pt-14 z-20 hidden group-hover:block">
                            <div
                                className="min-w-48 rounded bg-stone-100 p-4 flex flex-col gap-4 text-base font-medium text-gray-600 shadow-md"
                                role="menu"
                            >
                                <Link
                                    to="/profile"
                                    role="menuitem"
                                    className="w-full text-stone-500 hover:text-stone-900"
                                >
                                    Profile
                                </Link>

                                <Link
                                    to="/appointments"
                                    role="menuitem"
                                    className="w-full text-stone-500 hover:text-stone-900"
                                >
                                    Appointments
                                </Link>

                                <button
                                    type="button"
                                    onClick={logout}
                                    className="w-full rounded-sm border border-red-200 bg-red-50 p-2 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-500 hover:border-red-500 hover:text-white active:scale-[0.98]"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link
                        to="/auth"
                        aria-label="Create account"
                        className="bg-primary text-white px-8 py-3 rounded-full text-xs sm:text-sm transition duration-200 hover:scale-105 active:scale-95"
                    >
                        Create Account
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;