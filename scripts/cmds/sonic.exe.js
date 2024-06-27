const axios = require("axios")
module.exports = {
	config: {
		name: 'sonic.exe',
        aliases: ["exe"],
		version: '1.2',
		author: 'Luxion/fixed by Riley',
		countDown: 0,
		role: 0,
		shortDescription: 'AI CHAT',
		longDescription: {
			en: 'Chat with Xae'
		},
		category: 'Ai chat',
		guide: {
			en: "{pn} <word>: chat with lina"
				+ "\Example:{pn} hi"
		}
	},

	langs: {
		en: {
			turnedOn: "𝙎𝙤𝙣𝙞𝙘 𝙣'𝙚𝙨𝙩 𝙥𝙡𝙪𝙨 𝙙𝙚 𝙘𝙚 𝙢𝙤𝙣𝙙𝙚....𝙎𝙊𝙉𝙄𝘾.𝙀𝙓𝙀 𝙚𝙣𝙩𝙚 𝙚𝙣 𝙟𝙚𝙪😈",
			turnedOff: "𝙐𝙣 𝙘𝙤𝙣𝙨𝙚𝙞𝙡....𝙙𝙤𝙧𝙩 𝙖𝙫𝙚𝙘 𝙪𝙣 𝙤𝙚𝙞𝙡 𝙤𝙪𝙫𝙚𝙧𝙩 🙍",
			chatting: "Already Chatting with 𝗟𝗢𝗙𝗧...",
			error: "𝘽𝙊𝙐𝙁𝙁𝙊𝙉......🌱"
		}
	},

	onStart: async function ({ args, threadsData, message, event, getLang }) {
		if (args[0] == "parle" || args[0] == "adieu") {
			await threadsData.set(event.threadID, args[0] == "parle", "settings.simsimi");
			return message.reply(args[0] == "parle" ? getLang("turnedOn") : getLang("turnedOff"));
		}
		else if (args[0]) {
			const yourMessage = args.join(" ");
			try {
				const responseMessage = await getMessage(yourMessage);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
        console.log(err)
				return message.reply(getLang("error"));
			}
		}
	},

	onChat: async ({ args, message, threadsData, event, isUserCallCommand, getLang }) => {
		if (args.length > 1 && !isUserCallCommand && await threadsData.get(event.threadID, "settings.simsimi")) {
			try {
				const langCode = await threadsData.get(event.threadID, "settings.lang") || global.GoatBot.config.language;
				const responseMessage = await getMessage(args.join(" "), langCode);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
				return message.reply(getLang("error"));
			}
		}
	}
};

async function getMessage(yourMessage, langCode) {
	const res = await axios.post(
    'https://api.simsimi.vn/v1/simtalk',
    new URLSearchParams({
        'text': yourMessage,
        'lc': 'fr'
    })
);

	if (res.status > 200)
		throw new Error(res.data.success);

	return res.data.message;
      }
