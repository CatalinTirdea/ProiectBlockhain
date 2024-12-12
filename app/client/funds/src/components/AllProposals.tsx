import { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, Alert, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

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
                setError('Failed to load proposals');
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
        <Grid container spacing={2} justifyContent="center">
            {proposals.map((proposal, index) => (
                <Grid item xs={12} sm={6} md={6} key={index}>
                    <Card sx={{ backgroundColor: '#333', color: '#fff', minWidth: 196, marginX: 3 }}>
                        <CardContent>
                            <Typography variant="caption">
                                #{proposal.id}
                            </Typography>
                            <Typography
                                variant="body1"
                                gutterBottom
                                sx={{
                                    wordWrap: 'break-word', // Ensure long words break
                                    overflowWrap: 'break-word', // Ensure text breaks when it overflows
                                    whiteSpace: 'normal', // Allow normal wrapping and line breaks
                                }}
                            >
                                {proposal.description}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: proposal.open ? '#4caf50' : '#f44336', // Green if open, red if closed
                                    fontWeight: 'normal',
                                }}
                            >
                                Status: {proposal.open ? 'Open' : 'Closed'}
                            </Typography>
                            {!proposal.open && (
                                <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                                    Executed: {proposal.executed ? 'Yes' : 'No'}
                                </Typography>
                            )}
                            <Grid container spacing={1} alignItems="center" sx={{ marginTop: 2 }}>
                                <Grid item>
                                    <IconButton disabled>
                                        <ThumbUpIcon sx={{ color: '#4caf50' }} />
                                    </IconButton>
                                    <Typography variant="body2" sx={{ color: '#4caf50' }}>
                                        {proposal.votesFor}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton disabled>
                                        <ThumbDownIcon sx={{ color: '#f44336' }} />
                                    </IconButton>
                                    <Typography variant="body2" sx={{ color: '#f44336' }}>
                                        {proposal.votesAgainst}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default AllProposals;
