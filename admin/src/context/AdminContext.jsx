import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {

    const [isAdmin, setIsAdmin] = useState(false);
    const [doctors, setDoctors] = useState([]);

    // Fetch Is Admin
    const fetchIsAdmin = async () => {
        try {
            const { data } = await api.get("/admin/check-admin-auth");

            if (data.success) {
                setIsAdmin(data.admin);
            } else {
                setIsAdmin(false);
            }
        } catch (error) {
            setIsAdmin(false)
        };
    };

    // Fetch All Doctors
    const fetchAllDoctors = async () => {
        try {
            const { data } = await api.get("/admin/list");

            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            };
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
        };
    };

    useEffect(() => {
        fetchIsAdmin();
    }, [])

    useEffect(() => {
        if (isAdmin) {
            fetchAllDoctors();
        }
    }, [isAdmin])

    const value = {
        isAdmin, setIsAdmin, doctors, setDoctors,
        fetchAllDoctors
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdminContext = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdminContext must be provided within AdminProvider");
    };

    return context;
};