import { useState } from "react";
import { createContext, useContext } from "react";
import api from "../api/axios";
import { useEffect } from "react";

const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {

    const [isDoctor, setIsDoctor] = useState(false);

    // Fetch Is Doctor
    const fetchIsDoctor = async () => {
        try {
            const { data } = await api.get("/doctor/check-doctor-auth");

            if (data.success) {
                setIsDoctor(data.doctor);
            } else {
                setIsDoctor(false);
            }
        } catch (error) {
            setIsDoctor(false)
        };
    };

    useEffect(() => {
        fetchIsDoctor();
    }, [])

    const value = {
        isDoctor, setIsDoctor
    };

    return (
        <DoctorContext.Provider value={value}>
            {children}
        </DoctorContext.Provider>
    );
};

export const useDoctorContext = () => {
    const context = useContext(DoctorContext);
    if (!context) {
        throw new Error("useDoctorContext must be provided within DoctorProvider");
    };

    return context;
};