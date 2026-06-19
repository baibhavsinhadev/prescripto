import { useState } from "react";
import { createContext, useContext } from "react";
import api from "../api/axios";
import { useEffect } from "react";

const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {

    const [isDoctor, setIsDoctor] = useState(false);
    const [doctorLoading, setDoctorLoading] = useState(false);

    // Fetch Is Doctor
    const fetchIsDoctor = async () => {
        setDoctorLoading(true)

        try {
            const { data } = await api.get("/doctor/check-doctor-auth");

            if (data.success) {
                setIsDoctor(data.doctor);
            } else {
                setIsDoctor(false);
            }
        } catch (error) {
            setIsDoctor(false)
        } finally {
            setDoctorLoading(false);
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