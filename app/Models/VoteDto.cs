namespace app.Models
{
    public class VoteDto
    {
        public string Address { get; set; }
        public int ProposalId { get; set; }
        public bool Support { get; set; }
    }
}