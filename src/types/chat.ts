export interface DocumentMetadata {
  tradeName?: string;
  provinceId?: number;
  districtId?: number;
  petTypeIds?: number[];
}

export interface AskChatbotBody {
  query: string;
  topK?: number;
}

export interface AskChatbotResponse {
  query: string;
  introduction: string;
  sitters: {
    sitterId: string;
    tradeName: string;
    description: string;
  }[];
  confidence: "High" | "Medium" | "Low" | null;
}
