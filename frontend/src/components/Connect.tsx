import { useState } from "react";
import { FaWifi } from "react-icons/fa";
import { User, Tooltip } from "@nextui-org/react";
import { ethers } from "ethers";

function Connect() {
    const [connected, setConnected] = useState(false);
    const [address, setAddress] = useState('');

    const connect = async () => {
        if (connected) return;
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        setAddress(address)
        setConnected(true)
    }

    return (
        <>
            {
                connected === false ?
                    <FaWifi className='hover:cursor-pointer' onClick={connect} />
                    : (
                        <Tooltip
                            classNames={{
                                content: 'bg-black text-white',
                            }}
                            offset={15}
                            content={
                                <User
                                    name={address.slice(0, 6) + '...' + address.slice(-4)}
                                    avatarProps={{
                                        src: `https://shorturl.at/wnSUx`,
                                        size: 'sm',
                                    }}
                                />
                            }>
                            <div>
                                <FaWifi />
                            </div>
                        </Tooltip>
                    )}
        </>
    )
}

export default Connect;