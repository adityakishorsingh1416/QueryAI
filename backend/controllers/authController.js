import bcrypt from "bcrypt";
import Organization from "../models/Organization.js";

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check if organization already exists
        const existing = await Organization.findOne({ email });

        if (existing) {
            return res.status(409).json({
                message: "Organization already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create organization
        const organization = await Organization.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Organization created successfully",
            organizationId: organization._id
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Signup failed"
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const organization = await Organization.findOne({ email });

        if (!organization) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password with hashed password
        const passwordMatch = await bcrypt.compare(
            password,
            organization.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Store organization ID in session
        req.session.organizationId = organization._id.toString();

        res.json({
            message: "Login successful",
            organizationId: organization._id
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Login failed"
        });
    }
};


const logout = (req, res) => {
    req.session.destroy((error) => {

        if (error) {
            return res.status(500).json({
                message: "Logout failed"
            });
        }

        res.json({
            message: "Logout successful"
        });
    });
};


export {
    signup,
    login,
    logout
};