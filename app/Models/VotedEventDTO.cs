using Nethereum.ABI.FunctionEncoding.Attributes;
using System.Numerics;

public class VotedEventDto
{
    [Parameter("address", "voter", 1, true)]
    public string Voter { get; set; }

    [Parameter("uint256", "proposalId", 2, true)]
    public BigInteger ProposalId { get; set; }

    [Parameter("bool", "support", 3, false)]
    public bool Support { get; set; }
}