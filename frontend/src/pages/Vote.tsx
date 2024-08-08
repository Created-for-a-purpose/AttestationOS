import { useState } from "react";
import { tools } from "../utils/tools.js";
import { ethers } from "ethers";
import { useConnect } from "../context/WalletContext.js";
import NavbarWrapper from "../components/Navbar";
import Toolbar from "../components/Toolbar";
import { getPublickey, getResult, addVote } from "../api";
import { FaEye, FaFire } from "react-icons/fa6";
import { Button, Card, CardBody, CardFooter, Input } from "@nextui-org/react";
import { POLL_CREATOR, VOTE_EAS, VOTE_UID } from "../utils/constants.js";
import init, { init_panic_hook, TfheCompactPublicKey, CompactCiphertextList, FheUint32 } from "../../wasm/pkg/tfhe.js"
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

function Vote() {
    const [vote, setVote] = useState<number>(0);
    const [uid, setUid] = useState<string>("");
    const [result, setResult] = useState<string>("See results");
    const [votePoints, setVotePoints] = useState<number>(500);
    const { provider } = useConnect();

    const encrypt = async (vote: number) => {
        await init();
        await init_panic_hook();
        const pKey = await getPublickey();
        const publicKey = TfheCompactPublicKey.deserialize(pKey);
        const builder = CompactCiphertextList.builder(publicKey);
        builder.push_u32(vote);
        const compactList = builder.build();
        const g = compactList.expand().get_uint32(0);
        return g.serialize();
    }

    const attestAndVote = async () => {
        if (!provider) return;
        const encryptedVote = await encrypt(vote);
        const wd = window.open('', "_blank");
        wd?.document.write("Encrypted vote\n", encryptedVote.toString());

        const signer = await provider.getSigner();
        const eas = new EAS(VOTE_EAS);
        eas.connect(signer);
        const schemaEncoder = new SchemaEncoder("bytes encryptedVote");
        const bytes = ethers.hexlify(encryptedVote);
        const value = ethers.keccak256(bytes);
        const data = schemaEncoder.encodeData([
            { name: "encryptedVote", value, type: "bytes" }
        ])
        const tx = await eas.attest({
            schema: VOTE_UID,
            data: {
                recipient: POLL_CREATOR,
                revocable: false,
                data
            }
        });
        await tx.wait().then((uid) => setUid(uid));
        const res = await addVote(encryptedVote).then(() => setVotePoints(votePoints - vote));
        console.log(res);
    }

    return (
        <>
            <NavbarWrapper />
            <Toolbar name="FHE-Vote" />
            <div className="bg-gray-400 fixed w-[95%] border-2 p-2 border-black ml-[2%] h-[80%]">
                <h1 className="font-bold text-lg text-center m-1">Vote privately 🤫</h1>
                <div className="mt-[3rem] w-full flex flex-wrap justify-center items-center gap-10">
                    {
                        tools.map((project, index) => (
                            <Card className="py-4 bg-blue" key={index}>
                                <CardBody className="overflow-visible h-[100px]">
                                    <img
                                        alt="Card background"
                                        className="object-cover rounded-xl w-[100px] h-[100px]"
                                        src={project.image}
                                    />
                                </CardBody>
                                <CardFooter className="mt-7 pb-0 pt-2 flex-col items-center text-center">
                                    <h4 className="font-bold text-large text-white">{project.name}</h4>
                                </CardFooter>
                            </Card>
                        ))
                    }
                </div>
                <div className="mt-7 flex flex-col items-center justify-center gap-7">
                    <div className="m-2 flex gap-3 items-center">
                        <Input type="number" variant="bordered" onChange={(e) => setVote(parseInt(e.target.value))} />
                        <Button color="secondary" onClick={attestAndVote}>Vote</Button>
                    </div>
                    {uid && <p className="text-md font-bold">EAS scan:
                        <a href={`https://base-sepolia.easscan.org/attestation/view/${uid}`} target="_blank" className="cursor-pointer">
                            {uid}
                        </a>
                    </p>
                    }
                    <div className="flex gap-7 mb-1 w-full items-center justify-center">
                        <Button onClick={async () => {
                            if (result !== "See results") {
                                setResult("See results");
                                return;
                            }
                            const res = await getResult();
                            setResult(res);
                        }} color="secondary" startContent={<FaEye />}>{result}</Button>
                        <Input startContent={<FaFire />} className="w-[160px]" readOnly value={`Vote points: ${votePoints}`} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Vote;