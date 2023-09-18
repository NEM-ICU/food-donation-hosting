import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const donorProtect = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        let user = await pool.query(
            "SELECT * FROM users WHERE `id` = ? LIMIT 1",
            [decodedToken.userId]
        );
        user = user[0][0];

        console.log(user);
        if (!user) {
            throw new Error("Invalid token");
        }
        console.log("fRUNNirst");

        if (user.role !== "donor" && user.role !== "admin") {
            throw new Error("Invalid User");
        }
        req.user = { id: user.id };
        console.log(req.user);

        next();
    } catch (error) {
        res.status(401).send({ message: error.message });
    }
};

export { donorProtect };
