const mongoose = require("mongoose");
const { hashPass } = require("./auth");
const { userSchema, roleSchema } = require("./models/user");

const mongoUri = process.env.MONGODB_URI || "mongodb://admin:password@localhost:27017/ecommerce?authSource=admin";

async function seedDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }

  const Role = mongoose.model("Role", roleSchema);
  const User = mongoose.model("User", userSchema);

  const roleNames = ["admin", "seller", "user"];

  for (const name of roleNames) {
    const existingRole = await Role.findOne({ name });
    if (!existingRole) {
      await Role.create({ name, users: [] });
    }
  }

  const adminRole = await Role.findOne({ name: "admin" });
  const existingAdmin = await User.findOne({ email: "admin@123" });

  if (!existingAdmin && adminRole) {
    const passwordHash = await hashPass("admin@123");
    const adminUser = await User.create({
      username: "admin",
      email: "admin@123",
      password: passwordHash,
      role: adminRole._id,
      name: "Administrator",
      avatar: "",
      phone: "",
      address: {
        country: "",
        province: "",
        city: "",
        postCode: "",
        street: "",
      },
    });

    await Role.findByIdAndUpdate(
      adminRole._id,
      { $addToSet: { users: adminUser._id } },
      { new: true }
    );

    console.log("Seeded default admin user: admin@123 / admin@123");
  }
}

module.exports = { seedDatabase };

if (require.main === module) {
  seedDatabase()
    .then(async () => {
      await mongoose.disconnect();
      console.log("Database seed completed.");
    })
    .catch(async (err) => {
      console.error("Database seed failed:", err);
      await mongoose.disconnect();
      process.exit(1);
    });
}
