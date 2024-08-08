import { useState, useRef } from "react";
import NavbarWrapper from "../components/Navbar";
import Toolbar from "../components/Toolbar";
import { Button } from "@nextui-org/react";
import { ethers } from "ethers";

function Cam() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [image, setImage] = useState<string>('');
    const [hash, setHash] = useState<string>('');
    const [uid, setUid] = useState<string>('');

    const startCamera = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    setIsCameraOn(true);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const clickPicture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
            const data = canvas.toDataURL('image/png');
            setImage(data);
            const hash = ethers.keccak256(ethers.toUtf8Bytes(data));
            setHash(hash);
        }
    }

    return (
        <>
            <NavbarWrapper />
            <Toolbar name="Cam-Attest" />
            <div className="bg-gray-400 fixed w-[95%] border-2 p-2 border-black ml-[2%] h-[80%]">
                <h1 className="font-bold text-lg text-center m-1">Empowering autheticity ⚡</h1>
                <div className="mt-[5rem] flex gap-10 items-center justify-center">
                    <div className="w-[40%] h-[300px]">
                        {image ? <img src={image} alt="Captured" className="w-full border-2 rounded-md border-black h-full" />
                            : <video ref={videoRef} className="bg-gray-800 w-full h-full rounded-md shadow-lg" />}
                        <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                    <div className="ml-[10%] w-[40%] flex flex-col items-center justify-center">
                        {
                            isCameraOn ? <Button onClick={clickPicture} color="secondary" className="m-4">Click Picture</Button>
                                : <Button onClick={startCamera} color="secondary" className="m-4">Start Camera</Button>
                        }
                        {hash && <p className="p-2 font-bold">Image hash: {hash.slice(0, 10) + '...' + hash.slice(-10)}</p>}
                        {uid && <p className="p-2 font-bold">EAS: {`https://base-sepolia.easscan.org/attestation/view/${uid}`}</p>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cam;