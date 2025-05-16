const jwt = require("jsonwebtoken");

const users = [
  {
    id: 2,
    name: "Doctor",
    email: "doctor@example.com",
    password: "doc123",
    role: "doctor"
  },
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
