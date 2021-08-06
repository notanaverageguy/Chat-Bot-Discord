// Importing The Bot
const smartestchatbot = require('smartestchatbot'); const cb = new smartestchatbot.Client();

// Setting up discord bot
const Discord = require('discord.js');
const client = new Discord.Client();
const {token, prefix} = require('./settings.json');

// Misc
const discordTTS = require('discord-tts');
var users = require('./users.json');
const googleTTS = require('google-tts-api');

// Setting up a command handler
const fs = require('fs');
const { stringify } = require('querystring');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
    client.user.setActivity('Your mom\'s fat cheeks get clapped', { type: 'WATCHING' });
    console.log('Online')
});

//Special cases are going to go in here
let nameChange = /^(?=.*change)(?=.*(your|ur))(?=.*name).+/;
let ageAsk = /^(?=.*(your|ur|you))(?=.*(age|old)).+/;
let speak = /(say(s?)|speak(s?)|vocalize|announce)/;
let image = /image|pic|picture|img|meme/;
let imgTypes = /funny|dog|cat|duck|meme|pet|art|wholesome|parrot|chicken(wings)?/;
let ttsToggle = /^(?=.*(toggle|change))(?=.*(vc|voice|speach|tts))(?=.*mode)?.+/;
//

client.on('message', message => {
    command = message.content.trim()
    if(command.startsWith("!")) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        var command = args[0].toLowerCase();
        switch(command) {
            case "purge": if(message.author.id == 591368175212298240) try{ message.channel.bulkDelete(args[1]) } catch { message.channel.send("something went wrong") }; break; 
            case 'images': message.channel.send('Supported image types are: **funny, dog, cat, duck, meme, pet, art, wholesome, parrot, chicken (wings)**'); break;
            case "help": message.channel.send('All commands: **purge**, images, help\nKey: **bold**: moderator perms')
        }
    } else {
        if(message.author.bot || message.channel.id == 865660459461509160) return;
        try { users[message.author.id].namePrompt } catch { users[message.author.id] = {namePrompt: false, name: "Jay", tts:false} }
        //
        // Put all special cases inside a else if
        //
        if(nameChange.test(command.toLocaleLowerCase().trim())) {
            message.channel.send("What would you like me to change my name to?");
            users[`${message.author.id}`] = {namePrompt: true, name: users[message.author.id].name, tts:users[message.author.id].tts}; return;
        } else if(users[message.author.id].namePrompt == true) {
            if(command == 'cancel') return users[message.author.id] = {namePrompt: false, name:users[message.author.id].name, tts:users[message.author.id].tts};
             if(command.length < 3) return message.channel.send('My name must be over 3 characters!')
            users[message.author.id] = {namePrompt: false, name: command, tts:users[message.author.id].tts}
             message.channel.send(`Changed my name to ${command} just for you`);
             fs.writeFileSync('./users.json', JSON.stringify(users), 'utf8');
        } else if(ageAsk.test(command.toLocaleLowerCase().trim())) {
            message.channel.send('Don\'t ask me such personal questions!')
        } else if(speak.test(command.toLocaleLowerCase().trim())){
            const broadcast = client.voice.createBroadcast();
            const channelId = message.member.voice.channelID;
            const channel = client.channels.cache.get(channelId);
            command = command.substring( (command.match(speak)["index"] + command.match(speak)[1].length) ).trim();
            const args = command.trim().split(/ +/);
            if (args.length < 3) { message.channel.bulkDelete(1); message.channel.send('I cannot play audio files less than less than 3 words').then(msg => {setTimeout(() => msg.delete(), 2000)}).catch(); return; }
            
            try{
                channel.join().then(connection => {
                    broadcast.play(discordTTS.getVoiceStream(command));
                    const dispatcher = connection.play(broadcast);
                })
            } catch{ message.channel.send('You must be in a voice channel!').then(msg => {setTimeout(() => msg.delete, 2000)}).catch(); }
            
        } else if (image.test(command.toLocaleLowerCase().trim())) {
            if(imgTypes.test(command.toLocaleLowerCase().trim())) {
                function getImg(sub){
                    const axios = require('axios');
                    axios.get(`https://meme-api.herokuapp.com/gimme/${sub}`) .then(function (response) { message.channel.send(response.data.url); }) .catch(function (error) { console.log(error); })
                }
                if(command.includes('wholesome')){ getImg('wholesomememes') }; if(command.includes('meme')){ getImg('memes') }; if(command.includes('art')){ getImg('Art') } ;
                if(command.includes('funny')){ getImg('memes') }; if(command.includes('dog')){ getImg('dogpictures') }; if(command.includes('cat')){ getImg('catpictures') } ;
                if(command.includes('duck')){ getImg('duck') }; if(command.includes('pet')){ getImg('petpictures') }; if(command.includes('parrot')){ getImg('parrots') };
                if(command.includes('chicken')){ getImg('Wings') };
            } else { return message.channel.send('That image type isn\'t supported, for more help do !images') }
        } else if (ttsToggle.test(command)) {
            const channelId = message.member.voice.channelID;
            const channel = client.channels.cache.get(channelId);
            if(users[message.author.id].tts == false) {
                try {
                    channel.join();
                    users[message.author.id].tts = true;
                    message.channel.send(`Turned on tts mode for you\n**note some responses don't work**`)
                } catch{ message.channel.send('You must be in a voice channel!').then(msg => {setTimeout(() => msg.delete, 2000)}).catch(); }
            } else {
                users[message.author.id].tts = false;
                message.channel.send(`Turned off tts mode for you`)
            }  
            fs.writeFileSync('./users.json', JSON.stringify(users), 'utf8');
        }else {
            if(users[message.author.id].tts == true) {
                cb.chat({message: command, name: users[message.author.id].name, owner:'Naag', user: message.author.id, language:"en"}).then(reply => {
                    const broadcast = client.voice.createBroadcast();
                    const channelId = message.member.voice.channelID;
                    const channel = client.channels.cache.get(channelId);
                    try {
                        channel.join().then(connection => {
                            cb.chat({message: command, name: users[message.author.id].name, owner:'Naag', user: message.author.id, language:"en"}).then(reply => {
                                reply = reply.toString();
                                const wordCount = reply.trim().split(/ +/); 
                                if(wordCount.length < 3) {
                                    reply += '. Voice by google'
                                }
                                broadcast.play(discordTTS.getVoiceStream(reply));
                                const dispatcher = connection.play(broadcast); 
                            })
                        })
                    } catch {
                        users[message.author.id].tts = false;
                        message.channel.send('You weren\'t inside a voice channel!')
                    }
                 })
            } else {
                cb.chat({message: command, name: users[message.author.id].name, owner:'Naag', user: message.author.id, language:"en"}).then(reply => { message.channel.send(reply) })
            }
        }
    }
});

client.login(token);