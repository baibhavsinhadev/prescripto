import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";
import api from "../api/axios";

const Auth = () => {

    const { isAuth, setIsAuth, navigate } = useAppContext();

    const [state, setState] = useState("register");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAuth = async (event) => {
        event.preventDefault();

        try {
            if (state === "register") {
                const { data } = await api.post("/user/register", {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });

                if (data.success) {
                    toast.success(data.message);
                    setIsAuth(true);
                    navigate("/");
                } else {
                    toast.error(data.message)
                };
            } else {
                const { data } = await api.post("/user/login", {
                    email: formData.email,
                    password: formData.password
                });

                if (data.success) {
                    toast.success(data.message);
                    setIsAuth(true);
                    navigate("/");
                } else {
                    toast.error(data.message)
                };
            };
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
        }
    };

    useEffect(() => {
        if (isAuth) {
            navigate("/");
        };
    }, [isAuth])

    return (
        <main>
            <form onSubmit={handleAuth} className="min-h-[80vh] flex items-center">
                <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-85 sm:min-w-96 border border-gray-300 rounded-sm text-zinc-600 text-sm">
                    <p className="text-2xl font-semibold">{state === 'register' ? "Create account" : "Login now"}</p>
                    <p>Please {state === 'register' ? "register" : "login"} to book appointments</p>

                    <div className="w-full bg-red-50 border border-red-200 text-red-700 text-xs rounded p-2">
                        <span className="font-semibold">*</span> Indicates required fields
                    </div>

                    {state === "register" && (
                        <div className="w-full">
                            <label className="block" htmlFor="name">Full Name <span className="text-red-500">*</span></label>

                            <input className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-primary" type="text" name="name" id="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
                        </div>
                    )}

                    <div className="w-full">
                        <label className="block" htmlFor="email">Email <span className="text-red-500">*</span></label>

                        <input className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-primary" type="email" name="email" id="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="w-full">
                        <label className="block" htmlFor="password">Password <span className="text-red-500">*</span></label>

                        <input className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-primary" type="password" name="password" id="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
                    </div>

                    <button className="bg-primary text-white w-full py-3 rounded-sm hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 mt-2">{state === "register" ? "Create account" : "Login"}</button>

                    {state === 'register' ? (
                        <p className="text-gray-500">Already have an account? <span className="font-medium text-gray-600 hover:underline cursor-pointer" onClick={() => setState("login")}>Click here</span></p>
                    ) : (
                        <p className="text-gray-500">Don't have an account? <span className="font-medium text-gray-600 hover:underline cursor-pointer" onClick={() => setState("register")}>Click here</span></p>
                    )}
                </div>
            </form>
        </main>
    );
};

export default Auth;