require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user');

const fakeUsers = [
    {
        firstName: "Alice",
        lastName: "Johnson",
        emailId: "alice.j@example.com",
        password: "Password@123",
        age: 25,
        gender: "female",
        photoUrl: "https://avatar.iran.liara.run/public/61",
        bio: "Fullstack developer passionate about React and Node.",
        skills: ["React", "Node.js", "MongoDB"],
        devRole: "Fullstack"
    },
    {
        firstName: "Bob",
        lastName: "Smith",
        emailId: "bob.smith@example.com",
        password: "Password@123",
        age: 30,
        gender: "male",
        photoUrl: "https://avatar.iran.liara.run/public/12",
        bio: "Backend specialist focusing on scalable architectures.",
        skills: ["Express", "PostgreSQL", "Docker", "AWS"],
        devRole: "Backend"
    },
    {
        firstName: "Charlie",
        lastName: "Brown",
        emailId: "charlie.b@example.com",
        password: "Password@123",
        age: 22,
        gender: "male",
        photoUrl: "https://avatar.iran.liara.run/public/45",
        bio: "Frontend enthusiast who loves crafting smooth UIs.",
        skills: ["Vue", "Tailwind", "TypeScript"],
        devRole: "Frontend"
    },
    {
        firstName: "Diana",
        lastName: "Prince",
        emailId: "diana.p@example.com",
        password: "Password@123",
        age: 28,
        gender: "female",
        photoUrl: "https://avatar.iran.liara.run/public/72",
        bio: "AI and ML researcher turning data into insights.",
        skills: ["Python", "TensorFlow", "Pandas"],
        devRole: "AI/ML"
    },
    {
        firstName: "Eve",
        lastName: "Adams",
        emailId: "eve.adams@example.com",
        password: "Password@123",
        age: 26,
        gender: "female",
        photoUrl: "https://avatar.iran.liara.run/public/88",
        bio: "DevOps engineer automating all the things.",
        skills: ["Kubernetes", "CI/CD", "Linux"],
        devRole: "DevOps"
    }
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log("Connected to DB, inserting users...");
    let count = 0;
    for (let u of fakeUsers) {
        try {
            const existing = await User.findOne({ emailId: u.emailId });
            if (!existing) {
                const user = new User(u);
                await user.save();
                console.log(`✅ Inserted ${u.firstName} ${u.lastName}`);
                count++;
            } else {
                console.log(`⚠️ Skipped ${u.firstName} (Already exists)`);
            }
        } catch (err) {
            console.log(`❌ Error inserting ${u.firstName}:`, err.message);
        }
    }
    console.log(`🎉 Done! Inserted ${count} new users.`);
    process.exit(0);
}).catch(err => {
    console.error("DB connection error", err);
    process.exit(1);
});
