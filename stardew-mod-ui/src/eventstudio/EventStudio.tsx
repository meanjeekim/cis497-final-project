import * as React from "react"

// json files
import pcJson from "../data/event/preconditionCommandsFormattedObjArgs.json";
import eventJson from "../data/event/eventCommandsFormattedObjArgs.json";
import startEventJson from "../data/event/startingCommandsFormatted.json";

// library imports
import { Container, Heading } from "@chakra-ui/layout";
import { Box, HStack, Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";

// personal imports
import { CommandSection } from "./CommandSection";
import { ICommand, ICommandType } from "./Command";
import { EventOutput } from "./EventOutput";

const commandToPrecondition: {[command: string]: ICommandType} = {};
pcJson.map((cmdType) => {
    commandToPrecondition[cmdType.command] = cmdType;
})

const commandToEvent: {[command: string]: ICommandType} = {};
eventJson.map((cmdType) => {
    commandToEvent[cmdType.command] = cmdType;
})

export const EventStudio = () => {
    const [preconditions, setPreconditions] = React.useState(pcJson);
    const [addedPreconditions, setAddedPreconditions] = React.useState<ICommand []>([]);
    const [eventId, setEventId] = React.useState("69");

    const [events, setEvents] = React.useState(eventJson);
    const [addedEvents, setAddedEvents] = React.useState<ICommand []>([]);

    const [startEvents, setStartEvents] = React.useState(startEventJson.map((commandType) => {
        const newCommand = JSON.parse(JSON.stringify(commandType));
        newCommand.args = [commandType.argNames.map(() => "")];

        return newCommand;
    }));

    const pcRefs = addedPreconditions.reduce((acc: React.RefObject<any> [], value) => {
        const ref = React.createRef();
        acc.push(ref);
        return acc;
      }, []);
    const startRefs = startEvents.map((cmd) => React.createRef());
    const eventRefs = addedEvents.map((cmd) => React.createRef());

    // props
    const data = {
        preconditions: addedPreconditions,
        events: addedEvents,
        startEvents: startEvents,
        eventId: eventId,
        commandToPrecondition: commandToPrecondition,
        commandToEvent: commandToEvent,
        commandToStartEvents: startEventJson,
        setAddedPreconditions: setAddedPreconditions,
        setAddedEvents: setAddedEvents,
        setStartEvents: setStartEvents,
        setEventId: setEventId,
        pcRefs: pcRefs,
        startRefs: startRefs,
        eventRefs: eventRefs
    };

    return (
        <Container maxW="container.lg">
            <Heading>event studio</Heading>
            <InputGroup>
                <InputLeftAddon children="event id" />
                <Input w="25" value={eventId} onChange={(event) => setEventId(event.target.value)} />
            </InputGroup>

            <HStack align="flex-start">
                <Box w="70%">
                    <CommandSection section={{title: "starting commands", commands: startEventJson, addedCommands: startEvents, setAddedCommands: setStartEvents, refs: startRefs}} />
                    <CommandSection section={{title: "preconditions", commands: preconditions, addedCommands: addedPreconditions, setAddedCommands: setAddedPreconditions, refs: pcRefs}} />
                    <CommandSection section={{title: "events", commands: events, addedCommands: addedEvents, setAddedCommands: setAddedEvents, refs: eventRefs}} />
                </Box>
                <Box w="30%">
                    <EventOutput data={data} />
                </Box>
            </HStack>
        </Container>
    );
}