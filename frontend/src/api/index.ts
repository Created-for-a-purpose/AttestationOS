export async function getPublickey() {
    const response = await fetch("http://localhost:8080/pkey");
    return response.json();
}

export async function getResult() {
    const response = await fetch("http://localhost:8080/result");
    return response.json();
}

export async function addVote(encryptedVote: Uint8Array) {
    const response = await fetch("http://localhost:8080/vote", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify([...encryptedVote])
    });
    return response.text();
}