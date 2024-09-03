import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { address } = req.query;
    
    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Address is required as a query parameter' });
    }

    try {
      const allTags = ['Nature', 'Food', 'Travel', 'Sports', 'People', 'Pets', 'Art & Fashion'];
      const userSubscriptions = [];

      for (const tag of allTags) {
        const subscriptions = await kv.smembers(`subscriptions:${tag}`);
        const isSubscribed = subscriptions.some(sub => sub.startsWith(`${address},`));
        if (isSubscribed) {
          userSubscriptions.push(tag);
        }
      }

      return res.status(200).json({ subscriptions: userSubscriptions });
    } catch (error) {
      console.error('Error retrieving user subscriptions:', error);
      return res.status(500).json({ error: 'Failed to retrieve user subscriptions' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}