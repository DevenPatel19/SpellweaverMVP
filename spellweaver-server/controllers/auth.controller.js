import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const ACCESS_TTL = "1h";

export async function signup(req, res, next) {
try {
const { email, password, role, name, npi } = req.body;
if (!email || !password || !role) {
    return res
    .status(400)
    .json({
        error: {
        code: "VALIDATION_ERROR",
        message: "email/password/role required",
        },
    });
}
const existing = await User.findOne({ email });
if (existing)
    return res
    .status(409)
    .json({
        error: { code: "CONFLICT", message: "Email already registered" },
    });

// HASH password (synchronous here for simplicity; non-blocking + production: use async or argon2)
const passwordHash = bcrypt.hashSync(password, 10);

const user = await User.create({
    email,
    passwordHash,
    role,
    name,
    npi: role === "therapist" ? npi : undefined,
});

// If therapist, you would kick off NPI verification here (background job)
return res
    .status(201)
    .json({ id: user._id, email: user.email, role: user.role });
} catch (err) {
next(err);
}
}

export async function login(req, res, next) {
try {
const { email, password } = req.body;
if (!email || !password)
    return res
    .status(400)
    .json({
        error: {
        code: "VALIDATION_ERROR",
        message: "email/password required",
        },
    });

const user = await User.findOne({ email });
if (!user)
    return res
    .status(401)
    .json({
        error: { code: "UNAUTHENTICATED", message: "Invalid credentials" },
    });

const ok = bcrypt.compareSync(password, user.passwordHash);
if (!ok)
    return res
    .status(401)
    .json({
        error: { code: "UNAUTHENTICATED", message: "Invalid credentials" },
    });

const accessToken = jwt.sign(
    { sub: user._id.toString(), role: user.role },
    JWT_SECRET,
    { expiresIn: ACCESS_TTL }
);

return res.json({ accessToken });
} catch (err) {
next(err);
}
}
