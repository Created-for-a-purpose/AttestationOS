import NavbarWrapper from "../components/Navbar";
import Footer from "../components/Footer";
import Tool from "../components/Tool";
import { tools } from "../utils/tools";

function Home() {
    return (
        <>
            <NavbarWrapper />
            <div className="grid grid-cols-2 bottom-auto m-10 fixed">
                {tools.map((tool) => (
                    <Tool key={tool.id} name={tool.name} image={tool.image} url={tool.url}
                        dimensions={tool.dimensions} />
                ))}
            </div>
            <div className="fixed bottom-0 inset-x-0 flex justify-center mb-4">
                <Footer />
            </div>
        </>
    );
}

export default Home;