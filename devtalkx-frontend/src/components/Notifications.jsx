import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Notifications = () => {
    const requests = useSelector((store) => store.requests);
    const dispatch = useDispatch();

    const reviewRequest = async (status, _id) => {
        try {
            const res = await axios.post(
                BASE_URL + "/request/review/" + status + "/" + _id,
                {},
                { withCredentials: true }
            );
            dispatch(removeRequest(_id));
        } catch (err) {
            console.error("Error reviewing request:", err);
        }
    };

    const fetchRequests = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/requests/received", {
                withCredentials: true,
            });
            dispatch(addRequests(res.data.data));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    if (!requests) return <div className="p-8 text-center text-slate-400">Loading notifications...</div>;

    if (requests.length === 0) return <div className="p-8 text-center text-slate-400">No new notifications.</div>;

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-slate-400 mb-6">Review your pending connection requests.</p>
            <div className="space-y-4">
                {requests.map((request) => {
                    const { _id, firstName, lastName, photoUrl, devRole, bio } = request.fromUserId;
                    return (
                        <div key={_id} className="bg-[#111827] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 transition-all hover:border-slate-700">
                            <img
                                className="w-16 h-16 rounded-full object-cover border-2 border-slate-800"
                                src={photoUrl || "https://avatar.iran.liara.run/public/coding"}
                                alt="profile"
                            />
                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-lg font-bold text-slate-200">
                                    {firstName + " " + lastName}
                                </h2>
                                <p className="text-sm text-slate-400">{devRole || "Developer"}</p>
                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{bio}</p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                <button
                                    onClick={() => reviewRequest("rejected", request._id)}
                                    className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                                >
                                    Decline
                                </button>
                                <button
                                    onClick={() => reviewRequest("accepted", request._id)}
                                    className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Notifications;
