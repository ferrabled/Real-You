import { kv } from '@vercel/kv';
import { Client } from "@xmtp/xmtp-js";
import { GrpcApiClient } from "@xmtp/grpc-api-client";
import { Wallet } from "ethers";
import type { VercelRequest, VercelResponse } from '@vercel/node';

const tagMessages: { [key: string]: string } = {
  "Nature": "A new nature photo has been uploaded to Real You!",
  "Food": "A delicious new food photo is waiting for you on Real You!",
  "Travel": "Explore a new destination on Real You - a travel photo just dropped!",
  "Sports": "Catch the latest sports action on Real You - new photo alert!",
  "People": "A captivating portrait has been added to Real You!",
  "Pets": "Adorable alert! A new pet photo is live on Real You!",
  "Art & Fashion": "Get inspired by the latest art & fashion photo on Real You!",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { tag } = req.body;
    
    if (!tag) {
      return res.status(400).json({ error: 'Tag is required' });
    }

    const message = tagMessages[tag] || `A new photo tagged with ${tag} has been uploaded to Real You!`;
    
    // Get subscribed addresses
    const subscribedAddresses = await kv.smembers(`subscriptions:${tag}`);

    // Initialize XMTP client
    const wallet = new Wallet(process.env.PRIVATE_KEY!);
    const client = await Client.create(wallet, {
      apiClientFactory: GrpcApiClient.fromOptions,
      env: "production",
    });

    // Send messages
    for (const address of subscribedAddresses) {
      try {
        //TODO: Add consentProof to the conversation
        const conversation = await client.conversations.newConversation(address);
        await conversation.send(message);
        console.log(`Sent message to: ${address}`);
      } catch (err) {
        console.error(`Error sending message to ${address}:`, err);
      }
      // Add a small delay between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return res.status(200).json({ message: `Notifications sent for tag: ${tag}` });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}