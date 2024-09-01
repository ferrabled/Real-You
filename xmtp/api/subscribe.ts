import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { address, tag } = req.body;
    
    if (!address || !tag) {
      return res.status(400).json({ error: 'Address and tag are required' });
    }

    // Add the subscription
    await kv.sadd(`subscriptions:${tag}`, address);
    
    return res.status(200).json({ message: 'Subscription added successfully' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}