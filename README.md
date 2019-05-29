ADA:LIN
=================

ADA:LIN is an integration of Google's Dialogflow, Tiddlywiki 5 (using Ooktech's Bob plugin), and a Discord bot.

Launching the application hosts a Tiddlywiki that can be viewed and edited by multiple users at once, as well as starting a Discord bot integration via Discord.js.

The Discord bot is directly connected to an ADA:LIN Dialogflow agent. A message in a Discord channel that the bot is apart of that starts with a direct mention to the bot (@ADA-LIN) is passed as a query to the agent. The agent's response is then posted in the same Discord channel as the original query and mentions the user who made the query. Queries can also be made as direct messages to the bot without the need to mention the bot.

Each time the application is launched, the entire wiki is collected into a single HTML file and uploaded to the ADA:LIN Dialogflow agent as a Knowledgebase article. 
