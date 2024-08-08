const express = require("express")
const cors = require("cors")
const { ethers } = require("ethers")
const { CAM_CONTRACT_ABI, CAM_CONTRACT_ADDRESS, CAM_EAS, CAM_SCHEMA } = require("./constants.js")
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
    const hash = await contract.keccak(auth)
    await contract.setAuth(hash, user)
    res.send({ auth })
})

app.post("/attest", async (req, res) => {
    const { auth, image, recipient } = req.body
    const eas = new EAS(CAM_EAS);
    eas.connect(signer);
    const schemaEncoder = new SchemaEncoder("bytes encryptedVote")
    const bytes32 = ethers.encodeBytes32String(image)
    const encodedData = schemaEncoder.encodeData([
        { name: "imageHash", value: bytes32, type: "bytes32" }
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
    const bytess = ethers.encodeBytes32String(uid)
    await contract.post(image, auth, bytess)
    res.send({ uid })
})

app.listen(8080, () => {
    console.log("Server is running on port 8080")
})