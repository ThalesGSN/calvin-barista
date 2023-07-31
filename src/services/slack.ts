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


export async function listChannels(channelName: string) {
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
