import { pc, cam, doc, mart, vote, notary } from "../assets";

export const tools = [
    {
        id: 1,
        name: "Market",
        type: "Marketplace",
        image: mart,
        url: "/mart"
    },
    {
        id: 2,
        name: "FHE Vote",
        type: "Voting",
        image: vote,
        url: "/vote"
    },
    {
        id: 3,
        name: "CamAttest",
        type: "Camera",
        image: cam,
        url: "/cam"
    },
    {
        id: 4,
        name: "Photogram",
        type: "Social",
        image: pc,
        url: "/social"
    },
    {
        id: 5,
        name: "DocSign",
        type: "Document",
        image: doc,
        url: "/doc"
    },
    {
        id: 6,
        name: "Notary",
        type: "Notary",
        image: notary,
        dimensions: "w-10 h-10",
        url: "/notary"
    }
]