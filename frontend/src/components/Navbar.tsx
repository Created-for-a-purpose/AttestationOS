import logo from '/os.png'
import Connect from './Connect';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, DateInput } from "@nextui-org/react";
import { parseZonedDateTime } from "@internationalized/date";

function NavbarWrapper() {
    return (
        <Navbar className='bg-black text-white' height='2rem' maxWidth='2xl'>
            <NavbarBrand>
                <img src={logo} alt="logo" className="hover:drop-shadow-glow w-7 h-6 mr-3" />
                <p className="font-bold tracking-wider text-inherit text-lg hover:drop-shadow-glow">AttestationOS</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-7" justify="center">
                <NavbarItem>File</NavbarItem>
                <NavbarItem>View</NavbarItem>
                <NavbarItem>Window</NavbarItem>
            </NavbarContent>
            <NavbarContent justify='end' className='gap-3'>
                <NavbarItem>
                    <Connect />
                </NavbarItem>
                <NavbarItem>
                    <DateInput
                        hideTimeZone
                        color='primary'
                        size='sm'
                        classNames={{ inputWrapper: 'bg-black' }}
                        value={parseZonedDateTime(new Date().toISOString().replace('Z', '[America/Los_Angeles]'))}
                        isReadOnly={true}
                    />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}

export default NavbarWrapper;