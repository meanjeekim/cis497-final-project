import json
import re

# JSON format
# input
# {
#    "syntax": "A <dialogue ID>",
#    "precondition": "The special dialogue event with the given ID is not in progress. This can be a custom event ID, but these are the in-game IDs: cc_Begin, cc_Boulder, cc_Bridge, cc_Bus, cc_Complete, cc_Greenhouse, cc_Minecart, dumped_Girls, dumped_Guys, Introduction, joja_Begin, pamHouseUpgrade, pamHouseUpgradeAnonymous, secondChance_Girls, secondChance_Guys, shaneSaloon1, shaneSaloon2, willyCrabs."
# }
# 
# output
# {
#     "id": 1,
#     "title": "Friendship <NPC name> <# friendship points>",
#     "command": "f",
#     "description": "Current player has at least <number> friendship points with the <name> NPC. Can specify multiple name and number pairs, in which case the player must meet all of them.",
#     "argNameList": ["NPC name", "# friendship points"]
# }

with open("./preconditionCommands.json", "r") as f:
    data = json.load(f)

formatted = list()
for idx, pc in enumerate(data):
    pcJson = dict()
    pcJson['id'] = idx
    pcJson['type'] = 'precondition'
    pcJson['title'] = pc['syntax']
    pcJson['description'] = pc['precondition']

    # Normalize text arguments lmao
    pc['syntax'].replace("\"<", "<\"")
    pc['syntax'].replace(">\"", "\">")

    # split on first instance of '<'
    split = pc['syntax'].split(" <", 1)

    pcJson['command'] = split[0]

    argNames = list()
    required_args = list()
    optional_args = list()

    if len(split) > 1:
        split[1] = "<" + split[1]
        # split on first instance of '<'
        arg_split = split[1].split(" [", 1)

        # pattern = re.compile(r'(?:<(?P<req>.+?)>)|(?:\[(?P<opt>.+?)\])')    # <required arg> | [optional arg]
        # argSearchResult = [m.groupdict() for m in pattern.finditer(split[1])]

        req_pattern = re.compile(r'<(.+?)>')
        required_args = list(filter(lambda arg: arg.strip(), req_pattern.split(arg_split[0])))
        
        
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

with open('../data/preconditionCommandsFormattedObjArg.json', 'w') as wf:
    json.dump(formatted, wf, indent=4, )