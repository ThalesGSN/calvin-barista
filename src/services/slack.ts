import axios from "axios";

export async function channelUsers(channelName: string) {
    const channels = await listChannels(channelName);
    const channel = channels.find((channel) => channel.name === channelName);

    if (!channel) {
        throw new Error(`Channel not found: ${channelName}`);
    }

    const channelMembers = await listChannelMembers(channel.id)

    const users = await listUsers();

    return users.filter((member) => channelMembers.includes(member.id));
}


export async function listChannels() {
    const headers = {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        charset: 'utf-8',
    }

    const { data } = await axios.post(
        'https://slack.com/api/conversations.list',
        null,
        {
            headers
        }
    )

    if (!data.ok) {
        throw new Error(`Failed to fetch channels from Slack: ${data.error}`);
    }

    return data.channels;
}

export async function listChannelMembers(channelId: string) {
    const headers = {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        charset: 'utf-8',
    }

    const { data } = await axios.post(
        'https://slack.com/api/conversations.members',
        null,
        {
            params: {
                channel: channelId,
            },
            headers
        }
    )

    if (!data.ok) {
        throw new Error(`Failed to fetch channels from Slack: ${data.error}`);
    }

    return data.members;
}

export async function listUsers() {
    const headers = {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        charset: 'utf-8',
    }

    const usersResponse = await axios.post(
        'https://slack.com/api/users.list',
        null,
        {
            params: {
                limit: 200,
            },
            headers
        }
    );
    return usersResponse.data.members
}



export async function createDMChannel(userIds: string[]) {
    const headers = {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        charset: 'utf-8',
    }
    const botId = process.env.BOT_ID;

    try {
        const response = await axios.post(
            'https://slack.com/api/conversations.open',
            {
                users: [...userIds, botId].join(',')
            },
     {
                headers
            }
        );

        const { channel } = response.data;
        if (!channel) {
            throw new Error(response.data.error)
        }
        const initialChannelMessage = await sendMessageToChannel(channel.id, 'Hello welcome to this new round!');

        if(!initialChannelMessage.ok) {
            throw new Error(initialChannelMessage.error);
        }

        return channel;
    } catch (error) {
        console.error('Error creating DM channel:', error.message);
        throw new Error('Failed to create DM channel');
    }
}


async function sendMessageToChannel(channelId, messageText) {
    const headers = {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        charset: 'utf-8',
    }

    try {
        const response = await axios.post(
            'https://slack.com/api/chat.postMessage',
            {
                channel: channelId,
                text: messageText,
            },
            {
                headers
            }
        );

        // If you want, you can do something with the API response, but for this example, we'll just log it
        console.log('Message sent:', response.data);

        return response.data;
    } catch (error) {
        console.error('Error sending message:', error.message);
        throw new Error('Failed to send message');
    }
}
