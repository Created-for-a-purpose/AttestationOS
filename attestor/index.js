const express = require("express")
const cors = require("cors")
const { ethers } = require("ethers")
const { CAM_CONTRACT_ABI, CAM_CONTRACT_ADDRESS, CAM_EAS, CAM_SCHEMA, NOTARY_SCHEMA, ATTESTOR_PUBLIC_KEY } = require("./constants.js")
const { EAS, SchemaEncoder } = require("@ethereum-attestation-service/eas-sdk")
const dotenv = require("dotenv")
dotenv.config()

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

const app = express()
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.json())

app.post("/start", async (req, res) => {
    const { user } = req.body
    const auth = Math.random().toString().slice(2, 8)
    const contract = new ethers.Contract(CAM_CONTRACT_ADDRESS, CAM_CONTRACT_ABI, signer)
    const authHash = await contract.keccak(auth)
    const tx = await contract.setAuth(authHash, user)
    await tx.wait()
    res.send({ auth })
})

app.post("/attest", async (req, res) => {
    const { auth, image, recipient } = req.body
    const eas = new EAS(CAM_EAS);
    eas.connect(signer);
    const schemaEncoder = new SchemaEncoder("bytes32 imageHash")
    const encodedData = schemaEncoder.encodeData([
        { name: "imageHash", value: image, type: "bytes32" }
    ])
    const tx = await eas.attest({
        schema: CAM_SCHEMA,
        data: {
            recipient,
            expirationTime: 0,
            revocable: false,
            data: encodedData,
        },
    });
    const uid = await tx.wait();
    const contract = new ethers.Contract(CAM_CONTRACT_ADDRESS, CAM_CONTRACT_ABI, signer)
    const nonce = await provider.getTransactionCount(signer.address)
    console.log(auth, typeof auth)
    const { hash } = await contract.post(image, auth, uid, {
        gasLimit: 1000000,
        nonce: nonce + 1
    })
    console.log(hash)
    res.send({ uid })
})

app.post("/notarize", async (req, res) => {
    const { message, signature, timestamp, address } = req.body;
    // verify the signature
    const recoveredAddress = ethers.verifyMessage(message, signature)
    if (recoveredAddress !== ATTESTOR_PUBLIC_KEY) {
        return res.status(400).send({ error: "Invalid signature" })
    }

    const eas = new EAS(CAM_EAS);
    eas.connect(signer);
    const schemaEncoder = new SchemaEncoder("string message, string signature, uint256 timestamp")
    const encodedData = schemaEncoder.encodeData([
        { name: "message", value: message, type: "string" },
        { name: "signature", value: signature, type: "string" },
        { name: "timestamp", value: timestamp, type: "uint256" }
    ])
    const expirationTime = BigInt(Math.floor(Date.now() / 1000)+86400)
    const transaction = await eas.attest({
        schema: NOTARY_SCHEMA,
        data: {
            recipient: address,
            expirationTime,
            revocable: false,
            data: encodedData
        }
    })
    const uid = await transaction.wait()
    res.send({ uid })
})

app.listen(8080, () => {
    console.log("Server is running on port 8080")
})