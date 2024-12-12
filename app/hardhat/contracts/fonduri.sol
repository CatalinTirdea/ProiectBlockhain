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
        string ipfsHash; // For storing IPFS hash of the proposal description
    }

    address public owner;
    uint256 public totalFunds;
    Proposal[] public proposals;
    uint256 public proposalCount;
    address public charityContractAddress;  // Charity contract address for external interaction
    // Mapping to track who voted for each proposal
    mapping(uint256 => mapping(address => bool)) public voters;

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
    function createProposal(string memory description, uint256 amountRequested, string memory ipfsHash) public {
        require(amountRequested <= totalFunds, "Not enough funds");
        Proposal storage newProposal = proposals.push();
        newProposal.description = description;
        newProposal.amountRequested = amountRequested;
        newProposal.open = true;
        newProposal.ipfsHash = ipfsHash;

        emit ProposalCreated(proposals.length - 1, description, amountRequested, ipfsHash);
    }

    // Vote for a proposal
    function vote(uint256 proposalId, bool support) public {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.open, "Voting closed");
        require(!voters[proposalId][msg.sender], "Already voted");

        // Track the voter
        voters[proposalId][msg.sender] = true;

        // Update votes based on support
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

    function getProposal(uint256 proposalId) public view returns (
        string memory description,
        uint256 amountRequested,
        uint256 votesFor,
        uint256 votesAgainst,
        bool open,
        bool executed,
        string memory ipfsHash)
    {
        require(proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage p = proposals[proposalId];
        return (
            p.description,
            p.amountRequested,
            p.votesFor,
            p.votesAgainst,
            p.open,
            p.executed,
            p.ipfsHash
        );
    }

    // Function to get all proposals by calling getProposal(id) for each
    function getAllProposals() public view returns (
        string[] memory descriptions,
        uint256[] memory amountsRequested,
        uint256[] memory votesFor,
        uint256[] memory votesAgainst,
        bool[] memory opens,
        bool[] memory executeds,
        string[] memory ipfsHashes)
    {
        descriptions = new string[](proposals.length);
        amountsRequested = new uint256[](proposals.length);
        votesFor = new uint256[](proposals.length);
        votesAgainst = new uint256[](proposals.length);
        opens = new bool[](proposals.length);
        executeds = new bool[](proposals.length);
        ipfsHashes = new string[](proposals.length);

        for (uint256 i = 0; i < proposals.length; i++) {
            (descriptions[i], amountsRequested[i], votesFor[i], votesAgainst[i], opens[i], executeds[i], ipfsHashes[i]) = getProposal(i);
        }

        return (descriptions, amountsRequested, votesFor, votesAgainst, opens, executeds, ipfsHashes);
    }

}
