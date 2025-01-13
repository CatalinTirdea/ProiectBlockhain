using Nethereum.ABI.FunctionEncoding.Attributes;
using System.Numerics;

public class ProposalCreatedEventDto
{
    [Parameter("uint256", "proposalId", 1, true)]
    public BigInteger ProposalId { get; set; }

    [Parameter("string", "description", 2, false)]
    public string Description { get; set; }
}