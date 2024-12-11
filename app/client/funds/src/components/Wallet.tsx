import React, {useContext, useState} from "react";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import {Context} from "../App.tsx";
declare global {
    interface Window{
        ethereum?:MetaMaskInpageProvider
    }
}
function Wallet() {
    const [walletAddress, setWalletAddress] = useState("");
    const [balance, setBalance] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [network, setNetwork] = useState("");
    const { setAddress } = useContext(Context);
    

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                setErrorMessage("MetaMask is not installed. Please install it to continue.");
                return;
            }

            setLoading(true);

            // Request wallet connection
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const waddress = accounts[0];
            setWalletAddress(waddress);
            setAddress(waddress);

            // Fetch balance
            const provider = new ethers.BrowserProvider(window.ethereum);
            const balanceInWei = await provider.getBalance(waddress);
            const balanceInEth = ethers.formatEther(balanceInWei);
            setBalance(balanceInEth);

            // Check network
            const networkDetails = await provider.getNetwork();
            setNetwork(networkDetails.name);

            setErrorMessage("");
        } catch (error) {
            setErrorMessage(`Error connecting wallet: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: "400px",
                margin: "auto",
                padding: "20px",
                backgroundColor: "#1e1e1e", // Dark background
                color: "#ffffff", // White text for contrast
                borderRadius: "8px",
                boxShadow: 3,
                textAlign: "center",
            }}
        >
            <Typography variant="h5" gutterBottom>
                Wallet Connection
            </Typography>

            {!walletAddress ? (
                <Button
                    variant="contained"
                    onClick={connectWallet}
                    sx={{
                        backgroundColor: "#2196f3",
                        "&:hover": { backgroundColor: "#1976d2" },
                        marginBottom: "16px",
                    }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="secondary" /> : "Connect MetaMask"}
                </Button>
            ) : (
                <>
                    <Typography variant="body1" sx={{ marginBottom: "8px" }}>
                        <strong>Wallet Address:</strong> {walletAddress}
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "8px" }}>
                        <strong>Balance:</strong> {balance} ETH
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "8px" }}>
                        <strong>Network:</strong> {network}
                    </Typography>
                </>
            )}

            {errorMessage && (
                <Typography variant="body1" sx={{ color: "#ff5252", marginTop: "8px" }}>
                    {errorMessage}
                </Typography>
            )}
        </Box>
    );
}

export default Wallet;
