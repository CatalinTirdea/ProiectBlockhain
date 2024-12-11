// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Funds {
    struct Proposal {
        string description;
        uint256 amountRequested;
        uint256 votesFor;
        uint256 votesAgainst;
        bool open;
        bool executed;
        mapping(address => bool) voters;
        string ipfsHash; // For storing IPFS hash of the proposal description
    }

    address public owner;
    uint256 public totalFunds;
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    address public charityContractAddress;  // Charity contract address for external interaction

    event DonationReceived(address indexed donor, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, string description, uint256 amountRequested, string ipfsHash);
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

    // Function to donate ETH
    function donate() public payable {
        require(msg.value > 0, "Must send ETH");
        totalFunds += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    // Create proposal with IPFS hash
    function createProposal(string memory description, uint256 amountRequested, string memory ipfsHash) public onlyOwner {
        require(amountRequested <= totalFunds, "Not enough funds");
        Proposal storage newProposal = proposals[proposalCount++];
        newProposal.description = description;
        newProposal.amountRequested = amountRequested;
        newProposal.open = true;
        newProposal.ipfsHash = ipfsHash;
        emit ProposalCreated(proposalCount - 1, description, amountRequested, ipfsHash);
    }

    // Vote for a proposal
    function vote(uint256 proposalId, bool support) public {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.open, "Voting closed");
        require(!proposal.voters[msg.sender], "Already voted");

        proposal.voters[msg.sender] = true;
        if (support) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }
        emit Voted(proposalId, msg.sender, support);
    }

    // Withdraw funds for charity or other recipients
    function distributeFunds(uint256 proposalId) public onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.open, "Proposal closed");
        require(!proposal.executed, "Already executed");

        if (proposal.votesFor > proposal.votesAgainst) {
            payable(owner).transfer(proposal.amountRequested);  // Transfer ETH to the owner (or charity)
            proposal.executed = true;
            totalFunds -= proposal.amountRequested;
            emit FundsDistributed(proposalId, owner, proposal.amountRequested);
        }
        proposal.open = false;
    }

    // Allow users to withdraw their donations
    function withdraw(uint256 amount) public {
        require(amount <= address(this).balance, "Not enough funds");
        payable(msg.sender).transfer(amount);
        emit FundsWithdrawn(msg.sender, amount);
    }

    // External contract interaction example (e.g., charity donation)
    function setCharityContract(address _charityContract) public onlyOwner {
        charityContractAddress = _charityContract;
    }

    // Send funds to charity contract
    function donateToCharity(uint256 amount) public onlyOwner {
        require(charityContractAddress != address(0), "Charity contract not set");
        payable(charityContractAddress).transfer(amount);
    }

    // Example of a 'pure' function
    function calculatePercentage(uint256 total, uint256 percentage) public pure returns (uint256) {
        return (total * percentage) / 100;
    }

    // Get proposal details
    function getProposal(uint256 proposalId) public view returns (string memory, uint256, uint256, uint256, bool, bool, string memory) {
        Proposal storage proposal = proposals[proposalId];
        return (proposal.description, proposal.amountRequested, proposal.votesFor, proposal.votesAgainst, proposal.open, proposal.executed, proposal.ipfsHash);
    }
}
