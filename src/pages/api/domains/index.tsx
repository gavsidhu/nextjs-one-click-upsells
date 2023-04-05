import type { NextApiRequest, NextApiResponse } from 'next';
import { addCustomDomain, deleteCustomDomain } from '@/utils/supabase-admin';
import axios from 'axios';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;

    switch (method) {
        case 'POST':
            const { domain, shopId } = req.body

            if (!domain) {
                return res.status(400).json({ message: "Domain is required" });
            }

            try {
                const response = await axios.post(
                    `https://api.vercel.com/v8/projects/${process.env.PROJECT_ID_VERCEL}/domains`,
                    { name: domain },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                const data = response.data

                // Domain is already owned by another team but you can request delegation to access it
                if (data.error?.code === 'forbidden') return res.status(403).end();

                // Domain is already being used by a different project
                if (data.error?.code === 'domain_taken') return res.status(409).end();

                // Domain is successfully added

                await addCustomDomain(shopId, domain)

                return res.status(200).json({ message: "Domain added successfully", data: response.data });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "An error occurred while adding the domain" });
            }
        case 'DELETE':
            if (Array.isArray(domain) || Array.isArray(shopId))
                res.status(400).end("Bad request. Query parameters cannot be an array.");

            try {
                const response = await axios.delete(
                    `https://api.vercel.com/v6/domains/${domain}`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
                        },
                    }
                );

                await deleteCustomDomain(shopId)

                return res.status(200).end();
            } catch (error) {
                console.error(error);
                return res.status(500).end(error);
            }
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
