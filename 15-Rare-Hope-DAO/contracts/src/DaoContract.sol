// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';

contract DaoContract {
  struct Member {
    string name;
    string info;
    RoleStatus status;
    string exitNote;
  }

  struct Reviewer {
    string name;
    string info;
    RoleStatus status;
    string exitNote;
  }

  struct Sponsor {
    string name;
    string info;
    bool isDelegated;
    uint256 totalAmount;
    uint256 availableBalance;
    RoleStatus status;
    string exitNote;
  }

  struct Proposal {
    ProposalType proposalType;
    string title;
    address proposer;
    address target;
    ProposalType targetProposalType;
    uint256 amount;
    string info;
    uint256 reviewerCount;
    uint256 threshold;
    uint256 forCount;
    uint256 againstCount;
    ProposalStatus status;
    mapping(address => bool) isVoted;
    mapping(address => bool) isApproved;
    mapping(address => string) reason;
  }

  enum ProposalType {
    NonExistent,
    NewMember,
    NewReviewer,
    MemberDistrust,
    ReviewerDistrust,
    SponsorDistrust,
    Funding,
    DirectFunding,
    DelegatedFunding,
    UpdateThreshold
  }

  enum ProposalStatus {
    NonExistent,
    Pending,
    Approved,
    Rejected
  }

  enum RoleStatus {
    NonExistent,
    Pending,
    Active,
    Rejected,
    Exited,
    Distrusted
  }

  mapping(address => Member) public members;
  mapping(address => Reviewer) public reviewers;
  mapping(address => Sponsor) public sponsors;
  mapping(uint256 => address[]) public voterList;

  address[] public memberList;
  address[] public reviewerList;
  address[] public sponsorList;

  uint256 public totalFundsReceived;
  uint256 public totalDelegatedAmount;
  uint256 public remainingBalance;

  mapping(uint256 => Proposal) public proposals;
  uint256 public proposalCount;

  mapping(ProposalType => uint256) public approvalThresholds;
  uint256 public reviewerCount;

  event MemberApplied(
    uint256 proposalId,
    address indexed applicant,
    string name,
    string info
  );
  event ReviewerApplied(
    uint256 proposalId,
    address indexed applicant,
    string name,
    string info
  );
  event SponsorRegistered(
    address indexed sponsor,
    string name,
    string info,
    bool indexed isDelegated,
    uint256 amount
  );
  event MemberInfoUpdated(address indexed member, string name, string info);
  event ReviewerInfoUpdated(address indexed reviewer, string name, string info);
  event SponsorInfoUpdated(address indexed sponsor, string name, string info);
  event MemberExited(address indexed member, string name, string exitNote);
  event ReviewerExited(address indexed reviewer, string name, string exitNote);
  event FundingProposed(
    uint256 proposalId,
    address indexed proposer,
    uint256 amount
  );
  event DirectFundingProposedAndExecuted(
    uint256 proposalId,
    address indexed proposer,
    address indexed target,
    uint256 amount
  );
  event DelegatedFundingProposed(
    uint256 proposalId,
    address indexed proposer,
    address indexed target,
    uint256 amount
  );
  event DistrustProposed(
    uint256 proposalId,
    ProposalType indexed proposalType,
    address indexed proposer,
    address indexed target
  );
  event ThresholdUpdateProposed(
    uint256 proposalId,
    ProposalType indexed proposalType,
    address indexed proposer,
    uint256 newThreshold
  );
  event ProposalVoted(
    uint256 indexed proposalId,
    address voter,
    bool indexed isApproved,
    string reason
  );
  event ProposalExecuted(
    uint256 proposalId,
    ProposalType indexed proposalType,
    address indexed proposer
  );

  modifier onlyMember() {
    require(
      members[msg.sender].status == RoleStatus.Active,
      'Not an active member'
    );
    _;
  }

  modifier onlyReviewer() {
    require(
      reviewers[msg.sender].status == RoleStatus.Active,
      'Not an active reviewer'
    );
    _;
  }

  modifier onlySponsor() {
    require(
      sponsors[msg.sender].status == RoleStatus.Active,
      'Not an active sponsor'
    );
    _;
  }

  constructor() {
    approvalThresholds[ProposalType.NewMember] = 80;
    approvalThresholds[ProposalType.NewReviewer] = 100;
    approvalThresholds[ProposalType.MemberDistrust] = 80;
    approvalThresholds[ProposalType.ReviewerDistrust] = 80;
    approvalThresholds[ProposalType.SponsorDistrust] = 80;
    approvalThresholds[ProposalType.Funding] = 80;
    approvalThresholds[ProposalType.DelegatedFunding] = 80;
    approvalThresholds[ProposalType.UpdateThreshold] = 100;

    reviewers[msg.sender].name = 'Contract Creator';
    reviewers[msg.sender].info = 'Contract Creator';
    reviewers[msg.sender].status = RoleStatus.Active;
    reviewerList.push(msg.sender);
    reviewerCount = 1;
  }

  function getMembers(
    RoleStatus _status
  )
    public
    view
    returns (
      address[] memory,
      string[] memory,
      string[] memory,
      string[] memory
    )
  {
    uint256 count = 0;
    for (uint256 i = 0; i < memberList.length; i++) {
      if (members[memberList[i]].status == _status) {
        count++;
      }
    }

    address[] memory addresses = new address[](count);
    string[] memory names = new string[](count);
    string[] memory infos = new string[](count);
    string[] memory exitNotes = new string[](count);

    uint256 index = 0;
    for (uint256 i = 0; i < memberList.length; i++) {
      if (members[memberList[i]].status == _status) {
        addresses[index] = memberList[i];
        names[index] = members[memberList[i]].name;
        infos[index] = members[memberList[i]].info;
        exitNotes[index] = members[memberList[i]].exitNote;
        index++;
      }
    }
    return (addresses, names, infos, exitNotes);
  }

  function getSponsors(
    RoleStatus _status
  )
    public
    view
    returns (
      address[] memory,
      string[] memory,
      string[] memory,
      bool[] memory,
      uint256[] memory,
      uint256[] memory,
      string[] memory
    )
  {
    uint256 count = 0;
    for (uint256 i = 0; i < sponsorList.length; i++) {
      if (sponsors[sponsorList[i]].status == _status) {
        count++;
      }
    }

    address[] memory addresses = new address[](count);
    string[] memory names = new string[](count);
    string[] memory infos = new string[](count);
    bool[] memory isDelegated = new bool[](count);
    uint256[] memory totalAmounts = new uint256[](count);
    uint256[] memory availableBalances = new uint256[](count);
    string[] memory exitNotes = new string[](count);

    uint256 index = 0;
    for (uint256 i = 0; i < sponsorList.length; i++) {
      if (sponsors[sponsorList[i]].status == _status) {
        addresses[index] = sponsorList[i];
        names[index] = sponsors[sponsorList[i]].name;
        infos[index] = sponsors[sponsorList[i]].info;
        isDelegated[index] = sponsors[sponsorList[i]].isDelegated;
        totalAmounts[index] = sponsors[sponsorList[i]].totalAmount;
        availableBalances[index] = sponsors[sponsorList[i]].availableBalance;
        exitNotes[index] = sponsors[sponsorList[i]].exitNote;
        index++;
      }
    }
    return (
      addresses,
      names,
      infos,
      isDelegated,
      totalAmounts,
      availableBalances,
      exitNotes
    );
  }

  function getReviewers(
    RoleStatus _status
  )
    public
    view
    returns (
      address[] memory,
      string[] memory,
      string[] memory,
      string[] memory
    )
  {
    uint256 count = 0;
    for (uint256 i = 0; i < reviewerList.length; i++) {
      if (reviewers[reviewerList[i]].status == _status) {
        count++;
      }
    }

    address[] memory addresses = new address[](count);
    string[] memory names = new string[](count);
    string[] memory infos = new string[](count);
    string[] memory exitNotes = new string[](count);

    uint256 index = 0;
    for (uint256 i = 0; i < reviewerList.length; i++) {
      if (reviewers[reviewerList[i]].status == _status) {
        addresses[index] = reviewerList[i];
        names[index] = reviewers[reviewerList[i]].name;
        infos[index] = reviewers[reviewerList[i]].info;
        exitNotes[index] = reviewers[reviewerList[i]].exitNote;
        index++;
      }
    }
    return (addresses, names, infos, exitNotes);
  }

  function getMemberDetails(
    address _member
  )
    public
    view
    returns (
      string memory name,
      string memory info,
      RoleStatus status,
      string memory exitNote
    )
  {
    Member memory member = members[_member];
    return (member.name, member.info, member.status, member.exitNote);
  }

  function getSponsorDetails(
    address _sponsor
  )
    public
    view
    returns (
      string memory name,
      string memory info,
      bool isDelegated,
      uint256 totalAmount,
      uint256 availableBalance,
      RoleStatus status,
      string memory exitNote
    )
  {
    Sponsor memory sponsor = sponsors[_sponsor];
    return (
      sponsor.name,
      sponsor.info,
      sponsor.isDelegated,
      sponsor.totalAmount,
      sponsor.availableBalance,
      sponsor.status,
      sponsor.exitNote
    );
  }

  function getReviewerDetails(
    address _reviewer
  )
    public
    view
    returns (
      string memory name,
      string memory info,
      RoleStatus status,
      string memory exitNote
    )
  {
    Reviewer memory reviewer = reviewers[_reviewer];
    return (reviewer.name, reviewer.info, reviewer.status, reviewer.exitNote);
  }

  function getProposals(
    ProposalType _proposalType,
    ProposalStatus _status
  )
    public
    view
    returns (
      uint256[] memory proposalIds,
      string[] memory titles,
      address[] memory proposers,
      address[] memory targets,
      ProposalType[] memory targetProposalTypes,
      uint256[] memory amounts,
      string[] memory infos,
      uint256[] memory reviewerCounts,
      uint256[] memory thresholds,
      uint256[] memory forCounts,
      uint256[] memory againstCounts,
      ProposalStatus[] memory statuses
    )
  {
    uint256 count = 0;
    for (uint256 i = 1; i <= proposalCount; i++) {
      if (
        proposals[i].proposalType == _proposalType &&
        proposals[i].status == _status
      ) {
        count++;
      }
    }

    proposalIds = new uint256[](count);
    titles = new string[](count);
    proposers = new address[](count);
    targets = new address[](count);
    targetProposalTypes = new ProposalType[](count);
    amounts = new uint256[](count);
    infos = new string[](count);
    reviewerCounts = new uint256[](count);
    thresholds = new uint256[](count);
    forCounts = new uint256[](count);
    againstCounts = new uint256[](count);
    statuses = new ProposalStatus[](count);

    uint256 index = 0;
    for (uint256 i = 1; i <= proposalCount; i++) {
      if (
        proposals[i].proposalType == _proposalType &&
        proposals[i].status == _status
      ) {
        proposalIds[index] = i;
        titles[index] = proposals[i].title;
        proposers[index] = proposals[i].proposer;
        targets[index] = proposals[i].target;
        targetProposalTypes[index] = proposals[i].targetProposalType;
        amounts[index] = proposals[i].amount;
        infos[index] = proposals[i].info;
        reviewerCounts[index] = proposals[i].reviewerCount;
        thresholds[index] = proposals[i].threshold;
        forCounts[index] = proposals[i].forCount;
        againstCounts[index] = proposals[i].againstCount;
        statuses[index] = proposals[i].status;
        index++;
      }
    }
    return (
      proposalIds,
      titles,
      proposers,
      targets,
      targetProposalTypes,
      amounts,
      infos,
      reviewerCounts,
      thresholds,
      forCounts,
      againstCounts,
      statuses
    );
  }

  function getNotVotedPendingProposals(
    address _reviewer
  )
    public
    view
    returns (
      uint256[] memory proposalIds,
      string[] memory titles,
      address[] memory proposers,
      address[] memory targets,
      ProposalType[] memory targetProposalTypes,
      uint256[] memory amounts,
      string[] memory infos,
      uint256[] memory reviewerCounts,
      uint256[] memory thresholds,
      uint256[] memory forCounts,
      uint256[] memory againstCounts,
      ProposalStatus[] memory statuses
    )
  {
    require(
      reviewers[_reviewer].status == RoleStatus.Active,
      'Not an active reviewer'
    );

    uint256 count = 0;
    for (uint256 i = 1; i <= proposalCount; i++) {
      if (
        proposals[i].status == ProposalStatus.Pending &&
        !proposals[i].isVoted[_reviewer]
      ) {
        count++;
      }
    }

    proposalIds = new uint256[](count);
    titles = new string[](count);
    proposers = new address[](count);
    targets = new address[](count);
    targetProposalTypes = new ProposalType[](count);
    amounts = new uint256[](count);
    infos = new string[](count);
    reviewerCounts = new uint256[](count);
    thresholds = new uint256[](count);
    forCounts = new uint256[](count);
    againstCounts = new uint256[](count);
    statuses = new ProposalStatus[](count);

    uint256 index = 0;
    for (uint256 i = 1; i <= proposalCount; i++) {
      if (
        proposals[i].status == ProposalStatus.Pending &&
        !proposals[i].isVoted[_reviewer]
      ) {
        proposalIds[index] = i;
        titles[index] = proposals[i].title;
        proposers[index] = proposals[i].proposer;
        targets[index] = proposals[i].target;
        targetProposalTypes[index] = proposals[i].targetProposalType;
        amounts[index] = proposals[i].amount;
        infos[index] = proposals[i].info;
        reviewerCounts[index] = proposals[i].reviewerCount;
        thresholds[index] = proposals[i].threshold;
        forCounts[index] = proposals[i].forCount;
        againstCounts[index] = proposals[i].againstCount;
        statuses[index] = proposals[i].status;
        index++;
      }
    }
    return (
      proposalIds,
      titles,
      proposers,
      targets,
      targetProposalTypes,
      amounts,
      infos,
      reviewerCounts,
      thresholds,
      forCounts,
      againstCounts,
      statuses
    );
  }

  function getProposalsByProposer(
    address _proposer
  )
    public
    view
    returns (
      uint256[] memory proposalIds,
      string[] memory titles,
      address[] memory proposers,
      address[] memory targets,
      ProposalType[] memory targetProposalTypes,
      uint256[] memory amounts,
      string[] memory infos,
      uint256[] memory reviewerCounts,
      uint256[] memory thresholds,
      uint256[] memory forCounts,
      uint256[] memory againstCounts,
      ProposalStatus[] memory statuses
    )
  {
    uint256 count = 0;
    for (uint256 i = 1; i <= proposalCount; i++) {
      if (proposals[i].proposer == _proposer) {
        count++;
      }
    }

    proposalIds = new uint256[](count);
    titles = new string[](count);
    proposers = new address[](count);
    targets = new address[](count);
    targetProposalTypes = new ProposalType[](count);
    amounts = new uint256[](count);
    infos = new string[](count);
    reviewerCounts = new uint256[](count);
    thresholds = new uint256[](count);
    forCounts = new uint256[](count);
    againstCounts = new uint256[](count);
    statuses = new ProposalStatus[](count);

    uint256 index = 0;
    for (uint256 i = 1; i <= proposalCount; i++) {
      if (proposals[i].proposer == _proposer) {
        proposalIds[index] = i;
        titles[index] = proposals[i].title;
        proposers[index] = proposals[i].proposer;
        targets[index] = proposals[i].target;
        targetProposalTypes[index] = proposals[i].targetProposalType;
        amounts[index] = proposals[i].amount;
        infos[index] = proposals[i].info;
        reviewerCounts[index] = proposals[i].reviewerCount;
        thresholds[index] = proposals[i].threshold;
        forCounts[index] = proposals[i].forCount;
        againstCounts[index] = proposals[i].againstCount;
        statuses[index] = proposals[i].status;
        index++;
      }
    }
    return (
      proposalIds,
      titles,
      proposers,
      targets,
      targetProposalTypes,
      amounts,
      infos,
      reviewerCounts,
      thresholds,
      forCounts,
      againstCounts,
      statuses
    );
  }

  function getVoters(
    uint256 _proposalId
  )
    public
    view
    returns (
      address[] memory voters,
      bool[] memory isApproved,
      string[] memory reasons
    )
  {
    address[] memory voterAddresses = voterList[_proposalId];
    voters = new address[](voterAddresses.length);
    isApproved = new bool[](voterAddresses.length);
    reasons = new string[](voterAddresses.length);

    for (uint256 i = 0; i < voterAddresses.length; i++) {
      voters[i] = voterAddresses[i];
      isApproved[i] = proposals[_proposalId].isApproved[voterAddresses[i]];
      reasons[i] = proposals[_proposalId].reason[voterAddresses[i]];
    }

    return (voters, isApproved, reasons);
  }

  function applyForMember(string memory _name, string memory _info) public {
    require(
      members[msg.sender].status != RoleStatus.Pending,
      'Already applied'
    );
    require(
      members[msg.sender].status != RoleStatus.Active,
      'Already an active member'
    );
    require(
      (members[msg.sender].status != RoleStatus.Rejected) &&
        (members[msg.sender].status != RoleStatus.Distrusted),
      'Not qualified'
    );
    proposalCount++;
    proposals[proposalCount].proposalType = ProposalType.NewMember;
    proposals[proposalCount].proposer = msg.sender;
    proposals[proposalCount].info = _info;
    proposals[proposalCount].reviewerCount = reviewerCount;
    proposals[proposalCount].threshold = approvalThresholds[
      ProposalType.NewMember
    ];
    proposals[proposalCount].status = ProposalStatus.Pending;
    emit MemberApplied(proposalCount, msg.sender, _name, _info);
  }

  function applyForReviewer(string memory _name, string memory _info) public {
    require(
      reviewers[msg.sender].status != RoleStatus.Pending,
      'Already applied'
    );
    require(
      reviewers[msg.sender].status != RoleStatus.Active,
      'Already an active reviewer'
    );
    require(
      (reviewers[msg.sender].status != RoleStatus.Rejected) &&
        (reviewers[msg.sender].status != RoleStatus.Distrusted),
      'Not qualified'
    );
    proposalCount++;
    proposals[proposalCount].proposalType = ProposalType.NewReviewer;
    proposals[proposalCount].proposer = msg.sender;
    proposals[proposalCount].info = _info;
    proposals[proposalCount].reviewerCount = reviewerCount;
    proposals[proposalCount].threshold = approvalThresholds[
      ProposalType.NewReviewer
    ];
    proposals[proposalCount].status = ProposalStatus.Pending;
    emit ReviewerApplied(proposalCount, msg.sender, _name, _info);
  }

  function becomeSponsor(
    string memory _name,
    string memory _info,
    bool _delegate
  ) public payable {
    require(
      sponsors[msg.sender].status != RoleStatus.Active,
      'Already an active sponsor'
    );
    require(
      sponsors[msg.sender].status != RoleStatus.Distrusted,
      'Not qualified'
    );
    require(msg.value > 0, 'Must send funds');

    totalFundsReceived += msg.value;

    sponsors[msg.sender] = Sponsor({
      name: _name,
      info: _info,
      isDelegated: _delegate,
      totalAmount: msg.value,
      availableBalance: _delegate ? 0 : msg.value,
      status: RoleStatus.Active,
      exitNote: ''
    });

    sponsorList.push(msg.sender);

    if (_delegate) {
      totalDelegatedAmount += msg.value;
      remainingBalance += msg.value;
    }

    emit SponsorRegistered(msg.sender, _name, _info, _delegate, msg.value);
  }

  function updateMemberInfo(
    string memory _name,
    string memory _info
  ) public onlyMember {
    members[msg.sender].name = _name;
    members[msg.sender].info = _info;
    emit MemberInfoUpdated(msg.sender, _name, _info);
  }

  function exitMember(string memory _exitNote) public onlyMember {
    members[msg.sender].exitNote = _exitNote;
    string memory name = members[msg.sender].name;
    members[msg.sender].status = RoleStatus.Exited;
    emit MemberExited(msg.sender, name, _exitNote);
  }

  function proposeFunding(
    string memory _title,
    uint256 _amount,
    string memory _info
  ) public onlyMember {
    require(_amount <= remainingBalance, 'Insufficient delegated funds');
    proposalCount++;
    proposals[proposalCount].proposalType = ProposalType.Funding;
    proposals[proposalCount].title = _title;
    proposals[proposalCount].proposer = msg.sender;
    proposals[proposalCount].amount = _amount;
    proposals[proposalCount].info = _info;
    proposals[proposalCount].reviewerCount = reviewerCount;
    proposals[proposalCount].threshold = approvalThresholds[
      ProposalType.Funding
    ];
    proposals[proposalCount].status = ProposalStatus.Pending;
    emit FundingProposed(proposalCount, msg.sender, _amount);
  }

  function updateSponsorInfo(
    string memory _name,
    string memory _info
  ) public onlySponsor {
    sponsors[msg.sender].name = _name;
    sponsors[msg.sender].info = _info;
    emit SponsorInfoUpdated(msg.sender, _name, _info);
  }

  function addSponsorFunds() public payable onlySponsor {
    require(msg.value > 0, 'Must send funds');

    sponsors[msg.sender].totalAmount += msg.value;
    totalFundsReceived += msg.value;

    if (sponsors[msg.sender].isDelegated) {
      totalDelegatedAmount += msg.value;
      remainingBalance += msg.value;
    } else {
      sponsors[msg.sender].availableBalance += msg.value;
    }
  }

  function proposeDirectFunding(
    string memory _title,
    address _recipient,
    uint256 _amount,
    string memory _info
  ) public onlySponsor {
    require(!sponsors[msg.sender].isDelegated, 'Funds are delegated');
    require(
      members[_recipient].status == RoleStatus.Active,
      'Recipient must be an active member'
    );
    require(
      sponsors[msg.sender].availableBalance >= _amount,
      'Insufficient balance'
    );

    proposalCount++;
    proposals[proposalCount].proposalType = ProposalType.DirectFunding;
    proposals[proposalCount].title = _title;
    proposals[proposalCount].proposer = msg.sender;
    proposals[proposalCount].target = _recipient;
    proposals[proposalCount].amount = _amount;
    proposals[proposalCount].info = _info;
    proposals[proposalCount].reviewerCount = reviewerCount;
    proposals[proposalCount].threshold = approvalThresholds[
      ProposalType.DirectFunding
    ];
    proposals[proposalCount].status = ProposalStatus.Approved;

    sponsors[msg.sender].availableBalance -= _amount;
    payable(_recipient).transfer(_amount);
    emit DirectFundingProposedAndExecuted(
      proposalCount,
      msg.sender,
      _recipient,
      _amount
    );
  }

  function updateReviewerInfo(
    string memory _name,
    string memory _info
  ) public onlyReviewer {
    reviewers[msg.sender].name = _name;
    reviewers[msg.sender].info = _info;
    emit ReviewerInfoUpdated(msg.sender, _name, _info);
  }

  function exitReviewer(string memory _exitNote) public onlyReviewer {
    reviewers[msg.sender].exitNote = _exitNote;
    string memory name = reviewers[msg.sender].name;
    reviewers[msg.sender].status = RoleStatus.Exited;
    reviewerCount--;
    emit ReviewerExited(msg.sender, name, _exitNote);
  }

  function proposeDistrust(
    ProposalType _type,
    string memory _title,
    address _target,
    string memory _info
  ) public onlyReviewer {
    require(
      _type == ProposalType.MemberDistrust ||
        _type == ProposalType.ReviewerDistrust ||
        _type == ProposalType.SponsorDistrust,
      'Invalid distrust type'
    );
    require(
      (_type == ProposalType.MemberDistrust &&
        members[_target].status == RoleStatus.Active) ||
        (_type == ProposalType.ReviewerDistrust &&
          reviewers[_target].status == RoleStatus.Active) ||
        (_type == ProposalType.SponsorDistrust &&
          sponsors[_target].status == RoleStatus.Active),
      'Invalid target address'
    );

    proposalCount++;
    proposals[proposalCount].proposalType = _type;
    proposals[proposalCount].title = _title;
    proposals[proposalCount].proposer = msg.sender;
    proposals[proposalCount].target = _target;
    proposals[proposalCount].info = _info;
    proposals[proposalCount].reviewerCount = reviewerCount;
    proposals[proposalCount].threshold = approvalThresholds[_type];
    proposals[proposalCount].forCount++;
    proposals[proposalCount].status = ProposalStatus.Pending;
    emit DistrustProposed(proposalCount, _type, msg.sender, _target);
  }

  function proposeDelegatedFunding(
    string memory _title,
    address _recipient,
    uint256 _amount,
    string memory _info
  ) public onlyReviewer {
    require(
      members[_recipient].status == RoleStatus.Active,
      'Recipient must be an active member'
    );
    require(_amount <= remainingBalance, 'Insufficient delegated funds');
    proposalCount++;
    proposals[proposalCount].proposalType = ProposalType.DelegatedFunding;
    proposals[proposalCount].title = _title;
    proposals[proposalCount].proposer = msg.sender;
    proposals[proposalCount].target = _recipient;
    proposals[proposalCount].amount = _amount;
    proposals[proposalCount].info = _info;
    proposals[proposalCount].reviewerCount = reviewerCount;
    proposals[proposalCount].threshold = approvalThresholds[
      ProposalType.DelegatedFunding
    ];
    proposals[proposalCount].forCount++;
    proposals[proposalCount].status = ProposalStatus.Pending;
    emit DelegatedFundingProposed(
      proposalCount,
      msg.sender,
      _recipient,
      _amount
    );
  }

  function proposeThresholdUpdate(
    ProposalType _type,
    string memory _title,
    uint256 _newThreshold,
    string memory _info
  ) public onlyReviewer {
    require(_newThreshold <= 100, 'Threshold must be <= 100');
    require(
      _type != ProposalType.DirectFunding,
      'Cannot update DirectFunding threshold'
    );
    proposalCount++;
    proposals[proposalCount].proposalType = ProposalType.UpdateThreshold;
    proposals[proposalCount].title = _title;
    proposals[proposalCount].proposer = msg.sender;
    proposals[proposalCount].targetProposalType = _type;
    proposals[proposalCount].amount = _newThreshold;
    proposals[proposalCount].info = _info;
    proposals[proposalCount].reviewerCount = reviewerCount;
    proposals[proposalCount].threshold = approvalThresholds[
      ProposalType.UpdateThreshold
    ];
    proposals[proposalCount].forCount++;
    proposals[proposalCount].status = ProposalStatus.Pending;
    emit ThresholdUpdateProposed(
      proposalCount,
      _type,
      msg.sender,
      _newThreshold
    );
  }

  function voteProposal(
    uint256 _proposalId,
    bool _isApproved,
    string memory _reason
  ) public onlyReviewer {
    Proposal storage proposal = proposals[_proposalId];
    require(proposal.status == ProposalStatus.Pending, 'Proposal not pending');
    require(!proposal.isVoted[msg.sender], 'Already voted');
    if (
      proposal.proposalType == ProposalType.MemberDistrust ||
      proposal.proposalType == ProposalType.ReviewerDistrust ||
      proposal.proposalType == ProposalType.SponsorDistrust ||
      proposal.proposalType == ProposalType.DelegatedFunding ||
      proposal.proposalType == ProposalType.UpdateThreshold
    ) {
      require(
        proposal.proposer != msg.sender,
        'Proposer cannot vote on own proposal'
      );
    }
    if (
      proposal.proposalType == ProposalType.Funding ||
      proposal.proposalType == ProposalType.DelegatedFunding
    ) {
      require(
        proposal.amount <= remainingBalance,
        'Insufficient delegated funds'
      );
    }

    proposal.isVoted[msg.sender] = true;
    proposal.isApproved[msg.sender] = _isApproved;
    proposal.reason[msg.sender] = _reason;
    if (_isApproved) {
      proposal.forCount++;
    } else {
      proposal.againstCount++;
    }

    voterList[_proposalId].push(msg.sender);

    emit ProposalVoted(_proposalId, msg.sender, _isApproved, _reason);

    if (
      (proposal.forCount * 100) / proposal.reviewerCount >= proposal.threshold
    ) {
      executeProposal(_proposalId);
    } else if (
      (proposal.againstCount * 100) / proposal.reviewerCount >
      100 - proposal.threshold
    ) {
      proposal.status = ProposalStatus.Rejected;
    }
  }

  function executeProposal(uint256 _proposalId) private {
    Proposal storage proposal = proposals[_proposalId];
    require(proposal.status == ProposalStatus.Pending, 'Proposal not pending');
    proposal.status = ProposalStatus.Approved;

    if (proposal.proposalType == ProposalType.NewMember) {
      members[proposal.proposer].name = string(
        abi.encodePacked('Member ', Strings.toString(_proposalId))
      );
      members[proposal.proposer].info = proposal.info;
      members[proposal.proposer].status = RoleStatus.Active;
      memberList.push(proposal.proposer);
    } else if (proposal.proposalType == ProposalType.NewReviewer) {
      reviewers[proposal.proposer].name = string(
        abi.encodePacked('Reviewer ', Strings.toString(_proposalId))
      );
      reviewers[proposal.proposer].info = proposal.info;
      reviewers[proposal.proposer].status = RoleStatus.Active;
      reviewerList.push(proposal.proposer);
      reviewerCount++;
    } else if (proposal.proposalType == ProposalType.MemberDistrust) {
      members[proposal.target].status = RoleStatus.Distrusted;
      members[proposal.target].exitNote = string(
        abi.encodePacked('Execute Proposal ID ', Strings.toString(_proposalId))
      );
    } else if (proposal.proposalType == ProposalType.ReviewerDistrust) {
      reviewers[proposal.target].status = RoleStatus.Distrusted;
      reviewers[proposal.target].exitNote = string(
        abi.encodePacked('Execute Proposal ID ', Strings.toString(_proposalId))
      );
      reviewerCount--;
    } else if (proposal.proposalType == ProposalType.SponsorDistrust) {
      sponsors[proposal.target].exitNote = string(
        abi.encodePacked('Execute Proposal ID ', Strings.toString(_proposalId))
      );
      if (!sponsors[proposal.target].isDelegated) {
        totalDelegatedAmount += sponsors[proposal.target].availableBalance;
        remainingBalance += sponsors[proposal.target].availableBalance;
        sponsors[proposal.target].availableBalance = 0;
      }
      sponsors[proposal.target].status = RoleStatus.Distrusted;
    } else if (proposal.proposalType == ProposalType.Funding) {
      remainingBalance -= proposal.amount;
      payable(proposal.proposer).transfer(proposal.amount);
    } else if (proposal.proposalType == ProposalType.DirectFunding) {} else if (
      proposal.proposalType == ProposalType.DelegatedFunding
    ) {
      remainingBalance -= proposal.amount;
      payable(proposal.target).transfer(proposal.amount);
    } else if (proposal.proposalType == ProposalType.UpdateThreshold) {
      approvalThresholds[proposal.targetProposalType] = proposal.amount;
    }

    emit ProposalExecuted(
      _proposalId,
      proposal.proposalType,
      proposal.proposer
    );
  }

  receive() external payable {}
}
