const Discord = require('discord.js');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const fs = require('fs');
const deepai = require("deepai");


deepai.setApiKey('api_key');
const bot = new Discord.Client();

var lastSent = undefined;
bot.on("message", message => {
    if(message.author.bot) return;

    if(message.content.startsWith("pythonexec")){
        let yu = message.content.replace(/pythonexec\n*/g, '');
        yu = yu.split("\n").slice(1, -1).join("\n");
        fs.writeFileSync('run.py', yu);

        let output = execSync('python3 run.py').toString();
        console.log(output)
        if(output.length==0)
            output = "Error :/"
        message.channel.send(output);
    }
    if(message.content.startsWith("!think ")){
        let starting = message.content.toString().replace('!think ', '');
        (async function() {
            var resp = await deepai.callStandardApi("text-generator", {
                    text: starting,
            });
            message.channel.send(resp.output);
        })();
    }
    else if(message.content.startsWith('!imagine ')){
        let starting = message.content.toString().replace('!imagine ', '');
        (async function() {
            var resp = await deepai.callStandardApi("text2img", {
                    text: starting,
            });
            message.channel.send(resp.output_url);
        })();
    }
    else if(message.content.startsWith('!parse ')){
        let starting = message.content.toString().replace('!parse ', '');
        (async function() {
            var resp = await deepai.callStandardApi("parseymcparseface", {
                    sentence: starting,
            });
            console.log(resp.output);
            message.channel.send(JSON.stringify(resp.output, null, 4));
        })();
    }


})

bot.login("bot_token");
