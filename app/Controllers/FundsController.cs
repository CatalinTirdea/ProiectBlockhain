using System.Numerics;
using app.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Nethereum.Web3;
using Nethereum.RPC.Eth.DTOs;
using Nethereum.Hex.HexTypes;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Contracts;

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

    [HttpPost("vote")]
    public async Task<IActionResult> Vote([FromBody] VoteDto voteDto)
    {
        try
        {
            var contract = _web3.Eth.GetContract(_abi, _contractAddress);
            var voteFunction = contract.GetFunction("vote");

            var receipt = await voteFunction.SendTransactionAndWaitForReceiptAsync(
                from: voteDto.Address,
                gas: new HexBigInteger(3000000),
                value: new HexBigInteger(0),
                functionInput: new object[] { voteDto.ProposalId, voteDto.Support }
            );

            return Ok(new { Message = "Vote submitted successfully!", TransactionHash = receipt.TransactionHash });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }


    // TODO inca nu am testat cum afiseaza ca nu am adaugat niciun proposal
    [HttpGet("getAllProposals")]
    public async Task<IActionResult> GetAllProposalsAsync()
    {
        var contract = _web3.Eth.GetContract(_abi, _contractAddress);
        var getProposalFunction = contract.GetFunction("getProposal");

        var proposals = new List<Proposal>();
        int id = 0;

        while (true)
        {
            try
            {
                // Call the getProposal function
                var result = await getProposalFunction.CallAsync<string>(id); // Call the function to get raw string data.

                // If the result is null or the essential fields are missing, stop the loop
                if (string.IsNullOrEmpty(result))
                {
                    break;
                }

                // Add the proposal to the list
                proposals.Add(new Proposal
                {
                    Id = id,
                    Description = result,
                    AmountRequested = 0,
                    VotesFor = 0,
                    VotesAgainst = 0,
                    Open = true,
                    Executed = false
                });

                id++; // Increment ID for the next proposal
            }
            catch
            {
                break; // Stop if an exception occurs
            }
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
                value: new HexBigInteger(0),
                functionInput: new object[] { proposal.Title, proposal.Description, proposal.AmountRequested, proposal.IpfsHash } // Added Title parameter
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
                value: new HexBigInteger(0),
                functionInput: new object[] { distributeFunds.ProposalId }
            );

            return Ok(new { Message = "Funds distributed successfully!", TransactionHash = receipt.TransactionHash });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    [HttpPost("donate")]
    public async Task<IActionResult> Donate([FromBody] DonateDto donateDto)
    {
        try
        {
            var contract = _web3.Eth.GetContract(_abi, _contractAddress);
            var donateFunction = contract.GetFunction("donate");

            // Ensure the address is unlocked and available
            var accounts = await _web3.Eth.Accounts.SendRequestAsync();
            // if (!accounts.Contains(donateDto.Address))
            // {
            //     return BadRequest(new { Error = "Unknown account: " + donateDto.Address });
            // }

            var receipt = await donateFunction.SendTransactionAndWaitForReceiptAsync(
                from: donateDto.Address,
                gas: new HexBigInteger(3000000),
                value: new HexBigInteger(Web3.Convert.ToWei(donateDto.Amount)),
                functionInput: new object[] { }
            );

            return Ok(new { Message = "Donation submitted successfully!", TransactionHash = receipt.TransactionHash });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }
}