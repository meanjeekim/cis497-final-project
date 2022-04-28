import { Box, Button, Heading, Text, Textarea, VStack } from "@chakra-ui/react"
import * as React from "react"
import { ICommand, ICommandType } from "./Command"

const getInvalidCommand = (invalidCmd: string) => ({
    id: -1,
    type: "debug",
    title: invalidCmd,
    description: "",
    command: "",
    argNames: [],
    args: []
});

interface IPropsEventOutput {
    data: {
        preconditions: ICommand [];
        events: ICommand [];
        startEvents: ICommand [];
        eventId: string;
        commandToPrecondition: {[command: string]: ICommandType};
        commandToEvent: {[command: string]: ICommandType};
        commandToStartEvents: ICommandType [];
        setAddedPreconditions: React.Dispatch<React.SetStateAction<ICommand []>>;
        setAddedEvents: React.Dispatch<React.SetStateAction<ICommand []>>;
        setStartEvents: React.Dispatch<React.SetStateAction<ICommand []>>;
        setEventId: React.Dispatch<React.SetStateAction<string>>;
        pcRefs: React.RefObject<any> [];
        startRefs: React.RefObject<any> [],
        eventRefs: React.RefObject<any> []
    }
}

export const EventOutput = ({data}:IPropsEventOutput) => {
    const {preconditions,
        events,
        startEvents,
        eventId,
        commandToPrecondition,
        commandToEvent,
        commandToStartEvents,
        setAddedPreconditions, setAddedEvents, setStartEvents, setEventId,
        pcRefs,
        startRefs,
        eventRefs
    } = data;

    // const pcArr = preconditions.map((pc) => `${pc.command}${pc.args.length > 0 ? ' ': ''}${pc.args.map((argEntry) => argEntry.join(' ').trim()).join(' ')}`);
    // // console.log(preconditions[0]);
    // const startEventStringArr = startEvents.map((event) => `${event.args.map((argEntry) => argEntry.join(' ').trim()).join(' ')}`);
    // const eventStringArr = events.map((event) => `${event.command}${event.args.length > 0 ? ' ': ''}${event.args.map((argEntry) => argEntry.join(' ').trim()).join(' ')}`);

    const [eventTextarea, setEventTextarea] = React.useState("");

    const convertCmdToElement = (arr: ICommand [], refs: React.RefObject<HTMLDivElement> []) => {
        const pcStringArr = arr.map((pc) => {
          const commandString = pc.command;
          const spaceString = pc.args.length > 0 && pc.command.length > 0 ? ' ': '';
          const argsString = pc.args.map((argEntry, argEntryIdx) => (
            argEntry.map((argValue, argIdx) => {
              if (pc.argNames[Math.min(pc.argNames.length-1, argIdx)].argName === "\"text\"") {
                return `\\"${argValue.trim()}\\"`;
              } else {
                return argValue.trim();
              }
            }).join(' ').trim()
          )).join(' ');

          console.log(commandString, spaceString, argsString);

          return (commandString + spaceString + argsString).trim();
        });
        // const pcStringArr = arr.map((pc) => `${pc.command}${pc.args.length > 0 && pc.command.length > 0 ? ' ': ''}${pc.args.map((argEntry) => argEntry.join(' ').trim()).join(' ')}`);
        const elementArr = [];

        var i = 0;

        while (i < arr.length-1) {
            // console.log(refs[i]);
            elementArr.push(
                <Text key={`cmd${i}`} as="span" _hover={{background: "teal.100"}} onClick={() => {
                    refs[i].current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }}>
                    {pcStringArr[i]}
                </Text>
            );
            elementArr.push(
                <Text key={`separator${i}`} as="span">/</Text>
            );
            i += 1;
        }

        // add last element
        elementArr.push(
            <Text key="last" as="span" _hover={{background: "teal.100"}}>
                {pcStringArr[i]}
            </Text>
        );

        return elementArr;
    }

    const assembleStartingCommands = () => {
      const startElements: JSX.Element[] = convertCmdToElement(startEvents, startRefs);
      console.log('startElements', startElements);

      for (let i = 5; i < startElements.length; i += 2) {
        startElements.splice(i, 1, <Text as="span"> </Text>);
      }

      return startElements;
    }

    const populate = (eventString: String) => {
        const splitIdx = eventString.indexOf(':');
        const split = [
            eventString.slice(0, splitIdx),
            eventString.slice(splitIdx + 1).trim()
        ]
        // console.log(split);
        const pcString = split[0].slice(1, -1);
        const eString = split[1].slice(1, -1);
        // console.log(`eString: ${eString}`);

        // precondition handling
        const pcSplit: string [] = pcString.split('/');

        // extract event id
        const eventId = pcSplit[0];
        setEventId(eventId);

        pcSplit.shift();

        // go through preconditions
        const newPreconditions = pcSplit.map((commandString) => {
            
            // newCommand.args = [commandType.split.argNames.map(() => "")];
            // console.log(`commandString: ${commandString}`);
            const argSplit = commandString.split(' ');
            // console.log(argSplit);
            const commandType = commandToPrecondition[argSplit[0]];
            // console.log(commandType);
            argSplit.shift();

            const newCommand = JSON.parse(JSON.stringify(commandType));

            // if args length is > argNames, just append new arg to the last arg in args
            const args: string [] = [];
            argSplit.forEach((argToAdd)=> {
                if (args.length >= commandType.argNames.length) {
                    args[args.length-1] = args[args.length-1].concat(` ${argToAdd}`);
                } else {
                    args.push(argToAdd);
                }
            })
            // console.log(args);

            // if there aren't as many args as argNames, just fill out rest of args with empty strings
            for ( var i = args.length; i < commandType.argNames.length; i += 1) {
                args.push("");
            }

            newCommand.args = args.length > 0 ? [args] : [];
            
            return newCommand;
        })
        // console.log(newPreconditions);
        setAddedPreconditions(newPreconditions);

        // event handling
        const eSplit: string [] = eString.split('/');

        // extract starter commands
        const newStartEvents: ICommand [] = [];

        const startMusicCommand = JSON.parse(JSON.stringify(commandToStartEvents[0]));
        startMusicCommand.args = [[eSplit[0]]];
        newStartEvents.push(startMusicCommand);
        eSplit.shift();

        const startTileCommand = JSON.parse(JSON.stringify(commandToStartEvents[1]));
        startTileCommand.args = [eSplit[0].split(' ')];
        newStartEvents.push(startTileCommand);
        eSplit.shift();

        const startPositionCommand = JSON.parse(JSON.stringify(commandToStartEvents[2]));    
        startPositionCommand.args = [];
        const positionEntrySplit = eSplit[0].split(' ');
        console.log('posentrysplit', positionEntrySplit);
        for (var i = 0; i < positionEntrySplit.length; i += 4) {
            startPositionCommand.args.push(positionEntrySplit.slice(i, Math.min(i + 4, positionEntrySplit.length)));
        }
        console.log(startPositionCommand);
        newStartEvents.push(startPositionCommand);
        eSplit.shift();

        setStartEvents(newStartEvents);

        // go through events
        const newEvents = eSplit.map((commandString) => {
            // search for text in between \"<dialogue>\" because dialogue
            // I could search for spaces individually until it starts with a \"
            
            // extract command
            var sliceIdx = commandString.indexOf(' ');
            var cmdString = sliceIdx > -1 ? commandString.slice(0, sliceIdx) : commandString;

            // check if command is end/question/fade because there are end __ commands with spaces >:(
            if (cmdString === "end") {
                const secondArgIdx = commandString.indexOf(' ', sliceIdx+1);
                const secondArgString = secondArgIdx > 0 ? commandString.slice(0, secondArgIdx) : commandString;
                if (commandToEvent[secondArgString] !== null) {
                    cmdString = secondArgString;
                    sliceIdx = secondArgIdx;
                }
                console.log(`secondArgString: ${secondArgString}`);
            }

            const commandType = commandToEvent[cmdString];
            if (commandType === undefined) {
                console.log(`${cmdString} is not a valid command`);
                return getInvalidCommand(`invalid command: ${cmdString}`);
            }

            commandString = commandString.replaceAll('\\"', '');
            var argString = sliceIdx > -1 ? commandString.slice(sliceIdx + 1) : "";
            // console.log(`argString: ${argString}`);
            
            var args: string [] = [];
            while (argString.length > 0) {
                var separator = ' ';
                // if (argString.startsWith("\\\"")) {
                //     // handle dialogue arg
                //     separator = "\\\"";
                //     console.log('argString', argString);
                // }
                
                var newArgString = "";
                var argToAdd = "";

                sliceIdx = argString.indexOf(separator, separator.length);
                
                if (sliceIdx > -1) {
                    // console.log(`found ${separator} at index ${sliceIdx}`);
                    argToAdd = argString.slice(0, sliceIdx + separator.length).trim();
                    newArgString = argString.slice(sliceIdx + separator.length).trim();
                    // console.log(newArgString);
                } else {
                    // console.log(`not found`);
                    argToAdd = argString;
                    newArgString = "";
                }

                // if args length is > argNames, just append new arg to the last arg in args
                if (args.length >= commandType.argNames.length) {
                    args[args.length-1] = args[args.length-1].concat(` ${argToAdd}`);
                } else {
                    args.push(argToAdd);
                }

                argString = newArgString;
            }
            // console.log(`args: ${args}`);

            // if there aren't as many args as argNames, just fill out rest of args with empty strings
            for ( var i = args.length; i < commandType.argNames.length; i += 1) {
                args.push("");
            }

            console.log('args', args);

            const newCommand = JSON.parse(JSON.stringify(commandType));
            newCommand.args = args.length > 0 ? [[...args]] : [];
            return newCommand;
        })

        setAddedEvents(newEvents.filter(event => event !== undefined));
    }

    return (
    <Box>
        <VStack align='flex-start'>
            <Heading size="lg">output string</Heading>
            {/* <Text>
                "{`${eventId}/` + pcStringArr.join('/')}": "{startEventStringArr.join('/')}/{eventStringArr.join('/')}"
            </Text> */}
            <Box>
                <Text as="span">
                    "{`${eventId}/`}
                </Text>
                {convertCmdToElement(preconditions, pcRefs)}
                <Text as="span">": "</Text>
                {assembleStartingCommands()}/{convertCmdToElement(events, eventRefs)}
                "
            </Box>

            <Box>
                <VStack align="flex-start">
                    <Heading size="lg">parser</Heading>
                    <Textarea value={eventTextarea} onChange={(event) => {setEventTextarea(event.target.value)}} placeholder="Here is a sample placeholder" />
                    <Button onClick={() => {populate(eventTextarea)}}>populate commands</Button>
                </VStack>
            </Box>
        </VStack>
    </Box>
    );
}