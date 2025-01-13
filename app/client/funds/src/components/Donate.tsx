import { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, Alert, Button, TextField, MenuItem } from '@mui/material';

const Donate = () => {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProposal, setSelectedProposal] = useState('');
    const [amount, setAmount] = useState('');

    // Fetch proposals on component mount using fetch
    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const response = await fetch('http://localhost:5181/api/getAllProposals');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                setProposals(data); // Assuming response data is the list of proposals
            } catch (err) {
                setError('Failed to load proposals');
            } finally {
                setLoading(false);
            }
        };

        fetchProposals();
    }, []);

    const handleDonate = async () => {
        setError('Submitting donation...');

        try {
            const response = await fetch('http://localhost:5181/api/donate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Address: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Replace with your Ethereum address
                    ProposalId: selectedProposal,
                    Amount: amount,
                }),
            });

            if (response.ok) {
                setError('Donation submitted successfully!');
            } else {
                try {
                    const error = await response.json();
                    setError(`Error: ${error.Error || 'Something went wrong'}`);
                } catch (jsonError) {
                    setError('Error: Failed to parse error response');
                }
            }
        } catch (error) {
            setError(`Error: ${(error as Error).message}`);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6} md={6}>
                <Card sx={{ backgroundColor: '#333', minWidth: 196, marginX: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Donate to a Proposal
                        </Typography>
                        <TextField
                            select
                            label="Select Proposal"
                            value={selectedProposal}
                            onChange={(e) => setSelectedProposal(e.target.value)}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            sx={{ backgroundColor: '#fff' }}
                        >
                            {proposals.map((proposal) => (
                                <MenuItem key={proposal.id} value={proposal.id}>
                                    {proposal.title}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            sx={{ backgroundColor: '#fff' }}
                        />
                        <Button variant="contained" color="primary" onClick={handleDonate} sx={{ marginTop: 2 }}>
                            Donate
                        </Button>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Donate;
