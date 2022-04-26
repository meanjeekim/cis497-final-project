import * as React from "react"

import { Box, VStack, HStack } from "@chakra-ui/layout";

import { Command, CommandType, ICommand, ICommandType } from "./Command";
import { Text, StackDivider, Center, Flex, IconButton, Divider, Spacer, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";

interface PropsCommandList {
    commandList: {
        commands: ICommand [];
        setIdxToAdd: React.Dispatch<React.SetStateAction<number>>;
        setAddedCommands: React.Dispatch<React.SetStateAction<ICommand []>>;
        disclosure: {
            isOpen: boolean,
            onOpen: () => void,
            onClose: () => void,
        };
        refs: React.RefObject<any> [];
    }
}

interface PropsCommandSelectionList {
    commandList: {
        commands: ICommandType [];
        searchCommand: string;
        setAddedCommands: React.Dispatch<React.SetStateAction<ICommand []>>;
        cmdOnClick: (addCommands: ICommand [], command: ICommandType) => ICommand []
    }
}

interface PropsDivider {
    divider: {
        onOpen: () => void;
        commandIndex: number;
        setIdxToAdd: React.Dispatch<React.SetStateAction<number>>;
    }
}

export const CommandList = ({ commandList }:PropsCommandList) => {
    const {commands, setIdxToAdd, setAddedCommands, disclosure, refs} = commandList;
    const {isOpen, onOpen, onClose} = disclosure;

    return (
    <Box m={3} paddingBottom={commands.length > 0 ? 6 : 0} borderWidth="1px" borderRadius="md">
        { commands.length > 0 
            ? <Flex align="stretch" direction="column">
                {commands.map((cmd, i) =>
                    <Box key={i}>
                        <Command commandIndex={i} cmd={cmd} setAddedCommands={setAddedCommands} ref={refs[i]} />
                        <StackDividerButton divider={{onOpen: onOpen, commandIndex: i, setIdxToAdd: setIdxToAdd}} />
                    </Box>
                )}
              </Flex>
            : <Center>
                <Text m={6} color="gray">nothing has been added...</Text>
              </Center>
        }
    </Box>);
}

const StackDividerButton = ({divider: {onOpen, commandIndex, setIdxToAdd}}: PropsDivider) => (
    <Center position="relative" role="group" p="0.5">
        <Divider position="absolute" orientation="horizontal"/>
        <IconButton 
            position="absolute"
            visibility="hidden"
            onClick={() => {
                setIdxToAdd(commandIndex + 1);
                onOpen();
            }}
            aria-label="add command"
            icon={<AddIcon />}
            size="sm"
            _groupHover={{visibility: "visible"}} />
    </Center>
);

export const CommandSelectionList = ({commandList: {commands, searchCommand, setAddedCommands, cmdOnClick}}:PropsCommandSelectionList) => {
    
    return (
    <Box borderWidth="1px" borderRadius="md" p="3">
        <VStack align="stretch" divider={<StackDivider />}>
            {commands.filter((cmd, i) => {
                const normalizedSearch = searchCommand.toLowerCase().trim();
                return cmd.title.toLowerCase().indexOf(normalizedSearch) > -1
                    || cmd.description.toLowerCase().indexOf(normalizedSearch) > -1;
                })
                .map((cmd, i) => (
                    <Box key={i} onClick={() => setAddedCommands(prevState => cmdOnClick(prevState, cmd))}>
                        <CommandType cmd={cmd} />
                    </Box>
                )
            )}
        </VStack>
    </Box>
    );
}