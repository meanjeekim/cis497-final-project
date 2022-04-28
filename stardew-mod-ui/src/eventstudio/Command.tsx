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
    list?: boolean;
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
                    <Heading size="sm">
                      {
                        cmd.args.length == 0 || cmd.argNames[0].titleText === undefined
                        ? cmd.title
                        : cmd.args.map((arg, cmdIdx) => 
                          arg.map((argValue, idx) => {
                              const argNameIdx = Math.min(cmd.argNames.length-1, idx);
                              if (idx >= cmd.argNames.length) {
                                  console.log(cmd);
                              }

                              const title = cmd.argNames[argNameIdx].titleText;
                              const titleValue = argValue == "" ? cmd.argNames[argNameIdx].argName : argValue;

                              // check if arg is optional
                              if (cmd.argNames[argNameIdx].required) {
                                  // replace "<value>" in titleText with the value
                                  if (title && cmd.argNames[argNameIdx].list) {
                                      // split titleValue
                                      let listTitle = title!;
                                      const titleValueSplit = titleValue.split(' ');
                                      titleValueSplit.forEach(v => {
                                          listTitle = listTitle.replace("<value>", v)
                                      });
                                      return listTitle;
                                  }
                                  return title && argNameIdx === idx ? title?.replace("<value>", titleValue) : titleValue;
                              } else {
                                  const split = title?.split('~') ?? [titleValue, titleValue];
                                  return argValue.length > 0
                                      ? split[0]
                                      : split[1];
                              }
                            }).join(' ')
                        ).join(' AND ')
                      }
                    </Heading>
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
    console.log('arginputcmd', cmd);
    const addArgSet = () => {
      setAddedCommands(prevCommands => {
          const newCommands = [
              ...prevCommands.slice(0, commandIndex),
              {
                  ...prevCommands[commandIndex],
                  args: [
                      ...prevCommands[commandIndex].args,
                      cmd.argNames.map(() => ''),     // new array of argName size of empty strings
                  ]
              },
              ...prevCommands.slice(commandIndex + 1),
          ];
          return newCommands;
      })
    }

    const addArg = (argEntryIdx: number) => {
      setAddedCommands(prevCommands => {
          const newCommands = [
              ...prevCommands.slice(0, commandIndex),
              {
                  ...prevCommands[commandIndex],
                  args: [
                    ...prevCommands[commandIndex].args.slice(0, argEntryIdx),
                    [
                        ...prevCommands[commandIndex].args[argEntryIdx],
                        ""
                    ],
                    ...prevCommands[commandIndex].args.slice(argEntryIdx + 1),
                  ]
              },
              ...prevCommands.slice(commandIndex + 1),
          ];
          return newCommands;
      })
    }

    return (
        <VStack>
            {cmd.args.map((argEntry, argEntryIdx) => 
                <HStack key={`arginputHstack${argEntryIdx}`}>
                    <Wrap direction="row">
                        {argEntry.map((argValue, argIdx) => {
                            const argNameIdx = Math.min(cmd.argNames.length-1, argIdx);
                            return cmd.argNames[argNameIdx] 
                            ? <WrapItem key={`arginputwrap${argIdx}`}>
                            <InputGroup size="sm">
                                <InputLeftAddon children={cmd.argNames[argNameIdx].argName} />
                                <Input 
                                    isInvalid={cmd.argNames[argNameIdx].required && argValue.trim().length == 0}
                                    w={cmd.argNames[argNameIdx].argName.length <= 2 
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
                                        return newCommands;
                                    })
                                    }} />
                            </InputGroup>
                            </WrapItem>
                            : <Text key={`arginputText${argIdx}`}>No arg param for "{argValue}"</Text>
                        })}
                        { cmd.title.endsWith('>+') && <IconButton onClick={() => addArg(argEntryIdx)} aria-label="add another set of arguments"/>}
                    </Wrap>
                </HStack>
            )}
          { cmd.title.endsWith(']+') && <IconButton onClick={addArgSet} aria-label="add another set of arguments"/>}
        </VStack>
    );
};