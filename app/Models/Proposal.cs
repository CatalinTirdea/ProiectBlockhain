

using System.Numerics;

namespace app.Models;

public class Proposal
{
    public string Description { get; set; }
    public BigInteger AmountRequested { get; set; }
    public BigInteger VotesFor { get; set; }
    public BigInteger VotesAgainst { get; set; }
    public bool Open { get; set; }
    public bool Executed { get; set; }
    public string IpfsHash { get; set; }
}