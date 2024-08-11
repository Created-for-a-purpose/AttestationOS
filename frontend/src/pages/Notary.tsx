import { useState } from "react";
import { ethers } from "ethers";
import { Button, Divider, Input } from "@nextui-org/react";
import NavbarWrapper from "../components/Navbar";
import Toolbar from "../components/Toolbar";
import { useConnect } from "../context/WalletContext";

function Notary() {
    const { address } = useConnect();
    const [file, setFile] = useState<any>(null);
    const [uid, setUid] = useState<string>('');

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.files?.[0];
        if (input) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const text = e.target?.result;
                const data = JSON.parse(text);
                const token_hash = ethers.keccak256(ethers.toUtf8Bytes(data.access_token));
                const message = ethers.keccak256(ethers.toUtf8Bytes(data.access_token + data.timestamp));
                setFile({
                    token_hash,
                    message,
                    timestamp: data.timestamp,
                    signature: data.signature,
                })
            }
            reader.readAsText(input);
        }
    }

    const notarize = async () => {
        const payload = {
            message: file.message,
            signature: file.signature,
            timestamp: file.timestamp,
            address
        }
        const response = await fetch('http://localhost:8080/notarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        await response.json().then((data) => setUid(data.uid));
    }

    return (
        <>
            <NavbarWrapper />
            <Toolbar name="EAS Notary" />
            <div className="bg-gray-400 fixed w-[95%] border-2 p-2 border-black ml-[2%] h-[80%] flex justify-center items-center">
                <div className="flex flex-col gap-5 w-[50%] h-[90%] p-2 items-center">
                    <div className="flex flex-col items-center w-full h-[70%] bg-gray-800 rounded-lg">
                        {
                            file && <>
                                <div className="text-white text-center p-2">File Details</div>
                                <Divider className="bg-white w-[98%] mb-2" />
                                <div className="text-white text-center p-2">Token Hash: {file?.token_hash}</div>
                                <div className="text-white text-center p-2">Message: {file?.message}</div>
                                <div className="text-white text-center p-2">Timestamp: {file?.timestamp}</div>
                                <div className="text-white text-center p-2">Signature: {file?.signature.slice(0, 20) + '...' + file?.signature.slice(-20)}</div>
                            </>
                        }
                    </div>
                    <Input type="file" placeholder="Upload File" className="w-[70%]" onChange={(e) => handleFile(e)} />
                    <Button color="secondary" className="w-[50%]" onClick={notarize}>Notarize</Button>
                    {uid &&
                        <p className="font-bold">EAS scan: <a href={`https://base-sepolia.easscan.org/attestation/view/${uid}`} target="_blank" className="text-purple-800">Click here</a></p>
                    }
                </div>
            </div>
        </>
    )
}

export default Notary;