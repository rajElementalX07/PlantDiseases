import { Router } from "express";
const router = Router();

import { farmerRegister, farmerLogin } from "../controllers/authContoller.js";

//-------------------Registration-------------------------

router.post("/farmer-register", farmerRegister);


//---------------------Login--------------------------

router.post("/farmer-login", farmerLogin);


export default router;
