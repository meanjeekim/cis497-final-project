import json
import re

# JSON format
# input
# {
#    "command": "addBigProp <x> <y> <object ID>",
#    "description": "Adds an object at the specified tile from the TileSheets\\Craftables.png sprite sheet."
# }
# 
# output
# {
#     "id": 1,
#     "title": "addConversationTopic <ID> [length]",
#     "description": "Starts a conversation topic with the given ID and day length (or 4 days if no length given).",
#     "command": "addConversationTopic",
#     "argNameList": {
#         "required": [
#             "ID"
#         ],
#         "optional": [
#             "length"
#         ]
#     }
# }

with open("./eventCommands.json", "r") as f:
    data = json.load(f)

formatted = list()
for idx, pc in enumerate(data):
    # pc -> from raw json
    # pcJson -> formatted json

    # copy over raw data
    pcJson = dict()
    pcJson['id'] = idx
    pcJson['type'] = 'event'
    pcJson['title'] = pc['command']
    pcJson['description'] = pc['description']

    # Normalize text arguments lmao
    pc['command'].replace("\"<", "<\"")
    pc['command'].replace(">\"", "\">")

    # split on first instance of '<'
    split = pc['command'].split(" <", 1)

    pcJson['command'] = split[0]
    argNames = list()

    if len(split) > 1:
        split[1] = "<" + split[1]
        # split on first instance of '<'
        arg_split = split[1].split(" [", 1)

        # pattern = re.compile(r'(?:<(?P<req>.+?)>)|(?:\[(?P<opt>.+?)\])')    # <required arg> | [optional arg]
        # argSearchResult = [m.groupdict() for m in pattern.finditer(split[1])]

        req_pattern = re.compile(r'<(.+?)>')
        required_args = list(filter(lambda arg: arg.strip(), req_pattern.split(arg_split[0])))
        
        # check for optional args
        optional_args = list()
        if len(arg_split) > 1:
            arg_split[1] = "[" + arg_split[1]
            opt_pattern = re.compile(r'\[(.+?)\]')
            optional_args = list(filter(lambda arg: arg.strip(), opt_pattern.split(arg_split[1])))
        
        # compile arguments [name: string, required: bool]
        required_arg_json = [{'argName': argName, 'required': "True"} for argName in required_args]
        optional_arg_json = [{'argName': argName, 'required': "False"} for argName in optional_args]
        argNames = required_arg_json + optional_arg_json

    pcJson['argNames'] = argNames
    

    formatted.append(pcJson)

with open('../data/eventCommandsFormattedObjArgs.json', 'w') as wf:
    json.dump(formatted, wf, indent=4, )