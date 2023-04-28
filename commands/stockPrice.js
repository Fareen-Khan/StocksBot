const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');
const fetch = require('node-fetch');
const { RapidId, DataHost } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('price')
		.setDescription('Replies with price of Stock!')
    .addStringOption((option) => 
      option.setName("name")
        .setRequired(true)
        .setDescription("Enter the Shortform Stock Name")
    ),
	
  async execute(interaction) {
    const stockName = interaction.options.getString("name");
    const stockEmbed = new EmbedBuilder();
    //Finance API to get stock price
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/octet-stream',
        'X-RapidAPI-Key': RapidId,
        'X-RapidAPI-Host': DataHost
      }
    };
    try {
      const url = `https://twelve-data1.p.rapidapi.com/price?symbol=${stockName}&format=json&outputsize=30`;
      const response = await fetch(url, options);
      const result = await response.json();
      if(result.price === undefined || result === undefined){
        if(stockName.includes(".NE") || stockName.includes(".TO")){
          stockEmbed
          .setColor(0xB24BF3)
          .setTitle(`${stockName.toUpperCase()}`)
          .addFields(
            {name:"**Warning**", value:`I cannot currently provide data about canadian stock market :grin:`},
          )
          .setFooter({text:"StocksBot", iconURL:"https://i.imgur.com/Wb7DFBi.png"})
          .setTimestamp()
          await interaction.deferReply();
          await interaction.editReply({embeds:[stockEmbed]});
        } else{
          stockEmbed
          .setColor(0xB24BF3)
          .setTitle(`${stockName.toUpperCase()}`)
          .addFields(
            {name:"**Warning**", value:`This stock does not exist`},
          )
          .setFooter({text:"StocksBot", iconURL:"https://i.imgur.com/Wb7DFBi.png"})
          .setTimestamp()
          await interaction.deferReply();
          await interaction.editReply({embeds:[stockEmbed]});
        }
      }

      stockEmbed
        .setColor(0xB24BF3)
        .setTitle(`${stockName.toUpperCase()}`)
        .addFields(
          {name:"**Price**", value:`${parseFloat(result.price).toFixed(2)}`},
        )
        .setFooter({text:"StocksBot", iconURL:"https://i.imgur.com/Wb7DFBi.png"})
        .setTimestamp()
        await interaction.deferReply();
        await interaction.editReply({embeds:[stockEmbed]});
    } catch (error) {
      console.error(error);
    }
	},
};