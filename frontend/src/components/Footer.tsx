import { Autocomplete, AutocompleteItem, Avatar } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { tools } from '../utils/tools'

function Footer() {
    return (
        <Autocomplete
            classNames={{
                base: "max-w-md",
                listboxWrapper: "max-h-[320px]",
                selectorButton: "text-default-500",
            }}
            defaultItems={tools}
            inputProps={{
                classNames: {
                    input: "ml-1 text-white",
                    inputWrapper: "h-[48px] bg-black",
                },
            }}
            listboxProps={{
                hideSelectedIcon: true,
                itemClasses: {
                    base: [
                        "rounded-medium",
                        "text-default-500",
                        "transition-opacity",
                        "data-[hover=true]:text-foreground",
                        "dark:data-[hover=true]:bg-default-50",
                        "data-[pressed=true]:opacity-70",
                        "data-[hover=true]:bg-default-200",
                        "data-[selectable=true]:focus:bg-default-100",
                        "data-[focus-visible=true]:ring-default-500",
                    ],
                },
            }}
            placeholder="Search"
            popoverProps={{
                offset: 10,
                classNames: {
                    base: "rounded-large",
                    content: "p-1 border-small border-default-100 bg-background",
                },
            }}
            startContent={<FaSearch className="text-default-500 text-white" />}
            variant="bordered"
            selectorIcon={false}
        >
            {(item) => (
                <AutocompleteItem key={item.id} textValue={item.name}>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <Avatar alt={item.name} className="flex-shrink-0" size="sm" src={item.image} />
                            <div className="flex flex-col">
                                <span className="text-small">{item.name}</span>
                                <span className="text-tiny text-default-400">{item.type}</span>
                            </div>
                        </div>
                    </div>
                </AutocompleteItem>
            )}
        </Autocomplete>
    )
}

export default Footer;