export interface AdditionalEvidenceRequest {
  ids: string[];
}

export interface AdditionalEvidenceResponse {
  fields: {
    get_additional_evidence: boolean,
    reelaborate: boolean
  };
}
