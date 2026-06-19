// M8=u9clbTW6z>]Re
import { useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import api from "../../api/axios";

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        experience: "1 Year",
        fees: "",
        speciality: "General physician",
        degree: "",
        address1: "",
        address2: "",
        about: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddDoctor = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            if (!docImg) {
                return toast.info("Doctor image is required");
            };

            const docData = new FormData();

            docData.append("image", docImg);

            docData.append("name", formData.name);
            docData.append("email", formData.email);
            docData.append("password", formData.password);
            docData.append("speciality", formData.speciality);
            docData.append("degree", formData.degree);
            docData.append("experience", formData.experience);
            docData.append("about", formData.about);
            docData.append("fees", formData.fees);

            docData.append(
                "address",
                JSON.stringify({
                    line1: formData.address1,
                    line2: formData.address2,
                })
            );

            const { data } = await api.post("/admin/add", docData);

            if (data.success) {
                toast.success(data.message);

                setDocImg(false);
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    experience: "1 Year",
                    fees: "",
                    speciality: "General physician",
                    degree: "",
                    address1: "",
                    address2: "",
                    about: "",
                });
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
        } finally {
            setLoading(false)
        }
    };

    return (
        <form onSubmit={handleAddDoctor} className="m-5 w-full">
            <p className="mb-3 text-lg font-medium">Add Doctor</p>

            <div className="bg-white px-8 py-8 border border-gray-300 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
                <label htmlFor="doc-img" className="flex items-center gap-4 mb-8 text-gray-500">
                    <img src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="upload_area" className="cursor-pointer w-16 h-16 object-cover bg-gray-100 rounded-full" />

                    <input type="file" accept="image/*" id="doc-img" hidden required onChange={(e) => setDocImg(e.target.files[0])} />

                    <p>Upload doctor <br /> image</p>
                </label>

                <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
                    <div className="w-full lg:flex-1 flex flex-col gap-4">
                        <label htmlFor="doc-name" className="flex-1 flex flex-col gap-1">
                            <p>Doctor Name</p>

                            <input name="name" value={formData.name} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 focus:outline-primary" type="text" placeholder="Enter doctor name" id="doc-name" required />
                        </label>

                        <label htmlFor="doc-email" className="flex-1 flex flex-col gap-1">
                            <p>Doctor Email</p>

                            <input name="email" value={formData.email} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 focus:outline-primary" type="email" placeholder="Enter doctor email" id="doc-email" required />
                        </label>

                        <label htmlFor="doc-password" className="flex-1 flex flex-col gap-1">
                            <p>Doctor Password</p>

                            <input name="password" value={formData.password} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 focus:outline-primary" type="password" placeholder="Enter doctor password" id="doc-password" required />
                        </label>

                        <label htmlFor="doc-experience" className="flex-1 flex flex-col gap-1">
                            <p>Doctor Experience</p>

                            <select name="experience" value={formData.experience} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 focus:outline-primary" id="doc-experience">
                                <option value="1 Year">1 Year</option>
                                <option value="2 Year">2 Year</option>
                                <option value="3 Year">3 Year</option>
                                <option value="4 Year">4 Year</option>
                                <option value="5 Year">5 Year</option>
                                <option value="6 Year">6 Year</option>
                                <option value="7 Year">7 Year</option>
                                <option value="8 Year">8 Year</option>
                                <option value="9 Year">9 Year</option>
                                <option value="9+ Year">9+ Year</option>
                            </select>
                        </label>

                        <label htmlFor="doc-fees" className="flex-1 flex flex-col gap-1">
                            <p>Doctor Fees</p>

                            <input name="fees" value={formData.fees} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 focus:outline-primary" type="number" placeholder="Enter doctor fees" id="doc-fees" required />
                        </label>
                    </div>

                    <div className="w-full lg:flex-1 flex flex-col gap-4">
                        <label htmlFor="doc-speciality" className="flex-1 flex flex-col gap-1">
                            <p>Speciality</p>

                            <select name="speciality" value={formData.speciality} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 focus:outline-primary" id="doc-speciality">
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                            </select>
                        </label>

                        <label htmlFor="doc-degree" className="flex-1 flex flex-col gap-1">
                            <p>Doctor Degree</p>

                            <input name="degree" value={formData.degree} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 focus:outline-primary" type="text" placeholder="Enter doctor degree" id="doc-degree" required />
                        </label>

                        <label htmlFor="doc-address1" className="flex-1 flex flex-col gap-1">
                            <p>Doctor Address Line1</p>

                            <input name="address1" value={formData.address1} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 focus:outline-primary" type="text" placeholder="Enter doctor adress line 1" id="doc-address1" required />
                        </label>

                        <label htmlFor="doc-address2" className="flex-1 flex flex-col gap-1">
                            <p>Doctor Address Line2</p>

                            <input name="address2" value={formData.address2} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 focus:outline-primary" type="text" placeholder="Enter doctor adress line 2" id="doc-address2" required />
                        </label>
                    </div>
                </div>

                <label htmlFor="doc-about">
                    <p className="mt-4 mb-2">About Doctor</p>

                    <textarea name="about" value={formData.about} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 pt-2 resize-none focus:outline-primary" rows={5} placeholder="Enter about doctor" id="doc-about" required />
                </label>

                <button type="submit" disabled={loading} className="bg-primary px-10 py-3 mt-4 text-white rounded hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Adding...
                        </>
                    ) : (
                        "Add new doctor"
                    )}
                </button>
            </div>
        </form>
    );
};

export default AddDoctor;