import { Wallet, ethers } from "ethers";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import 'dotenv/config';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { ipfsUrl } = req.body;
    
    if (!ipfsUrl) {
      return res.status(400).json({ error: 'IPFS URL is required in the request body' });
    }

    const privateKey = process.env.BACKEND_PRIVATE_KEY;
    if (!privateKey) {
      console.log("Ethereum private key is not set");
      return res.status(500).json({ error: 'Ethereum private key is not set' });
    }

    try {
      const provider = new ethers.JsonRpcProvider("https://devnet.galadriel.com");
      const wallet = new ethers.Wallet(privateKey, provider);

      // Create contract instance
      const contract = new ethers.Contract(GALADRIEL_ADDRESS, GALADRIEL_ABI, wallet);
      const imageUrl = ('https://ipfs.io/ipfs/' + ipfsUrl);
      console.log("imageUrl: ", imageUrl);

      // Prepare the prompt
      const prompt = `Analyze the following image:
      Provide a JSON response with the following structure:
      {
        "isPhotoreal": boolean,
        "photoDescription": string,
        "listOfTags": [string] (choose from: ["Nature","Food","Travel","Sports","People","Pets","Art & Fashion"])
      }
      Ensure the image is not AI-generated or edited with editing tools when determining if it's photoreal. For it to be photoreal, it should look like a real photo taken with a camera.`;

      const tx = await contract.startChat(prompt, [imageUrl]);
      const receipt = await tx.wait();

      const chatId = receipt.logs[1].args[1];
      console.log("chatId: ", chatId.toString());

      // Wait for a short period to allow the contract to process the request
      await new Promise(resolve => setTimeout(resolve, 2000)); // 4 seconds delay

      // Call getMessageHistory to get the result
      const messages = await contract.getMessageHistory(chatId);
      console.log("messages", messages);

      // Get the last message (assistant's response)
      const llmResponse = messages[messages.length - 1][1];
      console.log("lastMessage", llmResponse);

      const content = llmResponse[0][1];
      console.log("content: ", content);

      // Try to parse the JSON response
      let analysis;
      try {
        // First, try to parse the entire content as JSON
        analysis = JSON.parse(content);
      } catch (error) {
        // If parsing fails, try to extract JSON from the content
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            analysis = JSON.parse(jsonMatch[0]);
          } catch (innerError) {
            console.error('Error parsing extracted JSON:', innerError);
            throw new Error('Failed to parse the response from GPT-4 Vision');
          }
        } else {
          console.error('No valid JSON found in the response');
          throw new Error('Invalid response format from GPT-4 Vision');
        }
      }

      // Validate the parsed result
      if (!analysis || typeof analysis !== 'object' || 
          !('isPhotoreal' in analysis) || 
          !('photoDescription' in analysis) || 
          !('listOfTags' in analysis)) {
        throw new Error('Invalid response structure from GPT-4 Vision');
      }

      // Ensure listOfTags is an array
      if (!Array.isArray(analysis.listOfTags)) {
        analysis.listOfTags = [analysis.listOfTags].filter(Boolean);
      }

      // Filter tags to only include valid ones
      const validTags = ["Nature", "Food", "Travel", "Sports", "People", "Pets", "Art & Fashion"];
      analysis.listOfTags = analysis.listOfTags.filter((tag: string) => validTags.includes(tag));
      console.log("PHOTO RETURNED: ");
      console.log("analysis.listOfTags: ", analysis.listOfTags);
      console.log("analysis.photoDescription: ", analysis.photoDescription);
      console.log("analysis.isPhotoreal: ", analysis.isPhotoreal);
      console.log("analysis: ", analysis);

      res.json(analysis);
    } catch (error) {
      console.error('Error interacting with smart contract:', error);
      return res.status(500).json({ error: 'Failed to analyze the image' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


export const GALADRIEL_ADDRESS = "0xF6b705595E95c8D94E22B38570e79f8BaFa39558";
export const GALADRIEL_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "initialOracleAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "chatId",
				"type": "uint256"
			}
		],
		"name": "ChatCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOracleAddress",
				"type": "address"
			}
		],
		"name": "OracleAddressUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "message",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "runId",
				"type": "uint256"
			}
		],
		"name": "addMessage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "chatRuns",
		"outputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "messagesCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "chatId",
				"type": "uint256"
			}
		],
		"name": "getMessageHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "role",
						"type": "string"
					},
					{
						"components": [
							{
								"internalType": "string",
								"name": "contentType",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "value",
								"type": "string"
							}
						],
						"internalType": "struct IOracle.Content[]",
						"name": "content",
						"type": "tuple[]"
					}
				],
				"internalType": "struct IOracle.Message[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "runId",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "id",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "content",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "functionName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "functionArguments",
						"type": "string"
					},
					{
						"internalType": "uint64",
						"name": "created",
						"type": "uint64"
					},
					{
						"internalType": "string",
						"name": "model",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "systemFingerprint",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "object",
						"type": "string"
					},
					{
						"internalType": "uint32",
						"name": "completionTokens",
						"type": "uint32"
					},
					{
						"internalType": "uint32",
						"name": "promptTokens",
						"type": "uint32"
					},
					{
						"internalType": "uint32",
						"name": "totalTokens",
						"type": "uint32"
					}
				],
				"internalType": "struct IOracle.OpenAiResponse",
				"name": "response",
				"type": "tuple"
			},
			{
				"internalType": "string",
				"name": "errorMessage",
				"type": "string"
			}
		],
		"name": "onOracleOpenAiLlmResponse",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "oracleAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOracleAddress",
				"type": "address"
			}
		],
		"name": "setOracleAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "message",
				"type": "string"
			},
			{
				"internalType": "string[]",
				"name": "imageUrls",
				"type": "string[]"
			}
		],
		"name": "startChat",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];