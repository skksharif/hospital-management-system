const jwt = require("jsonwebtoken");

// Hardcoded users
const users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin"
  },
  {
    id: 2,
    name: "Dr. John",
    email: "doctor@example.com",
    password: "doc123",
    role: "doctor"
  }
];

// Login controller
const login = (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid email or password" });

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    "secret-key"
  );

  res.json({ token, role: user.role, name: user.name });
};

module.exports = { login };
