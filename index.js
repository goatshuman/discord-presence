const { Client, RichPresence } = require('discord.js-selfbot-v13');
const fetch = require('node-fetch');

const token = process.env.DISCORD_TOKEN;
const targetGameName = process.env.GAME_NAME || "Resident Evil 3";

if (!token) {
  console.error("❌ ERROR: DISCORD_TOKEN environment variable is missing!");
  process.exit(1);
}

const client = new Client({ checkUpdate: false });
let gameAppId = "1196883977944956962";

async function lookupGameInfo(gameName) {
  try {
    const res = await fetch("https://markterence.github.io/discord-quest-completer/detectable.json");
    if (res.ok) {
      const list = await res.json();
      const matched = list.find(g => g.name && g.name.toLowerCase() === gameName.toLowerCase());
      if (matched && matched.id) {
        return { name: matched.name, id: matched.id };
      }
    }
  } catch (err) {
    console.warn("⚠️ Could not load detectable game list:", err.message);
  }
  return { name: gameName, id: gameAppId };
}

client.on('ready', async () => {
  console.log(`✅ Connected successfully as ${client.user.tag}!`);
  const gameInfo = await lookupGameInfo(targetGameName);
  setRichPresence(gameInfo.name, gameInfo.id);

  setInterval(async () => {
    const refreshed = await lookupGameInfo(targetGameName);
    setRichPresence(refreshed.name, refreshed.id);
  }, 10 * 60 * 1000);
});

function setRichPresence(name, applicationId) {
  try {
    const presence = new RichPresence(client)
      .setApplicationId(applicationId)
      .setType('PLAYING')
      .setName(name)
      .setDetails("Campaign")
      .setState("Raccoon City")
      .setStartTimestamp(Date.now());

    client.user.setPresence({
      activities: [presence],
      status: 'online'
    });

    console.log(`🎮 Activity set: Playing ${name} (ID: ${applicationId})`);
  } catch (error) {
    console.error("⚠️ Failed to set presence:", error);
  }
}

client.login(token);