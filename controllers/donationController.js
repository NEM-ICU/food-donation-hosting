import { pool } from "../config/db.js";
import sendNotification from "../utils/notification.js";

const getAllDonations = async (req, res) => {
  const [result] = await pool.query(
    "SELECT * FROM donations ORDER BY created DESC"
  );
  res.status(200).send({
    donations: result,
  });
};

const getDonorDonations = async (req, res) => {
  const [result] = await pool.query(
    `
    SELECT * 
    FROM donations
    WHERE donor_id = ?;`,
    [req.user.id]
  );
  res.status(200).send({
    donations: result,
  });
};

const getDeliveredItems = async (req, res) => {
  const [result] = await pool.query(
    `
    SELECT * 
    FROM donations
    WHERE rider_id = ? AND stage = 'deliver accepted';`,
    [req.user.id]
  );
  res.status(200).send({
    donations: result,
  });
};

const donationsFilter = async (req, res) => {
  const {stage} = req.query;
  console.log(req.query);
  try {
    const donated_foods = await pool.query(
      "SELECT * FROM donations WHERE `stage` = ? ",
      [stage.toString()]
    );
    res.status(200).send({
      foods: donated_foods[0],
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const donationsHistory = async (req, res) => {
  const { id } = req.query;
  try {
    const donated_foods = await pool.query(
      "SELECT * FROM donations WHERE `donor_id` = ? ",
      [id]
    );
    res.status(200).send({
      foods: donated_foods[0],
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const createDonation = async (req, res) => {
  try {
    const {
      food_name,
      quantity,
      donor_name,
      location,
      donor_phone_no,
      food_img,
      address,
      stage,
    } = req.body;

    if (!food_name || !quantity) {
      throw new Error("This fields are required");
    }

    const donor_id = req.user.id;

    const newUser = await pool.query(
      `
            INSERT INTO donations ( 
            food_name,
            quantity,
            donor_id,
            donor_name,
            location,
            donor_phone_no,
            food_img,
            address,
            stage)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
      [
        food_name,
        quantity,
        req.user.id,
        donor_name,
        location,
        donor_phone_no,
        food_img,
        address,
        stage,
      ]
    );
    res.status(200).send({
      message: "Donation created successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

const updateDonationStatus = async (req, res) => {
  const { food_id, stage } = req.body;

  try {
    const donated_foods = await pool.query(
      `UPDATE donations 
              SET stage = ?
              WHERE food_id = ?
            `,
      [stage, food_id]
    );
    res.status(200).send({
      foods: donated_foods[0],
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }

  sendNotification(food_id, stage, req.user.id);
};

const updateHelpSeekerId = async (req, res) => {
  const { food_id } = req.body;

  try {
    const donated_foods = await pool.query(
      `UPDATE donations 
              SET requested_seeker_id = ?
              WHERE food_id = ?
            `,
      [req.user.id, food_id]
    );
    res.status(200).send({
      foods: donated_foods[0],
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const updateRiderName = async (req, res) => {
  const { food_id, name } = req.body;
  console.log(food_id, name);

  try {
    const donated_foods = await pool.query(
      `UPDATE donations 
              SET rider_name = ?
              WHERE food_id = ?
            `,
      [name, food_id]
    );
    res.status(200).send({
      foods: donated_foods[0],
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const updateRiderId = async (req, res) => {
  const { food_id } = req.body;

  try {
    const donated_foods = await pool.query(
      `UPDATE donations 
              SET rider_id = ?
              WHERE food_id = ?
            `,
      [req.user.id, food_id]
    );
    res.status(200).send({
      foods: donated_foods[0],
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteDonation = async (req, res) => {
  const { food_id } = req.query;
  console.log(food_id);
  try {
    const donated_foods = await pool.query(
      "DELETE FROM donations WHERE food_id = ?",
      [food_id]
    );
    res.status(200).send({});
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export {
  getAllDonations,
  createDonation,
  updateDonationStatus,
  donationsFilter,
  donationsHistory,
  deleteDonation,
  updateHelpSeekerId,
  updateRiderId,
  updateRiderName,
  getDonorDonations,
  getDeliveredItems,
};
