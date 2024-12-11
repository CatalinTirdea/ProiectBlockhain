using System.Numerics;
using app.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Nethereum.Web3;

namespace app.Controllers;

using Microsoft.AspNetCore.Mvc;
using Nethereum.Web3;
using Nethereum.Hex.HexTypes;

[ApiController]
[Route("api")]
public class FundsController : ControllerBase
{
    private readonly Web3 _web3;
    private readonly string _contractAddress;
    private readonly string _abi;

    public FundsController()
    {
        string hardhatUrl = "http://127.0.0.1:8545";
        _contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        string abiJson = System.IO.File.ReadAllText("abi.txt");
        _abi = JsonConvert.DeserializeObject(abiJson)!.ToString()!;
        _web3 = new Web3(hardhatUrl);
    }

    // TODO inca nu am testat cum afiseaza ca nu am adaugat niciun proposal
    [HttpGet("getAllProposals")]
    public async Task<IActionResult> GetAllProposalsAsync()
    {
        var contract = _web3.Eth.GetContract(_abi, _contractAddress);
        var function = contract.GetFunction("getAllProposals");
        var result = await function.CallAsync<List<string>>(); // Assuming you get a flat list of values from the contract

        // Ensure the result is valid
        if (result == null || result.Count == 0)
        {
            return NotFound(new { Message = "No proposals found." });
        }

        // Number of proposals should be the size of the arrays divided by 7
        int totalProposals = result.Count / 7;

        // Split the result into separate lists based on the proposal attributes
        var descriptions = result.Take(totalProposals).ToList();
        var amountsRequested = result.Skip(totalProposals).Take(totalProposals).ToList();
        var votesFor = result.Skip(2 * totalProposals).Take(totalProposals).ToList();
        var votesAgainst = result.Skip(3 * totalProposals).Take(totalProposals).ToList();
        var opens = result.Skip(4 * totalProposals).Take(totalProposals).ToList();
        var executeds = result.Skip(5 * totalProposals).Take(totalProposals).ToList();
        var ipfsHashes = result.Skip(6 * totalProposals).Take(totalProposals).ToList();

        // Create a list to hold the Proposal objects
        var proposals = new List<Proposal>();

        // Populate the Proposal objects
        for (int i = 0; i < totalProposals; i++)
        {
            proposals.Add(new Proposal
            {
                Description = descriptions[i],
                AmountRequested = BigInteger.Parse(amountsRequested[i]),
                VotesFor = BigInteger.Parse(votesFor[i]),
                VotesAgainst = BigInteger.Parse(votesAgainst[i]),
                Open = bool.Parse(opens[i]),
                Executed = bool.Parse(executeds[i]),
                IpfsHash = ipfsHashes[i]
            });
        }

        // Return the list of proposals as the response
        return Ok(proposals);
    }

    [HttpPost("createProposal")]
    public async Task<IActionResult> CreateProposal([FromBody] CreateProposalDto proposal)
    {
        try
        {
            var contract = _web3.Eth.GetContract(_abi, _contractAddress);
            var createProposalFunction = contract.GetFunction("createProposal");

            var weiAmountRequested = Web3.Convert.ToWei(proposal.AmountRequested);
            var receipt = await createProposalFunction.SendTransactionAndWaitForReceiptAsync(
                from: proposal.Address,
                gas: new HexBigInteger(29999999),
                value: new HexBigInteger(1),
                functionInput: new object[] { proposal.Description, proposal.AmountRequested, proposal.IpfsHash }
            );

            return Ok(new { Message = "Proposal created successfully!", TransactionHash = receipt.TransactionHash });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    [HttpPost("distributeFunds")]
    public async Task<IActionResult> DistributeFunds([FromBody] DistributeFundsDto distributeFunds)
    {
        try
        {
            var contract = _web3.Eth.GetContract(_abi, _contractAddress);
            var distributeFundsFunction = contract.GetFunction("distributeFunds");

            var receipt = await distributeFundsFunction.SendTransactionAndWaitForReceiptAsync(
                from: distributeFunds.Address,
                gas: new HexBigInteger(29999999),
                value: new HexBigInteger(1),
                functionInput: new object[] { distributeFunds.ProposalId }
            );

            return Ok(new { Message = "Funds distributed successfully!", TransactionHash = receipt.TransactionHash });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }
}