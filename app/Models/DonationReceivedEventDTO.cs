using Nethereum.ABI.FunctionEncoding.Attributes;
using System.Numerics;

public class DonationReceivedEventDto
{
    [Parameter("address", "from", 1, true)]
    public string From { get; set; }

    [Parameter("uint256", "amount", 2, false)]
    public BigInteger Amount { get; set; }
}