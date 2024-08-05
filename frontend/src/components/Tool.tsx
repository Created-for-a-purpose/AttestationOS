interface ToolProps {
    name: string,
    image: any,
    url: string,
    dimensions?: string
}

function Tool(tool: ToolProps) {
    return (
        <div className="m-8 flex flex-col items-center justify-center gap-2 hover:cursor-pointer">
            <img src={tool.image} alt="pc1" className={tool.dimensions ? tool.dimensions : "w-10 h-15"} />
            <p className="font-bold">{tool.name}</p>
        </div>
    );
}

export default Tool;