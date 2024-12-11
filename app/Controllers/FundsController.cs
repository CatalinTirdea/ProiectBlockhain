using app.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Nethereum.Web3;

namespace app.Controllers;

using Microsoft.AspNetCore.Mvc;
using Nethereum.Web3;
using Nethereum.Hex.HexTypes;

[ApiController]
[Route("api/[controller]")]
public class FundsController : ControllerBase
{
    private readonly Web3 _web3;
    private readonly string _contractAddress;
    private readonly string _abi;

    public FundsController()
    {
        string hardhatUrl = "http://127.0.0.1:8545";
        _contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        string abiJson = @"""abi"": [
    {
      ""inputs"": [],
      ""stateMutability"": ""nonpayable"",
      ""type"": ""constructor""
    },
    {
      ""anonymous"": false,
      ""inputs"": [
        {
          ""indexed"": true,
          ""internalType"": ""address"",
          ""name"": ""donor"",
          ""type"": ""address""
        },
        {
          ""indexed"": false,
          ""internalType"": ""uint256"",
          ""name"": ""amount"",
          ""type"": ""uint256""
        }
      ],
      ""name"": ""DonationReceived"",
      ""type"": ""event""
    },
    {
      ""anonymous"": false,
      ""inputs"": [
        {
          ""indexed"": true,
          ""internalType"": ""uint256"",
          ""name"": ""proposalId"",
          ""type"": ""uint256""
        },
        {
          ""indexed"": false,
          ""internalType"": ""address"",
          ""name"": ""recipient"",
          ""type"": ""address""
        },
        {
          ""indexed"": false,
          ""internalType"": ""uint256"",
          ""name"": ""amount"",
          ""type"": ""uint256""
        }
      ],
      ""name"": ""FundsDistributed"",
      ""type"": ""event""
    },
    {
      ""anonymous"": false,
      ""inputs"": [
        {
          ""indexed"": true,
          ""internalType"": ""address"",
          ""name"": ""account"",
          ""type"": ""address""
        },
        {
          ""indexed"": false,
          ""internalType"": ""uint256"",
          ""name"": ""amount"",
          ""type"": ""uint256""
        }
      ],
      ""name"": ""FundsWithdrawn"",
      ""type"": ""event""
    },
    {
      ""anonymous"": false,
      ""inputs"": [
        {
          ""indexed"": true,
          ""internalType"": ""uint256"",
          ""name"": ""proposalId"",
          ""type"": ""uint256""
        },
        {
          ""indexed"": false,
          ""internalType"": ""string"",
          ""name"": ""description"",
          ""type"": ""string""
        },
        {
          ""indexed"": false,
          ""internalType"": ""uint256"",
          ""name"": ""amountRequested"",
          ""type"": ""uint256""
        },
        {
          ""indexed"": false,
          ""internalType"": ""string"",
          ""name"": ""ipfsHash"",
          ""type"": ""string""
        }
      ],
      ""name"": ""ProposalCreated"",
      ""type"": ""event""
    },
    {
      ""anonymous"": false,
      ""inputs"": [
        {
          ""indexed"": true,
          ""internalType"": ""uint256"",
          ""name"": ""proposalId"",
          ""type"": ""uint256""
        },
        {
          ""indexed"": false,
          ""internalType"": ""address"",
          ""name"": ""voter"",
          ""type"": ""address""
        },
        {
          ""indexed"": false,
          ""internalType"": ""bool"",
          ""name"": ""support"",
          ""type"": ""bool""
        }
      ],
      ""name"": ""Voted"",
      ""type"": ""event""
    },
    {
      ""inputs"": [
        {
          ""internalType"": ""uint256"",
          ""name"": ""total"",
          ""type"": ""uint256""
        },
        {
          ""internalType"": ""uint256"",
          ""name"": ""percentage"",
          ""type"": ""uint256""
        }
      ],
      ""name"": ""calculatePercentage"",
      ""outputs"": [
        {
          ""internalType"": ""uint256"",
          ""name"": """",
          ""type"": ""uint256""
        }
      ],
      ""stateMutability"": ""pure"",
      ""type"": ""function""
    },
    {
      ""inputs"": [],
      ""name"": ""charityContractAddress"",
      ""outputs"": [
        {
          ""internalType"": ""address"",
          ""name"": """",
          ""type"": ""address""
        }
      ],
      ""stateMutability"": ""view"",
      ""type"": ""function""
    },
    {
      ""inputs"": [
        {
          ""internalType"": ""string"",
          ""name"": ""description"",
          ""type"": ""string""
        },
        {
          ""internalType"": ""uint256"",
          ""name"": ""amountRequested"",
          ""type"": ""uint256""
        },
        {
          ""internalType"": ""string"",
          ""name"": ""ipfsHash"",
          ""type"": ""string""
        }
      ],
      ""name"": ""createProposal"",
      ""outputs"": [],
      ""stateMutability"": ""nonpayable"",
      ""type"": ""function""
    },
    {
      ""inputs"": [
        {
          ""internalType"": ""uint256"",
          ""name"": ""proposalId"",
          ""type"": ""uint256""
        }
      ],
      ""name"": ""distributeFunds"",
      ""outputs"": [],
      ""stateMutability"": ""nonpayable"",
      ""type"": ""function""
    },
    {
      ""inputs"": [],
      ""name"": ""donate"",
      ""outputs"": [],
      ""stateMutability"": ""payable"",
      ""type"": ""function""
    },
    {
      ""inputs"": [
        {
          ""internalType"": ""uint256"",
          ""name"": ""amount"",
          ""type"": ""uint256""
        }
      ],
      ""name"": ""donateToCharity"",
      ""outputs"": [],
      ""stateMutability"": ""nonpayable"",
      ""type"": ""function""
    },
    {
      ""inputs"": [
        {
          ""internalType"": ""uint256"",
          ""name"": ""proposalId"",
          ""type"": ""uint256""
        }
      ],
      ""name"": ""getProposal"",
      ""outputs"": [
        {
          ""internalType"": ""string"",
          ""name"": """",
          ""type"": ""string""
        },
        {
          ""internalType"": ""uint256"",
          ""name"": """",
          ""type"": ""uint256""
        },
        {
          ""internalType"": ""uint256"",
          ""name"": """",
          ""type"": ""uint256""
        },
        {
          ""internalType"": ""uint256"",
          ""name"": """",
          ""type"": ""uint256""
        },
        {
          ""internalType"": ""bool"",
          ""name"": """",
          ""type"": ""bool""
        },
        {
          ""internalType"": ""bool"",
          ""name"": """",
          ""type"": ""bool""
        },
        {
          ""internalType"": ""string"",
          ""name"": """",
          ""type"": ""string""
        }
      ],
      ""stateMutability"": ""view"",
      ""type"": ""function""
    },
    {
      ""inputs"": [],
      ""name"": ""owner"",
      ""outputs"": [
        {
          ""internalType"": ""address"",
          ""name"": """",
          ""type"": ""address""
        }
      ],
      ""stateMutability"": ""view"",
      ""type"": ""function""
    },
    {
      ""inputs"": [],
      ""name"": ""proposalCount"",
      ""outputs"": [
        {
          ""internalType"": ""uint256"",
          ""name"": """",
          ""type"": ""uint256""
        }
      ],
      ""stateMutability"": ""view"",
      ""type"": ""function""
    },
    {
      ""inputs"": [
        {
          ""internalType"": ""uint256"",
          ""name"": """",
          ""type"": ""uint256""
        }
      ],
      ""name"": ""proposals"",
      ""outputs"": [
        {
          ""internalType"": ""string"",
          ""name"": ""description"",
          ""type"": ""string""
        },
        {
          ""internalType"": ""uint256"",
          ""name"": ""amountRequested"",
          ""type"": ""uint256""
        },
        {
          ""internalType"": ""uint256"",
          ""name"": ""votesFor"",
          ""type"": ""uint256""
        },
        {
          ""internalType"": ""uint256"",
          ""name"": ""votesAgainst"",
          ""type"": ""uint256""
        },
        {
          ""internalType"": ""bool"",
          ""name"": ""open"",
          ""type"": ""bool""
        },
        {
          ""internalType"": ""bool"",
          ""name"": ""executed"",
          ""type"": ""bool""
        },
        {
          ""internalType"": ""string"",
          ""name"": ""ipfsHash"",
          ""type"": ""string""
        }
      ],
      ""stateMutability"": ""view"",
      ""type"": ""function""
    },
    {
      ""inputs"": [
        {
          ""internalType"": ""address"",
          ""name"": ""_charityContract"",
          ""type"": ""address""
        }
      ],
      ""name"": ""setCharityContract"",
      ""outputs"": [],
      ""stateMutability"": ""nonpayable"",
      ""type"": ""function""
    },
    {
      ""inputs"": [],
      ""name"": ""totalFunds"",
      ""outputs"": [
        {
          ""internalType"": ""uint256"",
          ""name"": """",
          ""type"": ""uint256""
        }
      ],
      ""stateMutability"": ""view"",
      ""type"": ""function""
    },
    {
      ""inputs"": [
        {
          ""internalType"": ""uint256"",
          ""name"": ""proposalId"",
          ""type"": ""uint256""
        },
        {
          ""internalType"": ""bool"",
          ""name"": ""support"",
          ""type"": ""bool""
        }
      ],
      ""name"": ""vote"",
      ""outputs"": [],
      ""stateMutability"": ""nonpayable"",
      ""type"": ""function""
    },
    {
      ""inputs"": [
        {
          ""internalType"": ""uint256"",
          ""name"": ""amount"",
          ""type"": ""uint256""
        }
      ],
      ""name"": ""withdraw"",
      ""outputs"": [],
      ""stateMutability"": ""nonpayable"",
      ""type"": ""function""
    }
  ]";
        _abi = JsonConvert.DeserializeObject(abiJson).ToString()!;
        _web3 = new Web3(hardhatUrl);
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
                gas: new HexBigInteger(1),
                value: new HexBigInteger(1),
                functionInput: new object[] { proposal.Description, weiAmountRequested, proposal.IpfsHash }
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
                gas: new HexBigInteger(1),
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