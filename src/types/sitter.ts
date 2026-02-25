export interface SitterIdParams {
  sitterId: string;
}

export interface GetSittersQuery {
  page?: string;
  limit?: string;
  keyword?: string;
  pet_type?: string;
  rating?: string;
  experience?: string;
}

export interface GetSittersBody {
  seed: string;
}
