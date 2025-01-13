using Nethereum.ABI.FunctionEncoding.Attributes;
using System.Numerics;

public class FundsDistributedEventDto
{
    [Parameter("uint256", "proposalId", 1, true)]
    public BigInteger ProposalId { get; set; }

    [Parameter("uint256", "amount", 2, false)]
    public BigInteger Amount { get; set; }
}