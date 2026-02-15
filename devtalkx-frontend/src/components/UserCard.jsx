const UserCard = ({ user }) => {
  const { firstName, lastName, photoUrl, age, gender, bio, skills, devRole } = user;

  return (
    <div className="card w-96 bg-base-300 shadow-xl m-4">
      <figure className="px-10 pt-10">
        <img src={photoUrl || "https://avatar.iran.liara.run/public/coding"} alt="Dev" className="rounded-xl h-48 w-48 object-cover" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title text-primary">{firstName} {lastName}, {age}</h2>
        <div className="badge badge-secondary">{devRole}</div>
        <p className="italic text-sm">"{bio}"</p>
        <div className="flex flex-wrap justify-center gap-1 my-2">
          {skills?.map((skill) => (
            <div key={skill} className="badge badge-outline">{skill}</div>
          ))}
        </div>
        <div className="card-actions mt-4">
          <button className="btn btn-error btn-outline">Ignore</button>
          <button className="btn btn-success">Interested</button>
        </div>
      </div>
    </div>
  );
};