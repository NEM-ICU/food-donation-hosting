import mysql from "mysql2";

let pool;

const connectDB = async () => {
  try {
    pool = mysql
      .createPool({
        host: "localhost",
        user: "root",
        password: "MyNewPass1!",
        database: "joining_hands",
        port: 3306,
      })
      .promise();
    console.log("database connected");
  } catch (error) {
    console.log(error.message);
  }
};

export { connectDB, pool };
