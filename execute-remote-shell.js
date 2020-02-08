const Discord = require('discord.js');
const client = new Discord.Client();
const exec = require('child_process').exec;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
	client.user.setPresence({
        status: "online",
        game: {
            name: "Đang thực thi Shell Command",
            type: "STREAMING"
        }
    }); 
});

client.on('message', message => {
if (message.author.bot) return;
	if (message.content.startsWith('cmd')) {

		var testscript = exec(message.content.slice(4));
		testscript.stdout.on('data', function(data){
		message.channel.send(data);
		// sendBackInfo();
	});

	testscript.stderr.on('data', function(data){
		message.channel.send(data);
		// triggerErrorStuff();
	});
	}
})
client.login('NjY4MDkwMTAyMTYwODE4MTg2.Xj7Tkg.-lzFCD_eWjyj4UOL11PwGZiXLLs');