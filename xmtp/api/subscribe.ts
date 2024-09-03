import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { tag, address, signature, currentTime } = req.body;
    
    if (!tag || !address || !signature) {
      return res.status(400).json({ error: 'Tag, address, and signature are required' });
    }

    try {
      // Combine address and signature into a single string
      const subscriptionData = `${address},${signature},${currentTime}`;

      // Add the subscription data to the set for the tag
      await kv.sadd(`subscriptions:${tag}`, subscriptionData);
      console.log(`Subscription added successfully: ${subscriptionData}`);
      return res.status(200).json({ message: 'Subscription added successfully' });
    } catch (error) {
      console.error('Error storing subscription:', error);
      return res.status(500).json({ error: 'Failed to store subscription' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}