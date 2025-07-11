import { type Address } from 'viem';

export enum RoleStatus {
  NonExistent = 0,
  Pending = 1,
  Active = 2,
  Rejected = 3,
  Exited = 4,
  Distrusted = 5,
}

export enum ProposalType {
  NonExistent = 0,
  NewMember = 1,
  NewReviewer = 2,
  MemberDistrust = 3,
  ReviewerDistrust = 4,
  SponsorDistrust = 5,
  Funding = 6,
  DirectFunding = 7,
  DelegatedFunding = 8,
  UpdateThreshold = 9,
}

export enum ProposalStatus {
  NonExistent = 0,
  Pending = 1,
  Approved = 2,
  Rejected = 3,
}

// Token symbol constant
export const TOKEN_SYMBOL: string = 'ETH';

// Start number constant
export const DONATION_AMOUNT_START_NUMBER: string = '0.001';

// Default address when no address
export const NO_ADDRESS: Address = '0x';

// Default bigint when no value
export const ZERO_BIGINT: bigint = BigInt(0);
