import { Client } from "@xmtp/xmtp-js";
import { GrpcApiClient } from "@xmtp/grpc-api-client";
import { Wallet } from "ethers";
import * as dotenv from 'dotenv';
dotenv.config();

const XMTP_RATE_LIMIT = 1000;
const XMTP_RATE_LIMIT_TIME = 60 * 1000; // 1 minute
const XMTP_RATE_LIMIT_TIME_INCREASE = XMTP_RATE_LIMIT_TIME * 5; // 5 minutes

const BROADCAST_AMOUNT = 10000;

//const broadcastAddresses = new Array<string>(BROADCAST_AMOUNT).fill("");
const MY_ETH_ADDRESS = "0xC3e26664872299d797bA1C4AF19674239B250F61";
//const MY_XMTP_ADDRESS = "0x4c8f2e1A98397EbD82e780A6e791a0b09202E25c";
const broadcastAddresses = [MY_ETH_ADDRESS];

interface Subscription {
  address: string;
  tags: string[];
}

const subscriptions: Subscription[] = [
  { address: "0xUser1Address", tags: ["Nature", "Travel"] },
  { address: "0xUser2Address", tags: ["Food", "Pets"] },
  // Add more subscriptions as needed
];

const tagMessages: { [key: string]: string } = {
  "Nature": "A new nature photo has been uploaded to Real You!",
  "Food": "A delicious new food photo is waiting for you on Real You!",
  "Travel": "Explore a new destination on Real You - a travel photo just dropped!",
  "Sports": "Catch the latest sports action on Real You - new photo alert!",
  "People": "A captivating portrait has been added to Real You!",
  "Pets": "Adorable alert! A new pet photo is live on Real You!",
  "Art & Fashion": "Get inspired by the latest art & fashion photo on Real You!",
};

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const run = async (tag: string) => {
  const startTime = Date.now();
  
  // Get the private key from the environment variable
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY environment variable is not set");
  }
  
  // Create wallet from the private key
  const wallet = new Wallet(privateKey);
  console.log("wallet= ", wallet);
  
  // Create the client with your wallet. This will connect to the XMTP development network by default
  console.log("Creating client");
  const client = await Client.create(wallet, {
    apiClientFactory: GrpcApiClient.fromOptions,
    env: "production",
  });

  // Get the message for the specified tag
  const message = tagMessages[tag] || `A new photo tagged with ${tag} has been uploaded to Real You!`;
  console.log(`Sending message for tag: ${tag}`);

  const canMessageAddresses = await client.canMessage(broadcastAddresses);
  console.log("canMessageAddresses= ", canMessageAddresses);
  
  let errorCount = 0;
  let currentRateLimitWaitTime = XMTP_RATE_LIMIT_TIME;

  for (let i = 0; i < canMessageAddresses.length; i++) {
    if (broadcastAddresses[i]) {
      try {
        const conversation = await client.conversations.newConversation(broadcastAddresses[i]);
        await conversation.send(message);
        console.log(`Sent message to: ${broadcastAddresses[i]}`);
      } catch (err) {
        errorCount++;
        console.log(`Rate limited, waiting ${currentRateLimitWaitTime}`);
        await delay(currentRateLimitWaitTime);
        try {
          const conversation = await client.conversations.newConversation(broadcastAddresses[i]);
          await conversation.send(message);
          console.log(`Retry successful for: ${broadcastAddresses[i]}`);
        } catch (retryErr) {
          errorCount++;
          console.error(`Failed to send message to ${broadcastAddresses[i]} after retry:`, retryErr);
        }
      }

      // Wait between messages to avoid rate limiting
      await delay(XMTP_RATE_LIMIT_TIME);
    }
  }

  const endTime = Date.now();
  console.log(`Total time: ${endTime - startTime}ms with ${errorCount} errors`);
};

// Example usage:
run("Nature");