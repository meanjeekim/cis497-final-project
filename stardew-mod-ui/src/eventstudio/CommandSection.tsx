import * as React from "react"

import { Box, VStack, HStack } from "@chakra-ui/layout";
import { ICommand, ICommandType } from "./Command";
import { Flex, Heading, IconButton, Spacer, useDisclosure } from "@chakra-ui/react";
import { CommandList } from "./CommandList";
import { CommandModal } from "./CommandModal";
import { AddIcon } from "@chakra-ui/icons";
import { useState } from "react";

export interface ICommandSection {
    title: string;
    commands: ICommandType [];
    addedCommands: ICommand [];
    setAddedCommands: React.Dispatch<React.SetStateAction<ICommand []>>;
    refs: React.RefObject<any> [];
}

interface IPropsCommandSection {
    section: ICommandSection;
}

export const CommandSection = ({section: {title, commands, addedCommands, setAddedCommands, refs}}:IPropsCommandSection) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [idxToAdd, setIdxToAdd] = useState<number>(-1);

    const disclosure = {
        isOpen,
        onOpen,
        onClose
    }

    return (
        <Box>
            <Flex>
                <Heading size="lg">{title}</Heading>
                <Spacer />
                <IconButton onClick={() => {
                    setIdxToAdd(-1);
                    onOpen();
                    }} aria-label="add command" icon={<AddIcon />} size="sm" marginRight="3"/>
            </Flex>
            <CommandModal modal={{commands: commands, commandIndex: idxToAdd, setAddedCommands: setAddedCommands, disclosure: disclosure}} />
            <CommandList commandList={{commands: addedCommands, setIdxToAdd: setIdxToAdd, setAddedCommands: setAddedCommands, disclosure: disclosure, refs: refs}} />
        </Box>
    );
}

// export const CommandSectionContext = () => {
//     const {commands, addedCommands, addCommand} = React.useContext(commandsContext);
//     return (
//         <Box>
//             <HStack>
//                 <Heading size="lg">{title}</Heading>
//                 <CommandModal modal={{commands: commands, setAddedCommands: addCommand}} />
//             </HStack>
//             <CommandList commandList={{commands: addedCommands, setAddedCommands: addCommand}} />
//         </Box>
//     );
// }