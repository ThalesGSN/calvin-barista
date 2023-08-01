import express from "express";
import {createDMChannel, listChannelMembers} from "../services/slack";
import shuffleArray from "../utils/shuffle";
import mongoClient from "../utils/mongoIntance";


const roundRouter = express.Router();

/**
 * @swagger
 *
 * /round:
 *   post:
 *     produces:
 *       - application/text
 *     responses:
 *          201:
 *            description: OK
 *          500:
 *            description: Failed to create new round
 */
roundRouter.post('/', async function (req, res) {
    try {
        const channelId = process.env.CHANNEL_ID;
        const groupSize = process.env.GROUP_SIZE;
        const channelMembers = await listChannelMembers(channelId)

        const shuffledArray = shuffleArray(channelMembers)

        const groups = shuffledArray.reduce((acc, currentValue) => {
            const lastGroup = acc[acc.length - 1]
            if (lastGroup && lastGroup.length < groupSize) {
                lastGroup.push(currentValue)
            } else {
                acc.push([currentValue])
            }
            return acc
        }, [])

        const createGroups = groups.map(createDMChannel)
        await Promise.all(createGroups)

        const round = {
            date: new Date(),
            groups
        }
        await mongoClient().db('slack')
            .collection('rounds')
            .insertOne(round)

        res.status(201).send('OK');
    } catch (error) {
        console.error('Error fetching users from Slack:', error.message);
        res.status(500).json({error: 'Failed to create new round'});
    }
})

export default roundRouter;
