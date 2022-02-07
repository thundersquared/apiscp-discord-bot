function sendOrReply(bot, origin, response) {
    /**
     * When a user invokes the bot replying to another user, the bot should reply to origin
     *
     * Example:
     * - A asks a question
     * - Bot responds to A
     * - B replies to A asking another question
     * - Bot responds to A
     */
    if (origin.mentions && origin.mentions.repliedUser) {
        // Fetch origin channel and message reference, responding to original question
        return bot.channels.fetch(origin.channel.id).then(channel => {
            return channel.messages.fetch(origin.reference.messageId).then(message => {
                return message.reply(response);
            });
        });
    }

    return origin.reply(response);
}

module.exports = sendOrReply;
