import { Router } from "express";
import AddressController from "../controllers/address.controller";

const AddressRoute = Router();

// GET /location/provinces
AddressRoute.get("/provinces", AddressController.getProvinces);

// GET /location/provinces/:provinceId/districts
AddressRoute.get(
  "/provinces/:provinceId/districts",
  AddressController.getDistrictsByProvince,
);

// GET /location/districts/:districtId/sub-districts
AddressRoute.get(
  "/districts/:districtId/sub-districts",
  AddressController.getSubDistrictsByDistrict,
);

export default AddressRoute;
