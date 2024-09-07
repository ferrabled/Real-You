const express = require('express');
const { privateKeyToAccount } = require("viem/accounts");
const { SignProtocolClient, SpMode, EvmChains } = require("@ethsign/sp-sdk");
require('dotenv').config();

const app = express();
app.use(express.json());

const privateKey = process.env.PRIVATE_KEY;
const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.sepolia,
  account: privateKeyToAccount(privateKey),
});


app.post('/api/createAttestation', async (req, res) => {
  //const { photoId, owner, ipfsHash, uploadTimestamp } = req.body;
  const { photoId, ipfsHash } = req.body;
  try {
    const attestation = await client.createAttestation({
      schemaId: process.env.SCHEMA_ID,
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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});