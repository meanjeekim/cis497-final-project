import * as React from "react"

import { Box, VStack, HStack } from "@chakra-ui/layout";
import { 
    Text,
    Heading,
    Input,
    InputGroup,
    InputLeftAddon,
    Wrap,
    WrapItem,
    Spacer,
    IconButton,
    Flex,
    Tooltip
} from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon, CloseIcon } from "@chakra-ui/icons";

// interfaces
export interface IArgInfo {
    argName: string;
    required: boolean;
    titleText?: string;
}

export interface ICommandType {
    id: number;
    type: string;
    title: string;
    description: string;
    command: string;
    argNames: (IArgInfo)[];
}

export interface ICommand {
    id: number;
    type: string;
    title: string;
    description: string;
    command: string;
    argNames: (IArgInfo)[];
    args: string [][];
}

interface IPropsCommandType {
    cmd: ICommandType;
}

interface IPropsCommand {
    commandIndex: number;
    cmd: ICommand;
    setAddedCommands: React.Dispatch<React.SetStateAction<ICommand []>>;
    ref: React.RefObject<any>;
}

//components
export const CommandType = ({cmd}:IPropsCommandType ) => (
    <Box p={3} borderRadius="md" _hover={{bg: "gray.200"}}>
        <VStack align="start">
            <Heading size="sm">{cmd.title}</Heading>
            <Text>{cmd.description}</Text>
        </VStack>
    </Box>
);

export const Command = ({commandIndex, cmd, setAddedCommands, ref }:IPropsCommand ) => 
    {
        // console.log('cmd', cmd);
    return (
    <Box p={3} wordBreak="break-all" m="2" ref={ref}>
        <Flex>
            <Wrap wordBreak="normal" direction="column">
                <WrapItem><Tooltip label={cmd.description} placement="right">
                    <Heading size="sm">{
                        cmd.args.length == 0 || cmd.argNames[0].titleText === undefined
                        ? cmd.title
                        : cmd.args.map((arg, cmdIdx) => 
                        arg.map((argValue, idx) => {
                            if (idx >= cmd.argNames.length) {
                                console.log(cmd);
                            }

                            const titleValue = argValue == "" ? cmd.argNames[idx].argName : argValue;

                            // check if arg is optional
                            if (cmd.argNames[idx].required) {
                                // replace "<value>" in titleText with the value
                                return cmd.argNames[idx].titleText ? cmd.argNames[idx].titleText?.replace("<value>", titleValue) : titleValue;
                            } else {
                                const split = cmd.argNames[idx].titleText?.split('~') ?? [titleValue, titleValue];
                                return argValue.length > 0
                                    ? split[0]
                                    : split[1];
                            }
                        }).join(' ')
                    )}</Heading>
                </Tooltip></WrapItem>
                {
                    cmd.argNames.length > 0 && 
                    <WrapItem><ArgInputList commandIndex={commandIndex} cmd={cmd} setAddedCommands={setAddedCommands} ref={ref}/></WrapItem>
                }
            </Wrap>
            <Spacer />
            <Flex marginLeft={2} direction="column">
                <IconButton variant="ghost" aria-label='Delete command' size="xs" icon={<CloseIcon />} onClick={() => {
                    setAddedCommands((prevCommands) => {
                        const newCommands = [...prevCommands];

                        newCommands.splice(commandIndex, 1);

                        return newCommands;
                    })
                }}/>
                <IconButton variant="ghost" aria-label='Move command up' size="xs" icon={<ArrowUpIcon />} onClick={() => {
                    setAddedCommands((prevCommands) => {
                        const newCommands = [...prevCommands];

                        if (commandIndex > 0) {
                            const [removed] = newCommands.splice(commandIndex, 1);
                            newCommands.splice(commandIndex - 1, 0, removed);
                        }

                        return newCommands;
                    })
                }}/>
                <IconButton variant="ghost" aria-label='Move command down' size="xs" icon={<ArrowDownIcon />} onClick={() => {
                    setAddedCommands((prevCommands) => {
                        const newCommands = [...prevCommands];

                        if (commandIndex < newCommands.length) {
                            const [removed] = newCommands.splice(commandIndex, 1);
                            newCommands.splice(commandIndex + 1, 0, removed);
                        }

                        return newCommands;
                    })
                }}/>
            </Flex>
        </Flex>
    </Box>);
}

export const ArgInputList = ({commandIndex, cmd, setAddedCommands}:IPropsCommand ) => {
    // console.log(cmd);

    return (
        <VStack>
            {cmd.args.map((argEntry, argEntryIdx) => 
                <HStack key={`arginputHstack${argEntryIdx}`}>
                    <Wrap direction="row">
                        {argEntry.map((argValue, argIdx) =>
                            cmd.argNames[argIdx] 
                            ? <WrapItem key={`arginputwrap${argIdx}`}>
                            <InputGroup size="sm">
                                <InputLeftAddon children={cmd.argNames[argIdx].argName} />
                                <Input 
                                    isInvalid={cmd.argNames[argIdx].required && argValue.trim().length == 0}
                                    w={cmd.argNames[argIdx].argName.length <= 2 
                                        ? "20"
                                        : "30"}
                                    value={argValue}
                                    onChange={(event) => {
                                    setAddedCommands(prevCommands => {
                                        const newCommands = [
                                            ...prevCommands.slice(0, commandIndex),
                                            {
                                                ...prevCommands[commandIndex],
                                                args: [
                                                    ...prevCommands[commandIndex].args.slice(0, argEntryIdx),
                                                    [
                                                        ...prevCommands[commandIndex].args[argEntryIdx].slice(0, argIdx),
                                                        event.target.value,
                                                        ...prevCommands[commandIndex].args[argEntryIdx].slice(argIdx + 1)
                                                    ],
                                                    ...prevCommands[commandIndex].args.slice(argEntryIdx + 1),
                                                ]
                                            },
                                            ...prevCommands.slice(commandIndex + 1),
                                        ];
                                        // console.log(newCommands);
                                        return newCommands;
                                        // const commands = [...prevCommands];
                                        // const command = {...commands[commandIndex]};
                                        // const commandArgEntries = [...command.args];
                                        // const commandArg = [...commandArgEntries[argEntryIdx]];
                                        // commandArg[argIdx] = event.target.value;
                                        // commandArgEntries[argEntryIdx] = commandArg;
                                        // command.args = commandArgEntries;
                                        // commands[commandIndex] = command;
                                        // console.log(commands);
                                        // return commands;
                                    })
                                    }} />
                            </InputGroup>
                            </WrapItem>
                            : <Text key={`arginputText${argIdx}`}>No arg param for "{argValue}"</Text>
                        )}
                    </Wrap>
                </HStack>
            )}
        </VStack>
    );
};