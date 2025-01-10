namespace app.Models;

public class CreateProposalDto : ContractDto
{
    public string Description { get; set; }
    public decimal AmountRequested { get; set; }
    public string IpfsHash { get; set; }
    public string Address { get; set; }
}