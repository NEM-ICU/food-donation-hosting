import { pool } from "../config/db.js";
import nodemailer from "nodemailer";

// Send the Email

const sendMail = async (receiver, subject, message) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "boredape47@gmail.com",
      pass: "ihhmtftzgveiowkq",
    },
  });

  const info = await transporter.sendMail({
    from: "boredape47@gmail.com",
    to: receiver,
    subject: subject,
    text: message,
  });

  console.log(info.messageId, nodemailer.getTestMessageUrl(info));
};

// get data from the database

const getFoodData = async (food_id) => {
  const [result] = await pool.query(
    `
    SELECT * 
    FROM donations
    WHERE food_id = ?`,
    [food_id]
  );

  return result;
};

const getUserData = async (userId) => {
  const [result] = await pool.query(
    `
    SELECT * 
    FROM users
    WHERE id = ?`,
    [userId]
  );

  return result;
};

const getAdminEmail = async (userId) => {
  const [result] = await pool.query(
    `
    SELECT * 
    FROM users
    WHERE role = 'admin'`
  );

  return result;
};

// notification options

const acceptedStageNotification = async (userId, food_id) => {
  const seeker = await getUserData(userId);
  const admin = await getAdminEmail();
  const foodData = await getFoodData(food_id);
  const donor = await getUserData(foodData[0].donor_id);
  console.log(foodData);
  console.log(donor);

  await sendMail(
    admin[0].email,
    "Donation Accepted",
    `
  
  Donations accepted by help seeker.
  
  Food id : ${food_id},
  Helpseeker Name : ${seeker[0].name}, 
  Helpseeker Address : ${seeker[0].address} 

  `
  );

  await sendMail(
    donor[0].email,
    "Donation Accepted",
    `
  Your Donation has accepted, Thank You!
  
  Food id : ${food_id},
  Helpseeker Name : ${seeker[0].name}, 
  Helpseeker Address : ${seeker[0].address} 

  `
  );
};

const diliveryAcceptedStageNotification = async (userId, food_id) => {
  const rider = await getUserData(userId);
  const admin = await getAdminEmail();
  const foodData = await getFoodData(food_id);
  const donor = await getUserData(foodData[0].donor_id);

  await sendMail(
    admin[0].email,
    "Dilivery Accepted",
    ` 
    Dilivery accepted by Rider.
  
    Food id : ${food_id},
    Rider Name : ${rider.name}, 
    Rider Address : ${rider.address} 
    Rider Mobile : ${rider.m_no}

  `
  );

  await sendMail(
    donor[0].email,
    "Dilivery Accepted",
    `
  Your order has accepted for delivery, Thank You!
  
  Food id : ${food_id},
  Rider Name : ${rider.name}, 
  Rider Address : ${rider.address} 
  Rider Mobile : ${rider.mobile}

  `
  );
};

const completedStageNotification = async (userId, food_id) => {
  const rider = await getUserData(userId);
  const admin = await getAdminEmail();
  const foodData = await getFoodData(food_id);
  const donor = await getUserData(foodData[0].donor_id);
  const seeker = await getUserData(foodData[0].requested_seeker_id);

  await sendMail(
    admin[0].email,
    "Donation Delivered Successfully",
    `
    Donation Delivered Successfully.
  
    Food id : ${food_id},
    Rider Name : ${rider[0].name}, 
    Rider Address : ${rider[0].address} 
    Helpseeker Name : ${seeker[0].name}

  `
  );

  await sendMail(
    donor[0].email,
    "Dilivery Accepted",
    `
  Your Donation has Delivered Successfully, Thank You!

  Food id : ${food_id},
  Rider Name : ${rider[0].name}, 
  Rider Address : ${rider[0].address} 
  Helpseeker Name : ${seeker[0].name}

  `
  );
};

// send notification according to stage
const sendNotification = (food_id, stage, userId) => {
  if (stage == "accepted") {
    acceptedStageNotification(userId, food_id);
  } else if (stage == "deliver accepted") {
    diliveryAcceptedStageNotification(userId, food_id);
  } else if (stage == "completed") {
    completedStageNotification(userId, food_id);
  }
};

export default sendNotification;
