import { VercelRequest, VercelResponse } from '@vercel/node';
import { privateKeyToAccount } from "viem/accounts";
import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";
import 'dotenv/config';

const privateKey = process.env.PRIVATE_KEY;
const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.sepolia,
  account: privateKeyToAccount(`0x${privateKey}`),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { photoId, ipfsHash } = req.body;

    if (!photoId || !ipfsHash) {
      return res.status(400).json({ error: 'photoId and ipfsHash are required in the request body' });
    }

    try {
      const attestation = await client.createAttestation({
        schemaId: process.env.SCHEMA_ID!,
        data: {
          PhotoHash: ipfsHash,
          PhotoId: photoId,
          IsVerified: true
        },
        indexingValue: photoId
      });

      res.status(200).json({ 
        message: 'Attestation created', 
        attestationId: attestation.attestationId,
        txHash: attestation.txHash,
        indexingValue: attestation.indexingValue
      });
    } catch (error) {
      console.error('Error creating attestation:', error);
      res.status(500).json({ error: 'Failed to create attestation' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
