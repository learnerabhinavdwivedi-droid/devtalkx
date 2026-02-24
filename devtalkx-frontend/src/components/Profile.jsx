import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

export default function Profile() {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        photoUrl: user?.photoUrl || "",
        age: user?.age || "",
        gender: user?.gender || "",
        bio: user?.bio || "",
        skills: user?.skills?.join(", ") || "",
        devRole: user?.devRole || "",
        projectLink: user?.projectLink || "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const payload = {
                ...formData,
                skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
                age: formData.age ? parseInt(formData.age, 10) : undefined,
            };

            const res = await axios.patch(`${BASE_URL}/profile/edit`, payload, {
                withCredentials: true,
            });

            dispatch(addUser(res.data.data));
            setMessage("Profile updated successfully!");
        } catch (err) {
            setError(err.response?.data || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="bg-[#0b1120] min-h-[calc(100vh-64px)] py-8 px-4 text-slate-200">
            <div className="max-w-3xl mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-10">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-2">
                    Edit Profile
                </h1>
                <p className="text-slate-400 mb-8">Update your personal information to help others connect with you.</p>

                {message && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center mb-6">
                        <img
                            src={formData.photoUrl || "https://avatar.iran.liara.run/public/coding"}
                            alt="Profile Preview"
                            className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 bg-slate-800"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Photo URL</label>
                        <input
                            type="url"
                            name="photoUrl"
                            value={formData.photoUrl}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                            placeholder="https://example.com/my-photo.jpg"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                                min="13"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 appearance-none"
                            >
                                <option value="">Select...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="others">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Dev Role</label>
                        <input
                            type="text"
                            name="devRole"
                            value={formData.devRole}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                            placeholder="e.g. Full Stack Developer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Skills (comma-separated)</label>
                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                            placeholder="e.g. React, Node.js, Python"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Project Link / Portfolio</label>
                        <input
                            type="url"
                            name="projectLink"
                            value={formData.projectLink}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                            placeholder="https://github.com/my-project"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="4"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 resize-none"
                            placeholder="Tell us a bit about yourself..."
                        ></textarea>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/40 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
