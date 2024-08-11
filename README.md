# AttestationOS
AttestationOS comprises of several useful tools like EAS notary, CamAttest, Photogram and FHE vote. Each application showcase the real world potential of attestations and how users can leverage them. Lets go in detail of each tool:

1. EAS notary: This tool is mainly a browser extension which listens to network HAR (HTTP archive response) when a user opens their social media (x.com here). Then the notary signs user's HAR responses like auth_token and timestamp. This signature is uploaded to AttestationOS where it is sent to the attestor for verification. If the signature is verified and corersponds to the notary extension, then an attestation is issued to the user with a validity of 1 day, acting as a proof of social media presence.

2. CamAttest: This tool creates a photo clicking session for the user, once a user clicks a photo, the image is hashed and sent to the attestor for issuing onchain EAS attestation. This attestation serves as a proof that the photo was clicked using CamAttest and is not a deep fake. All image hashes are sent to Cam.sol contract by the attestor and assigned an attestation score of 1000.

3. Photogram: It is a social media/content sharing platform, where users would upload their images/content. All content captured using CamAttest was assigned a score of 1000, so this is detected and the content is shown as verified and are not deepfakes. All other media uploaded are assigned a very low score, and are suspicious of being deepfakes. However, users can attest to this media if they doesnt seem like deepfakes, each attestation by a different user increases the score linearly. However, if a user attests a particular image multiple times, then the score gradually increases.

4. FHE vote: A privacy preserving voting platform where users encrypt their votes using FHE, create an attestation as a witness of vote. This encrypt vote is sent to the FHE engine (network of FHE computation nodes) where it is homorphically added to the previous votes without the need for decryption. Once the vote period is concluded, anyone can request decryption of vote results. Individual votes remain always hidden in this process.

## Components
The project has several components. The main components being Attestor node, AttestationOS browser extension and FHE engine. Attestor node is created using node express and is responsible for verifying users and issuing them EAS attestations if they are found eligible. 

AttestationOS browser extension is created using vanilla html, css, js, ethers.min.js for listening over user network HAR when they are logged into twitter(x) account. The tokens extracted from there are hashed and signed alongwith the timestamp. This signature is verified by attestor node and EAS attestation is issued to the user. 

FHE engine is created using tfhe-rs for encrypted computation. I also compiled tfhe-rs to wasm so that users are able to encrypt their votes from the frontend and create attestation over that and include in encrypted vote results.
