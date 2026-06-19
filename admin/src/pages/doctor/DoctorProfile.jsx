import { useEffect, useState } from "react";
import { useDoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/AppContext";
import { ArrowRightIcon, Edit } from "lucide-react"
import api from "../../api/axios";

const PasswordModal = ({ setShowPasswordModal }) => {

    const { setIsDoctor } = useDoctorContext();
    const { navigate } = useAppContext();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        };

        if (formData.newPassword === formData.currentPassword) {
            return toast.error("New password can't be same as new");
        };

        try {
            const { data } = await api.put("/doctor/update-password", {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            if (data.success) {
                toast.success(data.message);
                setShowPasswordModal(false);
                setIsDoctor(false);
                navigate("/")
            };
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-gray-800">Update password</h2>
                <p className="text-sm text-gray-500 mt-1">Enter your current password and choose a new one.</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm text-gray-700">Current Password</label>

                        <input type="password" name="currentPassword" value={formData.currentPassword} placeholder="Enter current password" onChange={handleChange} className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary" required />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">New Password</label>

                        <input type="password" name="newPassword" value={formData.newPassword} placeholder="Enter new password" onChange={handleChange} className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary" required />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Confirm Password</label>

                        <input type="password" name="confirmPassword" value={formData.confirmPassword} placeholder="Confirm new password" onChange={handleChange} className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary" required />
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                        <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                            Cancel
                        </button>

                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DoctorProfile = () => {

    const { isDoctor } = useDoctorContext();
    const { currency } = useAppContext();

    const [profile, setProfile] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setProfile((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvailableChange = (event) => {
        const { name, checked } = event.target;

        setProfile((prev) => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleAddressChange = (event) => {
        const { name, value } = event.target;

        setProfile((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value
            }
        }));
    };

    const fetchProfileData = async () => {
        try {
            const { data } = await api.get("/doctor/profile");

            if (data.success) {
                setProfile(data.profileData);
            };
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    };

    const updateProfile = async () => {
        try {
            const updateData = {
                address: profile.address,
                fees: profile.fees,
                available: profile.available
            };

            const { data } = await api.put("/doctor/update-profile", updateData);

            if (data.success) {
                toast.success(data.message);
                setIsEdit(false);
            };
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            await fetchProfileData();
        }
    };

    useEffect(() => {
        if (isDoctor) {
            fetchProfileData();
        }
    }, [isDoctor]);

    if (!profile) return null;

    return profile && (
        <div>
            <div className="flex flex-col gap-4 m-5">
                <div>
                    <img className="bg-primary/80 w-full sm:max-w-64 rounded-lg" src={profile?.image} alt={profile?.name} />
                </div>

                <div className="flex-1 border border-stone-300 p-8 py-7 rounded-lg bg-white">
                    <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">{profile?.name}</p>

                    <div className="flex items-center justify-between gap-2 mt-1 text-gray-600">
                        <p className="text-sm">{profile?.degree} - {profile?.speciality}</p>

                        <div className="flex items-center gap-2">
                            <button className="py-0.5 px-2 border border-gray-300 rounded-full text-xs">{profile?.experience}</button>

                            <button className={`py-0.5 px-2 border rounded-full text-xs ${profile?.available ? "border-green-300 bg-green-100  text-green-600" : "border-red-300 bg-red-100  text-red-600"}`}>
                                {profile?.available ? "Available" : "Unavailable"}
                            </button>
                        </div>
                    </div>

                    <div>
                        <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">About:</p>

                        <p className="text-sm text-gray-700 max-w-175 mt-1">{profile?.about}</p>
                    </div>

                    <p className="text-gray-600 font-medium mt-4">
                        Appointment fees:{" "}
                        <span className="text-gray-800">
                            {currency}
                            {isEdit ? (
                                <input type="number" onChange={handleChange} value={profile?.fees} name="fees" />
                            ) : profile?.fees}
                        </span>
                    </p>

                    <div className="flex gap-2 py-2">
                        <p>Address:</p>

                        <div className="text-sm text-gray-600">
                            <p>{isEdit ? (
                                <input type="text" onChange={handleAddressChange} value={profile?.address?.line1} name="line1" />
                            ) : profile?.address?.line1}</p>

                            <p>{isEdit ? (
                                <input type="text" onChange={handleAddressChange} value={profile?.address?.line2} name="line2" />
                            ) : profile?.address?.line2}</p>
                        </div>
                    </div>

                    <div className="flex gap-1 pt-2">
                        <input disabled={!isEdit} onClick={handleAvailableChange} name="available" type="checkbox" id="available" checked={profile?.available} />

                        <label htmlFor="available">{profile?.available ? "Available" : "Unavailable"}</label>
                    </div>

                    <button onClick={() => setShowPasswordModal(true)} className="flex items-center justify-between w-full mt-4 px-4 py-3 border border-stone-200 rounded-lg hover:bg-gray-50 transition-all cursor-pointer">
                        <div className="flex  flex-col text-start">
                            <p className="font-medium text-gray-700">Update Password</p>
                            <p className="text-xs text-gray-500">Change your account password</p>
                        </div>

                        <ArrowRightIcon size={14} className="text-primary" />
                    </button>

                    <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
                        {isEdit && (
                            <button onClick={() => setIsEdit(false)} className="px-6 py-3 border border-gray-300 rounded-sm text-gray-600 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
                                Cancel
                            </button>
                        )}

                        <button onClick={isEdit ? updateProfile : () => setIsEdit(true)} className={`px-6 py-3 rounded-sm transition-all duration-300 cursor-pointer ${isEdit ? "bg-primary text-white hover:bg-primary/90" : "border border-primary text-primary hover:bg-primary hover:text-white"}`}>
                            {isEdit ? "Save Information" : "Edit Profile"}
                        </button>
                    </div>
                </div>
            </div>

            {showPasswordModal && (
                <PasswordModal setShowPasswordModal={setShowPasswordModal} />
            )}
        </div >
    );
};

export default DoctorProfile;