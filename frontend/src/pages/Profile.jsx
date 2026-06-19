import { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import api from "../api/axios";

const Profile = () => {

    const { userData, setUserData } = useAppContext();

    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setUserData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddressChange = (event) => {
        const { name, value } = event.target;

        setUserData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value
            }
        }));
    };

    const handleUpdateProfileData = async () => {
        try {
            const formData = new FormData();

            formData.append("name", userData.name);
            formData.append("phone", userData.phone);
            formData.append("address", JSON.stringify(userData.address));
            formData.append("gender", userData.gender);
            formData.append("dob", userData.dob);

            image && formData.append("image", image);

            const { data } = await api.put("/user/update-profile", formData);

            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
        } finally {
            setIsEdit(false);
        };
    };

    return (
        <main className="min-h-[80vh] py-6 sm:py-10">
            <div className="w-full max-w-3xl border border-gray-300 rounded-sm p-4 sm:p-6 md:p-8 text-sm text-zinc-700">
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    {isEdit ? (
                        <label htmlFor="image">
                            <div className="inline-block relative cursor-pointer">
                                <img className="w-36 bg-indigo-100 rounded opacity-75" src={image ? URL.createObjectURL(image) : userData.image} alt={userData.name} />

                                <img className="w-10 absolute bottom-12 right-12" src={image ? "" : assets.upload_icon} />
                            </div>

                            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
                        </label>
                    ) : (
                        <img src={userData.image} alt={userData.name} className="w-28 h-28 sm:w-36 sm:h-36 rounded bg-indigo-100 object-cover border border-gray-400" loading="lazy" decoding="async" />
                    )}

                    <div className="flex-1 w-full text-center sm:text-left">
                        {isEdit ? (
                            <input type="text" name="name" value={userData.name} onChange={handleInputChange} className="text-3xl font-semibold border border-zinc-300 rounded p-2 w-full focus:outline-primary" />
                        ) : (
                            <h1 className="text-3xl font-semibold">
                                {userData.name}
                            </h1>
                        )}
                    </div>
                </div>

                <hr className="my-8 border-gray-300" />

                <section>
                    <h2 className="text-lg font-semibold text-zinc-800 mb-4">CONTACT INFORMATION</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-y-4 gap-x-4">
                        <p className="font-medium">Email:</p>
                        <p className="text-primary">{userData.email}</p>
                        <p className="font-medium">Phone:</p>

                        {isEdit ? (
                            <input type="text" name="phone" value={userData.phone} onChange={handleInputChange} className="border border-zinc-300 rounded p-2 focus:outline-primary" />
                        ) : (
                            <p>{userData.phone}</p>
                        )}

                        <p className="font-medium self-start">Address:</p>

                        {isEdit ? (
                            <div className="space-y-2">
                                <input type="text" name="line1" value={userData.address.line1} onChange={handleAddressChange} className="border border-zinc-300 rounded p-2 w-full focus:outline-primary" />

                                <input type="text" name="line2" value={userData.address.line2} onChange={handleAddressChange} className="border border-zinc-300 rounded p-2 w-full focus:outline-primary" />
                            </div>
                        ) : (
                            <p className="wrap-break-words">
                                {userData.address.line1}
                                <br />
                                {userData.address.line2}
                            </p>
                        )}
                    </div>
                </section>

                <hr className="my-8 border-gray-300" />

                <section>
                    <h2 className="text-lg font-semibold text-zinc-800 mb-4">BASIC INFORMATION</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-y-4 gap-x-4">
                        <p className="font-medium">Gender</p>

                        {isEdit ? (
                            <select name="gender" value={userData.gender === "Not Selected" ? "Male" : userData.gender} onChange={handleInputChange} className="border border-zinc-300 rounded p-2 focus:outline-primary">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Others">Others</option>
                            </select>
                        ) : (
                            <p>{userData.gender}</p>
                        )}

                        <p className="font-medium">Date of Birth</p>

                        {isEdit ? (
                            <input type="date" name="dob" value={userData.dob} onChange={handleInputChange} className="border border-zinc-300 rounded p-2 focus:outline-primary" />
                        ) : (
                            <p>{userData.dob}</p>
                        )}
                    </div>
                </section>

                <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
                    {isEdit && (
                        <button onClick={() => setIsEdit(false)} className="px-6 py-3 border border-gray-300 rounded-sm text-gray-600 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
                            Cancel
                        </button>
                    )}

                    <button onClick={isEdit ? handleUpdateProfileData : () => setIsEdit(true)} className={`px-6 py-3 rounded-sm transition-all duration-300 cursor-pointer ${isEdit ? "bg-primary text-white hover:bg-primary/90" : "border border-primary text-primary hover:bg-primary hover:text-white"}`}>
                        {isEdit ? "Save Information" : "Edit Profile"}
                    </button>
                </div>
            </div>
        </main >
    );
};

export default Profile;