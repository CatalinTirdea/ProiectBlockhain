// src/components/ProposalList.jsx
import { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';

const AllProposals = () => {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch proposals on component mount using fetch
    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const response = await fetch('https://localhost:7070/api/getAllProposals');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProposals(data); // Assuming response data is the list of proposals
            } catch (err) {
                
            } finally {
                setLoading(false);
            }
        };

        fetchProposals();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Grid container spacing={3} justifyContent="center">
            {proposals.map((proposal, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {proposal.Description}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Status: {proposal.Open ? 'Open' : 'Closed'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default AllProposals;
