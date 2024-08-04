interface ToolProps {
    name: string,
    image: any,
    url: string,
    dimensions?: string
}

function Tool(tool: ToolProps) {
    return (
        <img src={tool.image} alt="pc1" className={tool.dimensions ? tool.dimensions : "w-20"} />
    );
}

export default Tool;