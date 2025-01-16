const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("Funds Contract", function () {
    let funds;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy the Funds contract before each test
        const Funds = await ethers.getContractFactory("Funds");
        funds = await Funds.deploy();
    });

    describe("Create Proposal", function () {
        it("should create a proposal successfully", async function () {
            const donationAmount = ethers.utils.parseEther("5.0");
            await addr1.sendTransaction({ to: funds.address, value: donationAmount });

            const title = "Build a School";
            const description = "Proposal to fund school construction";
            const amountRequested = ethers.utils.parseEther("2.0");
            const ipfsHash = "QmTestHash";

            await funds.createProposal(title, description, amountRequested, ipfsHash);

            const proposal = await funds.getProposal(0);
            expect(proposal.title).to.equal(title);
            expect(proposal.description).to.equal(description);
            expect(proposal.amountRequested).to.equal(amountRequested);
            expect(proposal.open).to.be.true;
            expect(proposal.executed).to.be.false;
            expect(proposal.ipfsHash).to.equal(ipfsHash);
        });

        it("should fail to create a proposal with insufficient funds", async function () {
            const title = "Large Project";
            const description = "This project needs a lot of money";
            const amountRequested = ethers.utils.parseEther("10.0"); // Exceeds current total funds
            const ipfsHash = "QmTestHash";

            await expect(
                funds.createProposal(title, description, amountRequested, ipfsHash)
            ).to.be.revertedWith("Not enough funds");
        });
    });

    describe("Vote", function () {
        it("should allow a user to vote for a proposal", async function () {
            const donationAmount = ethers.utils.parseEther("3.0");
            await addr1.sendTransaction({ to: funds.address, value: donationAmount });

            const title = "Fund Medical Supplies";
            const description = "Proposal to purchase medical supplies";
            const amountRequested = ethers.utils.parseEther("1.0");
            const ipfsHash = "QmAnotherHash";

            await funds.createProposal(title, description, amountRequested, ipfsHash);

            await funds.connect(addr2).vote(0, true);

            const proposal = await funds.getProposal(0);
            expect(proposal.votesFor).to.equal(1);
            expect(proposal.votesAgainst).to.equal(0);
        });

        it("should allow a user to vote against a proposal", async function () {
            const donationAmount = ethers.utils.parseEther("3.0");
            await addr1.sendTransaction({ to: funds.address, value: donationAmount });

            const title = "New Community Center";
            const description = "Proposal for a new community center";
            const amountRequested = ethers.utils.parseEther("2.0");
            const ipfsHash = "QmNewHash";

            await funds.createProposal(title, description, amountRequested, ipfsHash);

            await funds.connect(addr2).vote(0, false);

            const proposal = await funds.getProposal(0);
            expect(proposal.votesFor).to.equal(0);
            expect(proposal.votesAgainst).to.equal(1);
        });

        it("should not allow voting on a closed proposal", async function () {
            const donationAmount = ethers.utils.parseEther("3.0");
            await addr1.sendTransaction({ to: funds.address, value: donationAmount });

            const title = "Close Proposal";
            const description = "Proposal that will be closed";
            const amountRequested = ethers.utils.parseEther("1.0");
            const ipfsHash = "QmClosingHash";

            await funds.createProposal(title, description, amountRequested, ipfsHash);

            // Vote once to close the proposal
            await funds.connect(addr1).vote(0, true);
            await funds.connect(addr2).vote(0, false);

            // Attempt to vote after it's closed
            await expect(funds.connect(addr1).vote(0, true)).to.be.revertedWith("Voting closed");
        });

        it("should not allow double voting by the same user", async function () {
            const donationAmount = ethers.utils.parseEther("3.0");
            await addr1.sendTransaction({ to: funds.address, value: donationAmount });

            const title = "Double Vote Test";
            const description = "Proposal to test double voting prevention";
            const amountRequested = ethers.utils.parseEther("1.0");
            const ipfsHash = "QmDoubleVoteHash";

            await funds.createProposal(title, description, amountRequested, ipfsHash);

            await funds.connect(addr2).vote(0, true);

            // Attempt to vote again
            await expect(funds.connect(addr2).vote(0, false)).to.be.revertedWith("Already voted");
        });
    });
});
