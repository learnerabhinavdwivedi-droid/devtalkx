import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";

const Feed = () => {
  const [feed, setFeed] = useState(null);
  const user = useSelector((store) => store.user);

  const getFeed = async () => {
    if (feed) return; // Prevent unnecessary re-fetching
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true, // Required to pass JWT
      });
      setFeed(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return null;

  if (feed.length <= 0) {
    return <h1 className="flex justify-center my-10 text-xl">No new developers found! 🚀</h1>;
  }

  return (
    <div className="flex justify-center my-10">
      {/* 🚀 Rendering the first developer in the discovery stack */}
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;