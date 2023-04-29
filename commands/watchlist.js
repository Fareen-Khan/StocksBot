const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {readUniqueData} = require("../db/dbQueries");
const fetch = require('node-fetch');
const { RapidId, DataHost } = require('../config.json');

module.exports={
  data:new SlashCommandBuilder()
    .setName("watchlist")
    .setDescription("See your watchlist"),

  async execute(interaction){
    let memberID = interaction.member.id;
    let servID = interaction.guild.id.toString();
    const watchListEmbed = new EmbedBuilder();
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/octet-stream',
        'X-RapidAPI-Key': RapidId,
        'X-RapidAPI-Host': DataHost
      }
    };
    const data = await readUniqueData(memberID);
    console.log(data.length);
    try {
      let i=0;
      let url = [];
      var r = {};
      while (i<data.length){
        url.push(`https://twelve-data1.p.rapidapi.com/price?symbol=${data[i].name}&format=json&outputsize=30`);
        console.log(url[i]);
        i++;
      }
      const prices = await Promise.all(url.map(async u=>{
        const resp =  await fetch(u, options);
        return resp.json();
      }));
      i=0;
      data.forEach(element => {
        r[element.name] = prices[i].price;
        i++;
      });
      console.log(r);
      watchListEmbed
        .setColor(0xB24BF3)
        .setTitle(`${interaction.member.user.tag} This is your watch list`)
        .setFooter({text:"StocksBot", iconURL:"https://i.imgur.com/Wb7DFBi.png"})
        .setTimestamp()
      for(let key in r){
        watchListEmbed.addFields(
          {name:`**${key}**`, value:`${parseFloat(r[key]).toFixed(2)}`}
        )   
      }
      await interaction.deferReply();
      await interaction.editReply({embeds:[watchListEmbed]});
      console.log(prices);
    } catch (error) {
      console.error(error);
    }

  }
}