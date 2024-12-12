

using System.Numerics;

namespace app.Models;

public class Proposal
{
    public int? Id { get; set; }
    public string Description { get; set; }
    public int? AmountRequested { get; set; }
    public int? VotesFor { get; set; }
    public int? VotesAgainst { get; set; }
    public bool Open { get; set; }
    public bool Executed { get; set; }
    public string? IpfsHash { get; set; }
}