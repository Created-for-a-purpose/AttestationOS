import NavbarWrapper from "../components/Navbar";
import Toolbar from "../components/Toolbar";
import init, { init_panic_hook, TfheClientKey, TfheConfigBuilder, TfheCompactPublicKey, CompactCiphertextList } from "../../wasm/pkg/tfhe.js"

function Vote() {
    const encrypt = async () => {
        await init();
        await init_panic_hook();
        const config = TfheConfigBuilder.default().build();
        const key = TfheClientKey.generate(config);
        const publicKey = TfheCompactPublicKey.new(key)
        const builder = CompactCiphertextList.builder(publicKey);
        builder.push_u32(4_294_967_296);
        const compactList = builder.build();
        const g = compactList.expand().get_uint32(0);
        console.log("Encrypted", g.serialize());
    }

    return (
        <>
            <NavbarWrapper />
            <Toolbar name="FHE-Vote" />
            <div className="bg-gray-400 fixed w-[95%] border-2 p-2 border-black ml-[2%] h-[80%]">
            </div>
        </>
    );
}

export default Vote;