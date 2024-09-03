import { kv } from '@vercel/kv';
import { Client } from "@xmtp/xmtp-js";
import { GrpcApiClient } from "@xmtp/grpc-api-client";
import { Wallet } from "ethers";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createConsentProofPayload } from '@xmtp/consent-proof-signature';
import Long from 'long';

const tagMessages: { [key: string]: string } = {
  "Nature": "A new nature photo has been uploaded to Real You!",
  "Food": "A delicious new food photo is waiting for you on Real You!",
  "Travel": "Explore a new destination on Real You - a travel photo just dropped!",
  "Sports": "Catch the latest sports action on Real You - new photo alert!",
  "People": "A captivating portrait has been added to Real You!",
  "Pets": "Adorable alert! A new pet photo is live on Real You!",
  "Art & Fashion": "Get inspired by the latest art & fashion photo on Real You!",
};

const tagPrivateKeys: { [key: string]: string } = {
  "Nature": process.env.NATURE_PRIVATE_KEY!,
  "Food": process.env.FOOD_PRIVATE_KEY!,
  "Travel": process.env.TRAVEL_PRIVATE_KEY!,
  "Sports": process.env.SPORTS_PRIVATE_KEY!,
  "People": process.env.PEOPLE_PRIVATE_KEY!,
  "Pets": process.env.PETS_PRIVATE_KEY!,
  "Art & Fashion": process.env.ART_FASHION_PRIVATE_KEY!,
  // Add a default key for any other tags
  "default": process.env.DEFAULT_PRIVATE_KEY!,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { tag } = req.body;
    
    if (!tag) {
      return res.status(400).json({ error: 'Tag is required' });
    }

    const message = tagMessages[tag] || `A new photo tagged with ${tag} has been uploaded to Real You. Go check it out!`;
    
    // Get subscribed data
    const subscribedData = await kv.smembers(`subscriptions:${tag}`);

    // Get the private key for the tag
    const privateKey = tagPrivateKeys[tag] || tagPrivateKeys["default"];

    // Initialize XMTP client with the tag-specific private key
    const wallet = new Wallet(privateKey);
    const client = await Client.create(wallet, {env: "production"});

    // Send messages
    for (const data of subscribedData) {
      const [address, signature, currentTime] = data.split(',');
      console.log("Data:", data);
      console.log(data)
      console.log(`Sending message to: ${address}, signature: ${signature}, currentTime: ${currentTime}`);
      try {
        const conversation = await client.conversations.newConversation(
          address,
          { conversationId: "RealYou Updates", metadata: {} },
          { signature, timestamp: Long.fromString(currentTime), payloadVersion: 1 }
        );
        await conversation.send(message);
        console.log(`Sent message to: ${address} with signature: ${signature}`);
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