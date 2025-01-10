import React, { useContext, useState } from "react";
import { TextField, Button, Typography, Box, CircularProgress } from "@mui/material";
import crypto from "crypto-js";
import { Context } from "../App.tsx";

function CreateProposal() {
    const [description, setDescription] = useState("");
    const [amountRequested, setAmountRequested] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { address } = useContext(Context);

    const handleSubmit = async () => {
        if (!description || !amountRequested) {
            setMessage("Please fill in all fields.");
            return;
        }

        // Prevent multiple submissions
        if (loading) return;

        setLoading(true);
        setMessage("");

        try {
            // Generate hash for description
            const hash = crypto.SHA256(description).toString();

            // Create payload for backend
            const proposalData = {
                Description: description,
                AmountRequested: amountRequested,
                IpfsHash: hash,
                address: address,
            };

            // Send data to backend
            const response = await fetch("http://localhost:5181/api/createProposal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(proposalData),
            });

            if (response.ok) {
                setMessage("Proposal created successfully!");
                setDescription("");
                setAmountRequested("");
            } else {
                const error = await response.json();
                setMessage(`Error: ${error.Error || "Something went wrong"}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
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
                borderRadius: "8px",
                boxShadow: 3,
            }}
        >
            <Typography variant="h5" align="center" gutterBottom>
                Create Proposal
            </Typography>
            <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{
                    marginBottom: "16px",
                    "& .MuiInputBase-root": { color: "#ffffff" },
                    "& .MuiInputLabel-root": { color: "#aaaaaa" },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444444" },
                }}
            />
            <TextField
                label="Amount Requested (ETH)"
                variant="outlined"
                fullWidth
                type="number"
                value={amountRequested}
                onChange={(e) => setAmountRequested(e.target.value)}
                sx={{
                    marginBottom: "16px",
                    "& .MuiInputBase-root": { color: "#ffffff" },
                    "& .MuiInputLabel-root": { color: "#aaaaaa" },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444444" },
                }}
            />
            {loading ? (
                <Box sx={{ textAlign: "center", marginBottom: "16px" }}>
                    <CircularProgress size={24} sx={{ color: "#ffffff" }} />
                </Box>
            ) : (
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSubmit}
                    sx={{
                        backgroundColor: "#4caf50",
                        "&:hover": { backgroundColor: "#45a045" },
                    }}
                >
                    Submit Proposal
                </Button>
            )}
            {message && (
                <Typography
                    variant="body1"
                    align="center"
                    sx={{ marginTop: "16px", color: message.includes("Error") ? "#ff5252" : "#4caf50" }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );
}

export default CreateProposal;