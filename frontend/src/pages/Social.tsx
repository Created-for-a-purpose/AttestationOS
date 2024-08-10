import NavbarWrapper from "../components/Navbar";
import Toolbar from "../components/Toolbar";
import os from "/os.png"
import { MdVerified } from "react-icons/md";
import { Card, CardBody, CardFooter, Input, Button, CardHeader } from "@nextui-org/react";
import { ethers } from "ethers";
import { CAM_CONTRACT_ABI, CAM_CONTRACT_ADDRESS, CAM_EAS, CAM_SCHEMA } from "../utils/constants";
import { useState } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk"
import { useConnect } from "../context/WalletContext";

function Social() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const [uploadedImage, setUploadedImage] = useState<File | null>(null)
    const [images, setImages] = useState<any>([])
    const { address } = useConnect()

    const handleUpload = async () => {
        let imgHash = ''
        const reader = new FileReader();
        reader.onloadend = () => {
            const data = reader.result as string
            imgHash = ethers.keccak256(ethers.toUtf8Bytes(data))
            console.log(imgHash)
        }
        reader.readAsDataURL(uploadedImage);
        const signer = await provider.getSigner()
        const camContract = new ethers.Contract(CAM_CONTRACT_ADDRESS, CAM_CONTRACT_ABI, signer)
        const uid = await camContract.imageUidMap(imgHash)
        const attestationScore = await camContract.attestationScore(imgHash)
        if (uid != '0x') {
            setImages([...images, { image: imgHash, attestationScore: attestationScore, attested: true }])
        } else {
            const tx = await camContract.post_without_attestation(imgHash)
            await tx.wait()
            setImages([...images, { image: imgHash, attestationScore, attested: false }])
        }
    }

    const attest = async (imgHash: string) => {
        const signer = await provider.getSigner()
        const eas = new EAS(CAM_EAS)
        eas.connect(signer)
        const offchain = await eas.getOffchain()
        const schemaEncoder = new SchemaEncoder('bytes32 imgHash');
        const encodedData = schemaEncoder.encodeData([
            { name: 'imgHash', value: imgHash, type: 'bytes32' },
        ]);
        const offchainAttestation = await offchain.signOffchainAttestation(
            {
                recipient: address,
                expirationTime: 0n,
                time: BigInt(Math.floor(Date.now() / 1000)),
                revocable: false,
                schema: CAM_SCHEMA,
                refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
                data: encodedData
            },
            signer
        )
        if (!offchainAttestation) return
        const camContract = new ethers.Contract(CAM_CONTRACT_ADDRESS, CAM_CONTRACT_ABI, signer)
        const tx = await camContract.attest(imgHash, offchainAttestation.uid)
        await tx.wait()
    }

    return (
        <>
            <NavbarWrapper />
            <Toolbar name="Cam-Attest" />
            <div className="bg-gray-400 flex fixed w-[95%] border-2 p-2 border-black ml-[2%] h-[80%]">
                <div className="flex flex-wrap w-[70%] justify-center items-center gap-3 p-2">
                    {images.map((img: any, index: number) => (
                        <Card key={index} className="w-50 h-50 m-2 text-white bg-gray-800 flex items-center">
                            <CardHeader className="text-center">Attestation score: {img.attestationScore.toString()}
                                {img.attestationScore.toString() == '1000' && <MdVerified className="ml-1 text-green-400" />}</CardHeader>
                            <CardBody className="flex flex-col items-center justify-center gap-2">
                                <img src={os} alt="Image" className="w-20 h-20" />
                            </CardBody>
                            <CardFooter className="flex flex-col justify-center before:bg-white/10 border-white/20 border-1">
                                {img.image.slice(0, 5) + '...' + img.image.slice(-5)}
                                {!img.attested && <Button className="p-2 w-[90%]" onClick={() => attest(img.image)}>Attest</Button>}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <div className="flex flex-col gap-5 items-center justify-center w-[30%]">
                    <div className="bg-gray-800 w-[90%] h-[45%] rounded-lg">
                        {
                            uploadedImage &&
                            <>
                                <img src={URL.createObjectURL(uploadedImage)} className="w-full h-full rounded-lg mb-5" />
                            </>
                        }
                    </div>
                    <Input type="file" onChange={(e) => setUploadedImage(e.target.files?.[0])} />
                    {uploadedImage && <Button className="w-[50%]" color="secondary" onClick={handleUpload}>Upload</Button>}
                </div>
            </div>
        </>
    )
}

export default Social;