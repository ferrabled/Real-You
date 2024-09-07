import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { tag } = req.query;
    
    if (!tag || typeof tag !== 'string') {
      return res.status(400).json({ error: 'Tag is required as a query parameter' });
    }

    try {
      // Retrieve subscriptions for the given tag
      const subscriptions = await kv.smembers(`subscriptions:${tag}`);
      //get only the addresses
      const addresses = subscriptions.map(sub => sub.split(',')[0]);
      return res.status(200).json({ addresses });
    } catch (error) {
      console.error('Error retrieving subscriptions:', error);
      return res.status(500).json({ error: 'Failed to retrieve subscriptions' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}