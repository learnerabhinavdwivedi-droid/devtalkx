// 🚀 The internal component logic
const UserCard = ({ user }) => {
  if (!user) return null; // Safety check

  const { firstName, lastName, photoUrl, bio, devRole } = user;

  return (
    <div className="card w-96 bg-base-300 shadow-xl border border-primary/20">
      <figure className="px-10 pt-10">
        <img src={photoUrl || "https://via.placeholder.com/150"} alt="profile" className="rounded-xl" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title text-2xl font-bold">{firstName + " " + lastName}</h2>
        <p className="text-primary font-semibold">{devRole}</p>
        <p className="italic">"{bio}"</p>
      </div>
    </div>
  );
};

// 🛠️ THIS IS THE MISSING PART: You must export it as default
export default UserCard;