import User from "../models/user.js";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { cloudinary } from "../config/cloudinary.js";
import { pool } from "../config/db.js";

const create = async (req, res) => {
    const result = await pool.query("SELECT * FROM users");
    console.log(result[0]);

    res.status(200).send({
        message: "Account created successfully!",
        user: result[0],
    });
};

const createUser = async (req, res) => {
    try {
        const {
            username,
            name,
            email,
            password,
            location,
            address,
            v_type,
            id_num,
            role,
            m_no,
        } = req.body;

        if (!username || !email || !password) {
            throw new Error("This fields are required");
        }

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE `username` = ? AND `email` = ? LIMIT 1",
            [username, email]
        );

        console.log(existingUser[0].length);

        if (!existingUser[0].length === 0) {
            throw new Error("User already exist with this cridentials");
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await pool.query(
            `
            INSERT INTO users (username,name, email, password, location, address, v_type, id_num, role,m_no)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                username,
                name,
                email,
                hashedPassword,
                location,
                address,
                v_type,
                id_num,
                role,
                m_no,
            ]
        );
        res.status(200).send({
            message: "Account created successfully!",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await pool.query(
            "SELECT * FROM users WHERE `email` = ? LIMIT 1",
            [email]
        );
        user = user[0][0];
        console.log(user);

        if (!user) {
            throw new Error(
                "Sorry, the username or password you entered does not match our records."
            );
        }
        //comparing the user passwords
        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            throw new Error(
                "Sorry, the username or password you entered does not match our records."
            );
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                username: user.username,
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );
        const role = user.role;
        const name = user.name;

        res.status(200).send({
            token,
            role,
            name,
        });
    } catch (error) {
        console.log(error.message);
        res.status(401).send({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;

        // console.log(userId);

        if (userId.toString() !== id) {
            throw new Error("You can only update your account!");
        }

        let profileUrl = "";

        if (req.file) {
            //check if the profile picture was provied

            const image = await cloudinary.uploader.upload(req.file.path);

            profileUrl = image.secure_url; //get the secure url of the uploaded image
        }

        const { profilePic, ...others } = req.body;

        const updatedFields = { ...others }; //create a copy if the others files

        if (profileUrl) {
            //add the profile image to the update files
            updatedFields.profilePicture = profileUrl;
        }

        //update the user in the database
        const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
            new: true,
        });

        res.status(200).send({ user: updatedUser });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const updateUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const { currentPassword, newPassword } = req.body;

        if (userId.toString() !== id) {
            throw new Error("You can only update your account!");
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        const isMatch = await compare(currentPassword, user.password);

        if (!isMatch) {
            throw new Error("Passwords don't match");
        }

        const hashePassword = await hash(newPassword, 10);

        user.password = hashePassword;

        user.save();
        res.status(200).send({ message: "Password updated succesfully!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const getUser = async (req, res) => {
    const { id } = req.query;
    try {
        const [result] = await pool.query(
            "SELECT name, location , address, m_no FROM users WHERE `id` = ? ",
            [id]
        );

        res.status(200).send({
            user: result,
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;

        if (userId.toString() !== id) {
            throw new Error("You can only delete your profile");
        }

        await User.findByIdAndDelete(userId);

        res.status(200).send({ message: "Account Deleted" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export {
    create,
    createUser,
    loginUser,
    updateUser,
    updateUserPassword,
    getUser,
    deleteUser,
};
