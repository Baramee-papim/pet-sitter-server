export interface SitterIdParams {
  sitterId: string;
}

export interface GetSitterQuery {
  page?: string;
  limit?: string;
  keyword?: string;
  pet_type?: string;
  rating?: string;
  experience?: string;
}
