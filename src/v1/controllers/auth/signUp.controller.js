const bcrypt = require("bcrypt");
const { asyncHandler } = require("../../../utils/asyncHandler");
const prisma = require("../../../utils/prisma");
const e = require("express");

const signupService = asyncHandler(async (req, res, next) => {
    const { email, password, username } = req.body;
console.log(email, password, username);
    // Validate input
    if (!email || !password || !username) {
        return res.status(400).json({ message: "Email, username, and password are required" });
    }

    try {
        // Check if the email is already in use
        const existingEmail = await prisma.users.findUnique({
            where: { email },
        });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Check if the username is already in use

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the user with default role_id = 1
        const newUser = await prisma.users.create({
            data: {
                email,
                username,
                password_hash: hashedPassword,
                role_id: 1, // Default role
            },
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                role_id: newUser.role_id,
            },
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = signupService;
