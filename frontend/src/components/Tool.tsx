import { Link } from 'react-router-dom';

interface ToolProps {
    name: string,
    image: any,
    url: string,
    dimensions?: string
}

function Tool(tool: ToolProps) {
    return (
        <Link to={tool.url} className="m-8 flex flex-col items-center justify-center gap-2">
            <img src={tool.image} alt="pc1" className={tool.dimensions ? tool.dimensions : "w-10 h-15"} />
            <p className="font-bold text-black">{tool.name}</p>
        </Link>
    );
}

export default Tool;