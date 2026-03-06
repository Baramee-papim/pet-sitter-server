import { ParamsDictionary } from "express-serve-static-core";

export interface SitterIdParams extends ParamsDictionary {
  sitterId: string;
}

export interface GetSittersQuery {
  page?: string;
  limit?: string;
  keyword?: string;
  pet_type?: string;
  rating?: string;
  experience?: string;
  seed?: string;
}

export interface UpdateSitterBody {
  experience: number;
  tradeName: string;
  petTypeIds: number[];
  introduction?: string | null;
  services?: string | null;
  description?: string | null;
  address: string;
  latitude: number;
  longitude: number;
  provinceId: number;
  districtId: number;
  subDistrictId: number;
  existingImages: {
    url: string;
    order: number;
  }[];
}
