import { useConnect } from '../context/WalletContext';
import { FaWifi } from "react-icons/fa";
import { CiWifiOff } from "react-icons/ci";
import { User, Tooltip } from "@nextui-org/react";

function Connect() {
    const { connect, address, connected } = useConnect();

    return (
        <>
            {
                connected === false ?
                    <CiWifiOff className='text-xl hover:cursor-pointer' onClick={connect} />
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