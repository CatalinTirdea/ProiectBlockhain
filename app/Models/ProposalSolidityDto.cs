namespace app.Models;

using System.Numerics;
using Nethereum.ABI.FunctionEncoding.Attributes;

[FunctionOutput]
public class ProposalSolidityDto
{
    [Parameter("string", "description", 1)]
    public string Description { get; set; }

    [Parameter("uint256", "amountRequested", 2)]
    public BigInteger? AmountRequested { get; set; }

    [Parameter("uint256", "votesFor", 3)]
    public BigInteger? VotesFor { get; set; }

    [Parameter("uint256", "votesAgainst", 4)]
    public BigInteger? VotesAgainst { get; set; }

    [Parameter("bool", "open", 5)]
    public bool Open { get; set; }

    [Parameter("bool", "executed", 6)]
    public bool Executed { get; set; }

    [Parameter("string", "ipfsHash", 7)]
    public string IpfsHash { get; set; }
}
