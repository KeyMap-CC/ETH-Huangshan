// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "../lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Votes.sol";

/// @title AlgorithmReview
/// @notice A DAO-based algorithm audit voting contract.
/// @dev Members vote with governance tokens. Results are emitted for off-chain processing.

contract AlgorithmReview {
    address public owner;
    uint256 public votingDuration = 3 days;
    uint256 public executionCounter;
    uint256 public proposalThreshold; // Minimum tokens required to submit a proposal
    uint256 public quorumVotes; // Minimum votes required for a proposal to pass
    
    IERC20 public governanceToken;

    mapping(bytes32 => mapping(address => uint256)) public hasVoted; // cid -> member -> amount voted
    mapping(address => bool) public isCommitteeMember;

    struct ExecutionRequest {
        uint256 id;
        address scientist;
        string cid;
        address proposer;
    }
    mapping(uint256 => ExecutionRequest) public executions; // exe id -> request

    // Vote record for a given algorithm (cid)
    struct VoteRecord {
        uint256 yesVotes;
        uint256 noVotes;
        bool resolved;
        bool approved;
        uint256 startTime;
        uint256 endTime;
        string description;
    }
    mapping(bytes32 => VoteRecord) public votes; // keccak256(cid) -> vote data

    // DAO Proposal Types
    enum ProposalType {
        AlgorithmReview,
        AddCommitteeMember,
        RemoveCommitteeMember,
        ChangeVotingDuration,
        ChangeProposalThreshold,
        ChangeQuorum
    }

    struct Proposal {
        uint256 id;
        address proposer;
        ProposalType proposalType;
        bytes data; // Encoded proposal data
        uint256 yesVotes;
        uint256 noVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool canceled;
        string description;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;

    event ExecutionSubmitted(uint256 indexed executionId, string cid, uint256 startTime, uint256 endTime, address proposer);
    event VoteCasted(address indexed member, string cid, bool approved, uint256 voteAmount, uint256 voteTime);
    event AlgorithmResolved(uint256 indexed executionId, string cid, bool approved);
    event CommitteeMemberUpdated(address indexed member, bool approved);
    event ProposalCreated(uint256 indexed proposalId, address proposer, ProposalType proposalType, string description);
    event ProposalVoteCast(uint256 indexed proposalId, address voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);
    event GovernanceUpdated(string parameter, uint256 newValue);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyCommittee() {
        require(isCommitteeMember[msg.sender], "Not committee member");
        _;
    }

    constructor(address _governanceToken) {
        owner = msg.sender;
        governanceToken = IERC20(_governanceToken);
        proposalThreshold = 100 * 10**18; // 100 tokens
        quorumVotes = 1000 * 10**18; // 1000 tokens
        isCommitteeMember[msg.sender] = true; // Owner is a committee member by default
    }

    /// @notice Owner can set the voting duration for algorithm reviews, default is 3 days
    function setVotingDuration(uint256 duration) external onlyOwner {
        votingDuration = duration;
        emit GovernanceUpdated("votingDuration", duration);
    }

    /// @notice Owner can add or remove committee members
    function setCommitteeMember(address member, bool approved) external onlyOwner {
        isCommitteeMember[member] = approved;
        emit CommitteeMemberUpdated(member, approved);
    }

    /// @notice Create a proposal to submit an algorithm for review
    function proposeAlgorithm(address scientist, string calldata cid, string calldata description) external {
        require(governanceToken.balanceOf(msg.sender) >= proposalThreshold, "Insufficient tokens to propose");
        
        uint256 proposalId = proposalCount++;
        uint256 nowTime = block.timestamp;
        
        bytes memory data = abi.encode(scientist, cid);
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            proposalType: ProposalType.AlgorithmReview,
            data: data,
            yesVotes: 0,
            noVotes: 0,
            startTime: nowTime,
            endTime: nowTime + votingDuration,
            executed: false,
            canceled: false,
            description: description
        });
        
        emit ProposalCreated(proposalId, msg.sender, ProposalType.AlgorithmReview, description);
    }

    /// @notice Create a governance proposal
    function createProposal(ProposalType proposalType, bytes calldata data, string calldata description) external {
        require(governanceToken.balanceOf(msg.sender) >= proposalThreshold, "Insufficient tokens to propose");
        
        uint256 proposalId = proposalCount++;
        uint256 nowTime = block.timestamp;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            proposalType: proposalType,
            data: data,
            yesVotes: 0,
            noVotes: 0,
            startTime: nowTime,
            endTime: nowTime + votingDuration,
            executed: false,
            canceled: false,
            description: description
        });
        
        emit ProposalCreated(proposalId, msg.sender, proposalType, description);
    }

    /// @notice Vote on a governance proposal
    function voteOnProposal(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.startTime != 0, "Proposal does not exist");
        require(!proposal.executed, "Proposal already executed");
        require(!proposal.canceled, "Proposal canceled");
        require(block.timestamp <= proposal.endTime, "Voting has ended");
        
        uint256 voteWeight = governanceToken.balanceOf(msg.sender);
        require(voteWeight > 0, "No voting power");
        
        if (support) {
            proposal.yesVotes += voteWeight;
        } else {
            proposal.noVotes += voteWeight;
        }
        
        emit ProposalVoteCast(proposalId, msg.sender, support, voteWeight);
    }

    /// @notice Execute a passed proposal
    function executeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.startTime != 0, "Proposal does not exist");
        require(!proposal.executed, "Proposal already executed");
        require(!proposal.canceled, "Proposal canceled");
        require(block.timestamp > proposal.endTime, "Voting not ended");
        require(proposal.yesVotes > proposal.noVotes, "Proposal rejected");
        require(proposal.yesVotes + proposal.noVotes >= quorumVotes, "Quorum not reached");
        
        proposal.executed = true;
        
        if (proposal.proposalType == ProposalType.AlgorithmReview) {
            (address scientist, string memory cid) = abi.decode(proposal.data, (address, string));
            _submitAlgorithm(executionCounter++, scientist, cid, proposal.proposer);
        } else if (proposal.proposalType == ProposalType.AddCommitteeMember) {
            address member = abi.decode(proposal.data, (address));
            isCommitteeMember[member] = true;
            emit CommitteeMemberUpdated(member, true);
        } else if (proposal.proposalType == ProposalType.RemoveCommitteeMember) {
            address member = abi.decode(proposal.data, (address));
            isCommitteeMember[member] = false;
            emit CommitteeMemberUpdated(member, false);
        } else if (proposal.proposalType == ProposalType.ChangeVotingDuration) {
            uint256 newDuration = abi.decode(proposal.data, (uint256));
            votingDuration = newDuration;
            emit GovernanceUpdated("votingDuration", newDuration);
        } else if (proposal.proposalType == ProposalType.ChangeProposalThreshold) {
            uint256 newThreshold = abi.decode(proposal.data, (uint256));
            proposalThreshold = newThreshold;
            emit GovernanceUpdated("proposalThreshold", newThreshold);
        } else if (proposal.proposalType == ProposalType.ChangeQuorum) {
            uint256 newQuorum = abi.decode(proposal.data, (uint256));
            quorumVotes = newQuorum;
            emit GovernanceUpdated("quorumVotes", newQuorum);
        }
        
        emit ProposalExecuted(proposalId);
    }

    /// @notice Cancel a proposal (only proposer or if proposer has fallen below threshold)
    function cancelProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.startTime != 0, "Proposal does not exist");
        require(!proposal.executed, "Proposal already executed");
        require(!proposal.canceled, "Proposal already canceled");
        
        require(
            msg.sender == proposal.proposer || 
            governanceToken.balanceOf(proposal.proposer) < proposalThreshold,
            "Only proposer or if proposer below threshold"
        );
        
        proposal.canceled = true;
        emit ProposalCanceled(proposalId);
    }

    /// @notice Internal function to submit algorithm after proposal passes
    function _submitAlgorithm(uint256 executionId, address scientist, string memory cid, address proposer) internal {
        bytes32 cidHash = keccak256(bytes(cid));
        uint256 nowTime = block.timestamp;

        // Create new execution entry
        executions[executionId] = ExecutionRequest({
            id: executionId,
            scientist: scientist,
            cid: cid,
            proposer: proposer
        });

        VoteRecord storage record = votes[cidHash];

        // First submission for this cid → initialize voting window
        if (record.startTime == 0) {
            record.startTime = nowTime;
            record.endTime = nowTime + votingDuration;
        }

        emit ExecutionSubmitted(executionId, cid, record.startTime, record.endTime, proposer);
    }

    /// @notice Committee votes on an algorithm with token weight
    function vote(string calldata cid, bool approve, uint256 amount) external onlyCommittee {
        bytes32 cidHash = keccak256(bytes(cid));
        VoteRecord storage record = votes[cidHash];

        require(record.startTime != 0, "Algorithm not found");
        require(!record.resolved, "Already resolved");
        require(block.timestamp <= record.endTime, "Voting has ended");
        
        // Check if user has enough tokens
        uint256 balance = governanceToken.balanceOf(msg.sender);
        require(balance >= amount, "Insufficient tokens");
        
        // Update vote amount
        uint256 previousVote = hasVoted[cidHash][msg.sender];
        hasVoted[cidHash][msg.sender] = amount;
        
        // Adjust vote counts
        if (previousVote > 0) {
            if (approve) {
                record.yesVotes = record.yesVotes + amount - previousVote;
            } else {
                record.noVotes = record.noVotes + amount - previousVote;
            }
        } else {
            if (approve) {
                record.yesVotes += amount;
            } else {
                record.noVotes += amount;
            }
        }

        emit VoteCasted(msg.sender, cid, approve, amount, block.timestamp);
    }

    /// @notice Resolve the algorithm after voting ends or manually emit cached result
    function resolve(string calldata cid, uint256 executionId) external {
        bytes32 cidHash = keccak256(bytes(cid));
        VoteRecord storage record = votes[cidHash];

        require(record.startTime != 0, "Algorithm not found");

        if (!record.resolved) {
            require(block.timestamp > record.endTime, "Voting not yet ended");

            record.resolved = true;
            record.approved = (record.yesVotes > record.noVotes);
        }

        emit AlgorithmResolved(executionId, cid, record.approved);
    }
}
