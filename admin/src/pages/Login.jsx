import { useState } from "react";
import { useAdminContext } from "../context/AdminContext";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useDoctorContext } from "../context/DoctorContext";

const Login = () => {

    const credentials = {
        Admin: {
            email: "admin@prescripto.com",
            password: "admin123"
        },
        Doctor: {
            email: "ryan.martinez@gmail.com",
            password: "M8=u9clbTW6z>]Ra"
        }
    };

    const { setIsAdmin } = useAdminContext();
    const { setIsDoctor } = useDoctorContext();

    const [state, setState] = useState("Admin");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(credentials.Admin);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            if (state === "Admin") {
                const { data } = await api.post("/admin/login", { email: formData.email, password: formData.password });

                if (data.success) {
                    toast.success(data.message);
                    setIsAdmin(true);
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await api.post("/doctor/login", { email: formData.email, password: formData.password });

                if (data.success) {
                    toast.success(data.message);
                    setIsDoctor(true);
                } else {
                    toast.error(data.message)
                }
            };
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false)
        };
    };

    return (
        <form onSubmit={handleSubmit} className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-85 sm:min-w-96 border border-gray-300 rounded-sm text-[#5E5E5E] text-sm shadow">
                <p className="text-2xl font-semibold m-auto">
                    <span className="text-primary">{state}</span> Login
                </p>

                <div className="w-full">
                    <label className="block" htmlFor="email">Email <span className="text-red-500">*</span></label>

                    <input className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline focus:outline-primary" type="email" name="email" id="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
                </div>

                <div className="w-full">
                    <label className="block" htmlFor="password">Password <span className="text-red-500">*</span></label>

                    <input className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline focus:outline-primary" type="password" name="password" id="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
                </div>

                <button type="submit" disabled={loading} className="bg-primary text-white w-full py-2 rounded-md cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Logging in...
                        </>
                    ) : (
                        "Login"
                    )}
                </button>

                <p>are you a {state === 'Admin' ? "doctor" : "admin"}? <span className="text-primary underline cursor-pointer" onClick={() => {
                    const newState =
                        state === "Admin"
                            ? "Doctor"
                            : "Admin";

                    setState(newState);
                    setFormData(credentials[newState]);
                }}>{state === 'Admin' ? "Doctor" : "Admin"} Login</span></p>
            </div>
        </form>
    );
};

export default Login;