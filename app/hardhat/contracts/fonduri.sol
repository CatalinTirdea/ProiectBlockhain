// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Funds {
    struct Proposal {
        string title; // Added title for better identification
        string description;
        uint256 amountRequested;
        uint256 votesFor;
        uint256 votesAgainst;
        bool open;
        bool executed;
        string ipfsHash;
    }

    address public owner;
    uint256 public totalFunds;
    Proposal[] public proposals;
    address public charityContractAddress;
    mapping(uint256 => mapping(address => bool)) public voters;

    event DonationReceived(address indexed donor, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, string title, string description, uint256 amountRequested, string ipfsHash);
    event Voted(uint256 indexed proposalId, address voter, bool support);
    event FundsDistributed(uint256 indexed proposalId, address recipient, uint256 amount);
    event FundsWithdrawn(address indexed account, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function donate() public payable {
        require(msg.value > 0, "Must send ETH");
        totalFunds += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    function createProposal(string memory title, string memory description, uint256 amountRequested, string memory ipfsHash) public {
        require(amountRequested <= totalFunds, "Not enough funds");
        Proposal storage newProposal = proposals.push();
        newProposal.description = description;
        newProposal.amountRequested = amountRequested;
        newProposal.open = true;
        newProposal.ipfsHash = ipfsHash;

        emit ProposalCreated(proposals.length - 1, title, description, amountRequested, ipfsHash);
    }

    function vote(uint256 proposalId, bool support) public {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.open, "Voting closed");
        require(!voters[proposalId][msg.sender], "Already voted");

        voters[proposalId][msg.sender] = true;

        if (support) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }

        emit Voted(proposalId, msg.sender, support);
    }

    function distributeFunds(uint256 proposalId) public onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.open, "Proposal closed");
        require(!proposal.executed, "Already executed");

        if (proposal.votesFor > proposal.votesAgainst) {
            payable(owner).transfer(proposal.amountRequested);
            proposal.executed = true;
            totalFunds -= proposal.amountRequested;
            emit FundsDistributed(proposalId, owner, proposal.amountRequested);
        }
        proposal.open = false;
    }

    function getProposal(uint256 proposalId) public view returns (
        string memory title,
        string memory description,
        uint256 amountRequested,
        uint256 votesFor,
        uint256 votesAgainst,
        bool open,
        bool executed,
        string memory ipfsHash
    ) {
        require(proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage p = proposals[proposalId];
        return (
            p.title,
            p.description,
            p.amountRequested,
            p.votesFor,
            p.votesAgainst,
            p.open,
            p.executed,
            p.ipfsHash
        );
    }

    function getAllProposals() public view returns (
        string[] memory titles,
        string[] memory descriptions,
        uint256[] memory amountsRequested,
        uint256[] memory votesFor,
        uint256[] memory votesAgainst,
        bool[] memory opens,
        bool[] memory executeds,
        string[] memory ipfsHashes
    ) {
        uint256 length = proposals.length;
        titles = new string[](length);
        descriptions = new string[](length);
        amountsRequested = new uint256[](length);
        votesFor = new uint256[](length);
        votesAgainst = new uint256[](length);
        opens = new bool[](length);
        executeds = new bool[](length);
        ipfsHashes = new string[](length);

        for (uint256 i = 0; i < length; i++) {
            Proposal storage p = proposals[i];
            titles[i] = p.title;
            descriptions[i] = p.description;
            amountsRequested[i] = p.amountRequested;
            votesFor[i] = p.votesFor;
            votesAgainst[i] = p.votesAgainst;
            opens[i] = p.open;
            executeds[i] = p.executed;
            ipfsHashes[i] = p.ipfsHash;
        }
    }
}
