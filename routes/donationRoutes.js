import * as donations from "../controllers/donationController.js";
import { Router } from "express";
import { protect } from "../middlewares/protect.js";
import { adminProtect } from "../middlewares/adminProtect.js";
import { donorProtect } from "../middlewares/donorProtect.js";
import { riderProtect } from "../middlewares/riderProtect.js";

const router = Router();

//Endpoints
router.get("/", adminProtect, donations.getAllDonations);
router.get("/donor-donations", protect, donations.getDonorDonations);
router.get("/delivered-items", protect, donations.getDeliveredItems);

router.post("/", donorProtect, donations.createDonation);
router.get("/filter", protect, donations.donationsFilter);
router.get("/donation-history", donations.donationsHistory);
router.delete("/delete-donation", adminProtect, donations.deleteDonation);

router.patch("/", protect, donations.updateDonationStatus);
router.patch("/update-seeker-id", protect, donations.updateHelpSeekerId);
router.patch("/update-rider-name", protect, donations.updateRiderName);

router.patch("/accept-delivery", protect, donations.updateRiderId);

// router.get("/foodstopickup", donations.pickUpNeedingFood);

export default router;
