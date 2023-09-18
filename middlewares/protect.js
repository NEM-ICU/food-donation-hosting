import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const protect = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        // console.log(token);

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        let user = await pool.query(
            "SELECT * FROM users WHERE `id` = ? LIMIT 1",
            [decodedToken.userId]
        );
        user = user[0][0];

        if (!user) {
            throw new Error("Invalid token");
        }

        req.user = { id: user.id };

        next();
    } catch (error) {
        res.status(401).send({ message: error.message });
    }
};

export { protect };
