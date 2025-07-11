import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DaoContract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const daoContractAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'addSponsorFunds',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_info', internalType: 'string', type: 'string' },
    ],
    name: 'applyForMember',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_info', internalType: 'string', type: 'string' },
    ],
    name: 'applyForReviewer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '',
        internalType: 'enum DaoContract.ProposalType',
        type: 'uint8',
      },
    ],
    name: 'approvalThresholds',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_info', internalType: 'string', type: 'string' },
      { name: '_delegate', internalType: 'bool', type: 'bool' },
    ],
    name: 'becomeSponsor',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_exitNote', internalType: 'string', type: 'string' }],
    name: 'exitMember',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_exitNote', internalType: 'string', type: 'string' }],
    name: 'exitReviewer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_member', internalType: 'address', type: 'address' }],
    name: 'getMemberDetails',
    outputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'info', internalType: 'string', type: 'string' },
      {
        name: 'status',
        internalType: 'enum DaoContract.RoleStatus',
        type: 'uint8',
      },
      { name: 'exitNote', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_status',
        internalType: 'enum DaoContract.RoleStatus',
        type: 'uint8',
      },
    ],
    name: 'getMembers',
    outputs: [
      { name: '', internalType: 'address[]', type: 'address[]' },
      { name: '', internalType: 'string[]', type: 'string[]' },
      { name: '', internalType: 'string[]', type: 'string[]' },
      { name: '', internalType: 'string[]', type: 'string[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_reviewer', internalType: 'address', type: 'address' }],
    name: 'getNotVotedPendingProposals',
    outputs: [
      { name: 'proposalIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'titles', internalType: 'string[]', type: 'string[]' },
      { name: 'proposers', internalType: 'address[]', type: 'address[]' },
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      {
        name: 'targetProposalTypes',
        internalType: 'enum DaoContract.ProposalType[]',
        type: 'uint8[]',
      },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'infos', internalType: 'string[]', type: 'string[]' },
      { name: 'reviewerCounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'thresholds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'forCounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'againstCounts', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: 'statuses',
        internalType: 'enum DaoContract.ProposalStatus[]',
        type: 'uint8[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_proposalType',
        internalType: 'enum DaoContract.ProposalType',
        type: 'uint8',
      },
      {
        name: '_status',
        internalType: 'enum DaoContract.ProposalStatus',
        type: 'uint8',
      },
    ],
    name: 'getProposals',
    outputs: [
      { name: 'proposalIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'titles', internalType: 'string[]', type: 'string[]' },
      { name: 'proposers', internalType: 'address[]', type: 'address[]' },
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      {
        name: 'targetProposalTypes',
        internalType: 'enum DaoContract.ProposalType[]',
        type: 'uint8[]',
      },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'infos', internalType: 'string[]', type: 'string[]' },
      { name: 'reviewerCounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'thresholds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'forCounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'againstCounts', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: 'statuses',
        internalType: 'enum DaoContract.ProposalStatus[]',
        type: 'uint8[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposer', internalType: 'address', type: 'address' }],
    name: 'getProposalsByProposer',
    outputs: [
      { name: 'proposalIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'titles', internalType: 'string[]', type: 'string[]' },
      { name: 'proposers', internalType: 'address[]', type: 'address[]' },
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      {
        name: 'targetProposalTypes',
        internalType: 'enum DaoContract.ProposalType[]',
        type: 'uint8[]',
      },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'infos', internalType: 'string[]', type: 'string[]' },
      { name: 'reviewerCounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'thresholds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'forCounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'againstCounts', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: 'statuses',
        internalType: 'enum DaoContract.ProposalStatus[]',
        type: 'uint8[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_reviewer', internalType: 'address', type: 'address' }],
    name: 'getReviewerDetails',
    outputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'info', internalType: 'string', type: 'string' },
      {
        name: 'status',
        internalType: 'enum DaoContract.RoleStatus',
        type: 'uint8',
      },
      { name: 'exitNote', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_status',
        internalType: 'enum DaoContract.RoleStatus',
        type: 'uint8',
      },
    ],
    name: 'getReviewers',
    outputs: [
      { name: '', internalType: 'address[]', type: 'address[]' },
      { name: '', internalType: 'string[]', type: 'string[]' },
      { name: '', internalType: 'string[]', type: 'string[]' },
      { name: '', internalType: 'string[]', type: 'string[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_sponsor', internalType: 'address', type: 'address' }],
    name: 'getSponsorDetails',
    outputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'info', internalType: 'string', type: 'string' },
      { name: 'isDelegated', internalType: 'bool', type: 'bool' },
      { name: 'totalAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'availableBalance', internalType: 'uint256', type: 'uint256' },
      {
        name: 'status',
        internalType: 'enum DaoContract.RoleStatus',
        type: 'uint8',
      },
      { name: 'exitNote', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_status',
        internalType: 'enum DaoContract.RoleStatus',
        type: 'uint8',
      },
    ],
    name: 'getSponsors',
    outputs: [
      { name: '', internalType: 'address[]', type: 'address[]' },
      { name: '', internalType: 'string[]', type: 'string[]' },
      { name: '', internalType: 'string[]', type: 'string[]' },
      { name: '', internalType: 'bool[]', type: 'bool[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'string[]', type: 'string[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'getVoters',
    outputs: [
      { name: 'voters', internalType: 'address[]', type: 'address[]' },
      { name: 'isApproved', internalType: 'bool[]', type: 'bool[]' },
      { name: 'reasons', internalType: 'string[]', type: 'string[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'memberList',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'members',
    outputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'info', internalType: 'string', type: 'string' },
      {
        name: 'status',
        internalType: 'enum DaoContract.RoleStatus',
        type: 'uint8',
      },
      { name: 'exitNote', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'proposals',
    outputs: [
      {
        name: 'proposalType',
        internalType: 'enum DaoContract.ProposalType',
        type: 'uint8',
      },
      { name: 'title', internalType: 'string', type: 'string' },
      { name: 'proposer', internalType: 'address', type: 'address' },
      { name: 'target', internalType: 'address', type: 'address' },
      {
        name: 'targetProposalType',
        internalType: 'enum DaoContract.ProposalType',
        type: 'uint8',
      },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'info', internalType: 'string', type: 'string' },
      { name: 'reviewerCount', internalType: 'uint256', type: 'uint256' },
      { name: 'threshold', internalType: 'uint256', type: 'uint256' },
      { name: 'forCount', internalType: 'uint256', type: 'uint256' },
      { name: 'againstCount', internalType: 'uint256', type: 'uint256' },
      {
        name: 'status',
        internalType: 'enum DaoContract.ProposalStatus',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_title', internalType: 'string', type: 'string' },
      { name: '_recipient', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_info', internalType: 'string', type: 'string' },
    ],
    name: 'proposeDelegatedFunding',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_title', internalType: 'string', type: 'string' },
      { name: '_recipient', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_info', internalType: 'string', type: 'string' },
    ],
    name: 'proposeDirectFunding',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_type',
        internalType: 'enum DaoContract.ProposalType',
        type: 'uint8',
      },
      { name: '_title', internalType: 'string', type: 'string' },
      { name: '_target', internalType: 'address', type: 'address' },
      { name: '_info', internalType: 'string', type: 'string' },
    ],
    name: 'proposeDistrust',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_title', internalType: 'string', type: 'string' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_info', internalType: 'string', type: 'string' },
    ],
    name: 'proposeFunding',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_type',
        internalType: 'enum DaoContract.ProposalType',
        type: 'uint8',
      },
      { name: '_title', internalType: 'string', type: 'string' },
      { name: '_newThreshold', internalType: 'uint256', type: 'uint256' },
      { name: '_info', internalType: 'string', type: 'string' },
    ],
    name: 'proposeThresholdUpdate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'remainingBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'reviewerCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'reviewerList',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'reviewers',
    outputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'info', internalType: 'string', type: 'string' },
      {
        name: 'status',
        internalType: 'enum DaoContract.RoleStatus',
        type: 'uint8',
      },
      { name: 'exitNote', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'sponsorList',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'sponsors',
    outputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'info', internalType: 'string', type: 'string' },
      { name: 'isDelegated', internalType: 'bool', type: 'bool' },
      { name: 'totalAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'availableBalance', internalType: 'uint256', type: 'uint256' },
      {
        name: 'status',
        internalType: 'enum DaoContract.RoleStatus',
        type: 'uint8',
      },
      { name: 'exitNote', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalDelegatedAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalFundsReceived',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_info', internalType: 'string', type: 'string' },
    ],
    name: 'updateMemberInfo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_info', internalType: 'string', type: 'string' },
    ],
    name: 'updateReviewerInfo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_info', internalType: 'string', type: 'string' },
    ],
    name: 'updateSponsorInfo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_proposalId', internalType: 'uint256', type: 'uint256' },
      { name: '_isApproved', internalType: 'bool', type: 'bool' },
      { name: '_reason', internalType: 'string', type: 'string' },
    ],
    name: 'voteProposal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'voterList',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DelegatedFundingProposed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DirectFundingProposedAndExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposalType',
        internalType: 'enum DaoContract.ProposalType',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DistrustProposed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FundingProposed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'applicant',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      { name: 'info', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'MemberApplied',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'member',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'exitNote',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'MemberExited',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'member',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      { name: 'info', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'MemberInfoUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposalType',
        internalType: 'enum DaoContract.ProposalType',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ProposalExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'isApproved', internalType: 'bool', type: 'bool', indexed: true },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ProposalVoted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'applicant',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      { name: 'info', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ReviewerApplied',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'reviewer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'exitNote',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ReviewerExited',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'reviewer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      { name: 'info', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ReviewerInfoUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sponsor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      { name: 'info', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'SponsorInfoUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sponsor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      { name: 'info', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'isDelegated',
        internalType: 'bool',
        type: 'bool',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SponsorRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposalType',
        internalType: 'enum DaoContract.ProposalType',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newThreshold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ThresholdUpdateProposed',
  },
] as const

/**
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const daoContractAddress = {
  17000: '0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b',
} as const

/**
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const daoContractConfig = {
  address: daoContractAddress,
  abi: daoContractAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContract = /*#__PURE__*/ createUseReadContract({
  abi: daoContractAbi,
  address: daoContractAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"approvalThresholds"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractApprovalThresholds =
  /*#__PURE__*/ createUseReadContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'approvalThresholds',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"getMemberDetails"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractGetMemberDetails =
  /*#__PURE__*/ createUseReadContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'getMemberDetails',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"getMembers"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractGetMembers = /*#__PURE__*/ createUseReadContract(
  {
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'getMembers',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"getNotVotedPendingProposals"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractGetNotVotedPendingProposals =
  /*#__PURE__*/ createUseReadContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'getNotVotedPendingProposals',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"getProposals"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractGetProposals =
  /*#__PURE__*/ createUseReadContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'getProposals',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"getProposalsByProposer"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractGetProposalsByProposer =
  /*#__PURE__*/ createUseReadContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'getProposalsByProposer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"getReviewerDetails"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractGetReviewerDetails =
  /*#__PURE__*/ createUseReadContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'getReviewerDetails',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"getReviewers"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractGetReviewers =
  /*#__PURE__*/ createUseReadContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'getReviewers',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"getSponsorDetails"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractGetSponsorDetails =
  /*#__PURE__*/ createUseReadContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'getSponsorDetails',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"getSponsors"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractGetSponsors =
  /*#__PURE__*/ createUseReadContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'getSponsors',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"getVoters"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractGetVoters = /*#__PURE__*/ createUseReadContract({
  abi: daoContractAbi,
  address: daoContractAddress,
  functionName: 'getVoters',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"memberList"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractMemberList = /*#__PURE__*/ createUseReadContract(
  {
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'memberList',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"members"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractMembers = /*#__PURE__*/ createUseReadContract({
  abi: daoContractAbi,
  address: daoContractAddress,
  functionName: 'members',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"proposalCount"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractProposalCount =
  /*#__PURE__*/ createUseReadContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'proposalCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"proposals"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractProposals = /*#__PURE__*/ createUseReadContract({
  abi: daoContractAbi,
  address: daoContractAddress,
  functionName: 'proposals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"remainingBalance"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractRemainingBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'remainingBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"reviewerCount"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractReviewerCount =
  /*#__PURE__*/ createUseReadContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'reviewerCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"reviewerList"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractReviewerList =
  /*#__PURE__*/ createUseReadContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'reviewerList',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"reviewers"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractReviewers = /*#__PURE__*/ createUseReadContract({
  abi: daoContractAbi,
  address: daoContractAddress,
  functionName: 'reviewers',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"sponsorList"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractSponsorList =
  /*#__PURE__*/ createUseReadContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'sponsorList',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"sponsors"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractSponsors = /*#__PURE__*/ createUseReadContract({
  abi: daoContractAbi,
  address: daoContractAddress,
  functionName: 'sponsors',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"totalDelegatedAmount"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractTotalDelegatedAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'totalDelegatedAmount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"totalFundsReceived"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractTotalFundsReceived =
  /*#__PURE__*/ createUseReadContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'totalFundsReceived',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"voterList"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useReadDaoContractVoterList = /*#__PURE__*/ createUseReadContract({
  abi: daoContractAbi,
  address: daoContractAddress,
  functionName: 'voterList',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link daoContractAbi}__
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWriteDaoContract = /*#__PURE__*/ createUseWriteContract({
  abi: daoContractAbi,
  address: daoContractAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"addSponsorFunds"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWriteDaoContractAddSponsorFunds =
  /*#__PURE__*/ createUseWriteContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'addSponsorFunds',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"applyForMember"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWriteDaoContractApplyForMember =
  /*#__PURE__*/ createUseWriteContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'applyForMember',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"applyForReviewer"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWriteDaoContractApplyForReviewer =
  /*#__PURE__*/ createUseWriteContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'applyForReviewer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"becomeSponsor"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWriteDaoContractBecomeSponsor =
  /*#__PURE__*/ createUseWriteContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'becomeSponsor',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"exitMember"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWriteDaoContractExitMember =
  /*#__PURE__*/ createUseWriteContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'exitMember',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"exitReviewer"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWriteDaoContractExitReviewer =
  /*#__PURE__*/ createUseWriteContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'exitReviewer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"proposeDelegatedFunding"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWriteDaoContractProposeDelegatedFunding =
  /*#__PURE__*/ createUseWriteContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'proposeDelegatedFunding',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"proposeDirectFunding"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWriteDaoContractProposeDirectFunding =
  /*#__PURE__*/ createUseWriteContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'proposeDirectFunding',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"proposeDistrust"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWriteDaoContractProposeDistrust =
  /*#__PURE__*/ createUseWriteContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'proposeDistrust',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"proposeFunding"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWriteDaoContractProposeFunding =
  /*#__PURE__*/ createUseWriteContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'proposeFunding',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"proposeThresholdUpdate"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWriteDaoContractProposeThresholdUpdate =
  /*#__PURE__*/ createUseWriteContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'proposeThresholdUpdate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"updateMemberInfo"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWriteDaoContractUpdateMemberInfo =
  /*#__PURE__*/ createUseWriteContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'updateMemberInfo',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"updateReviewerInfo"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWriteDaoContractUpdateReviewerInfo =
  /*#__PURE__*/ createUseWriteContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'updateReviewerInfo',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"updateSponsorInfo"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWriteDaoContractUpdateSponsorInfo =
  /*#__PURE__*/ createUseWriteContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'updateSponsorInfo',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"voteProposal"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWriteDaoContractVoteProposal =
  /*#__PURE__*/ createUseWriteContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'voteProposal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link daoContractAbi}__
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useSimulateDaoContract = /*#__PURE__*/ createUseSimulateContract({
  abi: daoContractAbi,
  address: daoContractAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"addSponsorFunds"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useSimulateDaoContractAddSponsorFunds =
  /*#__PURE__*/ createUseSimulateContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'addSponsorFunds',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"applyForMember"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useSimulateDaoContractApplyForMember =
  /*#__PURE__*/ createUseSimulateContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'applyForMember',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"applyForReviewer"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useSimulateDaoContractApplyForReviewer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'applyForReviewer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"becomeSponsor"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useSimulateDaoContractBecomeSponsor =
  /*#__PURE__*/ createUseSimulateContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'becomeSponsor',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"exitMember"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useSimulateDaoContractExitMember =
  /*#__PURE__*/ createUseSimulateContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'exitMember',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"exitReviewer"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useSimulateDaoContractExitReviewer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'exitReviewer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"proposeDelegatedFunding"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useSimulateDaoContractProposeDelegatedFunding =
  /*#__PURE__*/ createUseSimulateContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'proposeDelegatedFunding',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"proposeDirectFunding"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useSimulateDaoContractProposeDirectFunding =
  /*#__PURE__*/ createUseSimulateContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'proposeDirectFunding',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"proposeDistrust"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useSimulateDaoContractProposeDistrust =
  /*#__PURE__*/ createUseSimulateContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'proposeDistrust',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"proposeFunding"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useSimulateDaoContractProposeFunding =
  /*#__PURE__*/ createUseSimulateContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'proposeFunding',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"proposeThresholdUpdate"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useSimulateDaoContractProposeThresholdUpdate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'proposeThresholdUpdate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"updateMemberInfo"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useSimulateDaoContractUpdateMemberInfo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'updateMemberInfo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"updateReviewerInfo"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useSimulateDaoContractUpdateReviewerInfo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'updateReviewerInfo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"updateSponsorInfo"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useSimulateDaoContractUpdateSponsorInfo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'updateSponsorInfo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link daoContractAbi}__ and `functionName` set to `"voteProposal"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useSimulateDaoContractVoteProposal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: daoContractAbi,
    address: daoContractAddress,
    functionName: 'voteProposal',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link daoContractAbi}__
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWatchDaoContractEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: daoContractAbi,
    address: daoContractAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link daoContractAbi}__ and `eventName` set to `"DelegatedFundingProposed"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWatchDaoContractDelegatedFundingProposedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: daoContractAbi,
    address: daoContractAddress,
    eventName: 'DelegatedFundingProposed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link daoContractAbi}__ and `eventName` set to `"DirectFundingProposedAndExecuted"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWatchDaoContractDirectFundingProposedAndExecutedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: daoContractAbi,
    address: daoContractAddress,
    eventName: 'DirectFundingProposedAndExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link daoContractAbi}__ and `eventName` set to `"DistrustProposed"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWatchDaoContractDistrustProposedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: daoContractAbi,
    address: daoContractAddress,
    eventName: 'DistrustProposed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link daoContractAbi}__ and `eventName` set to `"FundingProposed"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWatchDaoContractFundingProposedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: daoContractAbi,
    address: daoContractAddress,
    eventName: 'FundingProposed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link daoContractAbi}__ and `eventName` set to `"MemberApplied"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWatchDaoContractMemberAppliedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: daoContractAbi,
    address: daoContractAddress,
    eventName: 'MemberApplied',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link daoContractAbi}__ and `eventName` set to `"MemberExited"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWatchDaoContractMemberExitedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: daoContractAbi,
    address: daoContractAddress,
    eventName: 'MemberExited',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link daoContractAbi}__ and `eventName` set to `"MemberInfoUpdated"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWatchDaoContractMemberInfoUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: daoContractAbi,
    address: daoContractAddress,
    eventName: 'MemberInfoUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link daoContractAbi}__ and `eventName` set to `"ProposalExecuted"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWatchDaoContractProposalExecutedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: daoContractAbi,
    address: daoContractAddress,
    eventName: 'ProposalExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link daoContractAbi}__ and `eventName` set to `"ProposalVoted"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWatchDaoContractProposalVotedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: daoContractAbi,
    address: daoContractAddress,
    eventName: 'ProposalVoted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link daoContractAbi}__ and `eventName` set to `"ReviewerApplied"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWatchDaoContractReviewerAppliedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: daoContractAbi,
    address: daoContractAddress,
    eventName: 'ReviewerApplied',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link daoContractAbi}__ and `eventName` set to `"ReviewerExited"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWatchDaoContractReviewerExitedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: daoContractAbi,
    address: daoContractAddress,
    eventName: 'ReviewerExited',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link daoContractAbi}__ and `eventName` set to `"ReviewerInfoUpdated"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWatchDaoContractReviewerInfoUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: daoContractAbi,
    address: daoContractAddress,
    eventName: 'ReviewerInfoUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link daoContractAbi}__ and `eventName` set to `"SponsorInfoUpdated"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWatchDaoContractSponsorInfoUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: daoContractAbi,
    address: daoContractAddress,
    eventName: 'SponsorInfoUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link daoContractAbi}__ and `eventName` set to `"SponsorRegistered"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWatchDaoContractSponsorRegisteredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: daoContractAbi,
    address: daoContractAddress,
    eventName: 'SponsorRegistered',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link daoContractAbi}__ and `eventName` set to `"ThresholdUpdateProposed"`
 *
 * [__View Contract on Holesky Etherscan__](https://holesky.etherscan.io/address/0x734CEb19cDDAbf7B2e28eb0105bd94c34BE7022b)
 */
export const useWatchDaoContractThresholdUpdateProposedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: daoContractAbi,
    address: daoContractAddress,
    eventName: 'ThresholdUpdateProposed',
  })
