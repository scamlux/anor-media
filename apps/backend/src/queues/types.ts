export interface GeneratePlanJobPayload {
  jobType: "generate-plan";
  projectId: string;
  planId: string;
  actorId: string;
  periodDays: number;
  campaignType: string;
  complianceMode: boolean;
}

export interface GeneratePostJobPayload {
  jobType: "generate-post";
  projectId: string;
  planId: string;
  planItemId: string;
  actorId: string;
  formatType: string;
  additionalComments: string;
  strictNumbersMode: boolean;
  complianceMode: boolean;
}
