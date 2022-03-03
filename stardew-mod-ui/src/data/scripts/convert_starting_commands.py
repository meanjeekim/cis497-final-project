import json
import re
import os

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

print(os.getcwd())


with open("./startingCommands.json", "r") as f:
    data = json.load(f)

formatted = list()
for idx, pc in enumerate(data):
    pcJson = dict()
    
    # copy over properties
    pcJson['id'] = idx
    pcJson['type'] = 'starter'
    pcJson['title'] = pc['syntax']
    pcJson['description'] = pc['description']

    pcJson['command'] = ""
    
    split = ["", pc['syntax']]

    required_args = list()
    optional_args = list()

    if len(split) > 1:
        req_pattern = re.compile(r'<(.+?)>')
        required_args = list(filter(lambda arg: arg.strip(), req_pattern.split(split[1])))
    
    # compile arguments [name: string, required: bool]
    required_arg_json = [{'argName': argName, 'required': "True"} for argName in required_args]
    optional_arg_json = [{'argName': argName, 'required': "False"} for argName in optional_args]
    argNames = required_arg_json + optional_arg_json
    
    pcJson['argNames'] = argNames
    formatted.append(pcJson)

with open('../data/startingCommandsFormatted.json', 'w') as wf:
    json.dump(formatted, wf, indent=4, )