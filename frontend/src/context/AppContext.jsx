import { createContext, useContext, useEffect, useState } from "react";
import { doctorsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const currency = "$"
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [isAuth, setIsAuth] = useState(false);
    const [userData, setUserData] = useState(null)

    // Fetch Doctors Data
    const fetchDoctorData = async () => {
        try {
            const { data } = await api.get("/doctor/list");

            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            };
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
        }
    };

    // Check user auth
    const checkUserAuth = async () => {
        try {
            const { data } = await api.get("/user/check-user-auth");

            if (data.success) {
                setIsAuth(data.authenticated);
            } else {
                setIsAuth(false)
            };
        } catch (error) {
            setIsAuth(false)
            console.log(error.message);
        };
    };

    // Fetch User Profile Data
    const fetchUserProfileData = async () => {
        try {
            const { data } = await api.get("/user/profile");

            if (data.success) {
                setUserData(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
        };
    };

    useEffect(() => {
        fetchDoctorData();
        checkUserAuth();
    }, [])

    useEffect(() => {
        if (isAuth) {
            fetchUserProfileData();
        } else {
            setUserData(null);
        }
    }, [isAuth])

    const value = {
        doctors, navigate, currency, isAuth,
        setIsAuth, userData, setUserData, fetchDoctorData
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be provided within AppProvider");
    };

    return context;
}