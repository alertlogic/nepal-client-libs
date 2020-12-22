export interface AdditionalEvidenceRequest {
  ids: string[];
}

export interface AdditionalEvidenceResponse {
  get_additional_evidence: boolean;
  reelaborate: boolean;
}
