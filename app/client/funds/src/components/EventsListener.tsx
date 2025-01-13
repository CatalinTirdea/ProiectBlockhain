import { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import { ethers } from 'ethers';
import { getProvider } from '../web3Provider';

const EventsListener = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const listenToEvents = async () => {
            try {
                const provider = getProvider();
                if (!provider) {
                    throw new Error('MetaMask is not installed. Please install it to continue.');
                }

                const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with your contract address
                const abi = [
                    // Add the ABI of the events you want to listen to
                    "event DonationReceived(address indexed donor, uint256 amount)",
                    "event ProposalCreated(uint256 indexed proposalId, string title, string description, uint256 amountRequested, string ipfsHash)",
                    "event Voted(uint256 indexed proposalId, address voter, bool support)",
                    "event FundsDistributed(uint256 indexed proposalId, address recipient, uint256 amount)"
                ];

                const contract = new ethers.Contract(contractAddress, abi, provider);

                contract.on('DonationReceived', (donor, amount) => {
                    setEvents((prevEvents) => [...prevEvents, `DonationReceived: Donor=${donor}, Amount=${ethers.utils.formatEther(amount)} ETH`]);
                });

                contract.on('ProposalCreated', (proposalId, title, description, amountRequested, ipfsHash) => {
                    setEvents((prevEvents) => [...prevEvents, `ProposalCreated: ProposalId=${proposalId}, Title=${title}, Description=${description}, AmountRequested=${ethers.utils.formatEther(amountRequested)} ETH, IpfsHash=${ipfsHash}`]);
                });

                contract.on('Voted', (proposalId, voter, support) => {
                    setEvents((prevEvents) => [...prevEvents, `Voted: ProposalId=${proposalId}, Voter=${voter}, Support=${support}`]);
                });

                contract.on('FundsDistributed', (proposalId, recipient, amount) => {
                    setEvents((prevEvents) => [...prevEvents, `FundsDistributed: ProposalId=${proposalId}, Recipient=${recipient}, Amount=${ethers.utils.formatEther(amount)} ETH`]);
                });

                setLoading(false);
            } catch (err) {
                setError('Failed to listen to events');
                setLoading(false);
            }
        };

        listenToEvents();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Grid container spacing={2} justifyContent="center">
            {events.map((event, index) => (
                <Grid item xs={12} sm={6} md={6} key={index}>
                    <Card sx={{ backgroundColor: '#333', color: '#fff', minWidth: 196, marginX: 3 }}>
                        <CardContent>
                            <Typography variant="body1" gutterBottom>
                                {event}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default EventsListener;
