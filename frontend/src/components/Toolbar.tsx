import { min, max, cross } from "../assets";
import { Link } from "react-router-dom";

function Toolbar({ name }: { name: string }) {
    return (
        <div className="flex justify-between items-center bg-cream border-black border-2 p-1 h-6 font-sans w-[95%] mt-4 ml-[2%]">
            <div className="flex items-center">
                <span className="text-sm font-bold p-1">{name}</span>
            </div>
            <div className="flex space-x-1">
                <Link to="/" aria-label="Home" className="w-5 h-5 bg-gray-400" style={{ backgroundImage: `url(${min})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }} />
                <Link to="#" aria-label="Maximize" className="w-5 h-5 bg-gray-400" style={{ backgroundImage: `url(${max})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }} />
                <Link to="/" aria-label="Close" className="w-5 h-5 bg-gray-400" style={{ backgroundImage: `url(${cross})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }} />
            </div>
        </div>
    )
}

export default Toolbar;