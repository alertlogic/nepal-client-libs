interface PolicyFeature {
  type: string;
}

export interface Policy {
  name: string;
  id: string;
  product_family: string;
  features: PolicyFeature[];
  udr_type: string;
  policy_rank: number;
}
