import { createContext, useState, useContext, ReactNode } from 'react';
import { ethers, Provider } from 'ethers';

export const WalletContext = createContext(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [connected, setConnected] = useState(false);
    const [address, setAddress] = useState('');
    const [provider, setProvider] = useState<Provider>();

    const connect = async () => {
        if (connected) return;
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        setProvider(provider)
        setAddress(address)
        setConnected(true)
    }

    return (
        <WalletContext.Provider value={{ provider, address, connect, connected }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useConnect = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useConnect must be used within a WalletProvider');
    }
    return context;
};