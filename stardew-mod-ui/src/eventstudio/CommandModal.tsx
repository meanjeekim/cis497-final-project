import { AddIcon, SearchIcon } from "@chakra-ui/icons"
import { Button,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    ModalOverlay, 
    useDisclosure } from "@chakra-ui/react"
import * as React from "react"
import { ICommand, ICommandType } from "./Command"
import { CommandSelectionList } from "./CommandList"

interface IPropsCommandModal {
    modal: {
        commands: ICommandType [];
        commandIndex: number;
        setAddedCommands: React.Dispatch<React.SetStateAction<ICommand []>>;
        disclosure: {
          isOpen: boolean,
          onOpen: () => void,
          onClose: () => void,
        }
    }
}

export const CommandModal = ({modal: {commands, commandIndex, setAddedCommands, disclosure}}:IPropsCommandModal) => {
  const [searchCommand, setSearchCommand] = React.useState("");  
  const { isOpen, onOpen, onClose } = disclosure;
    
    const addCommand = (addCommands: ICommand [], commandType: ICommandType) => {
        const newCommand = JSON.parse(JSON.stringify(commandType));
        newCommand.args = [commandType.argNames.map(() => "")];
        
        const newCommands = [...addCommands];
        if (commandIndex > -1) {
          newCommands.splice(commandIndex, 0, newCommand);
        } else {
          newCommands.push(newCommand);
        }

        return newCommands;
    }
  
    return (
      <>
        <Modal onClose={onClose} isOpen={isOpen} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize="2xl">add commands</ModalHeader>
            <ModalCloseButton />
            <ModalBody m="3">
              <InputGroup paddingBottom="6">
                <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.500" />}
                />
                <Input placeholder="Search commands..." value={searchCommand} onChange={(event) => setSearchCommand(event.target.value)}/>
              </InputGroup>
              <CommandSelectionList commandList={ {commands: commands, searchCommand: searchCommand, setAddedCommands: setAddedCommands, cmdOnClick: addCommand} } />
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }