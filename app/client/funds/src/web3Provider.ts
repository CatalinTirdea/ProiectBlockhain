import { BrowserProvider } from 'ethers';

export const getProvider = (): BrowserProvider | null => {
    if (window.ethereum) {
        console.log("MetaMask is installed!");
        const provider = new BrowserProvider(window.ethereum);
        console.log("Provider created:", provider);
        return provider;
    } else {
        console.error("MetaMask is not installed!");
        return null;
    }
};

export const getSigner = async (): Promise<any | null> => {
    const provider = getProvider();
    if (provider) {
        try {
            const signer = await provider.getSigner();
            console.log("Signer created:", signer);
            return signer;
        } catch (error) {
            console.error("Failed to get signer:", error);
            return null;
        }
    } else {
        console.error("Provider is not available!");
        return null;
    }
};