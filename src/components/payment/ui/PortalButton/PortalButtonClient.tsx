'use client';

import { createStripePortal } from '@/utils/stripe/server';

export default async function PortalButtonClient(props: {
    customerId: string;
}) {
    return (
        <div className="btn btn-secondary" onClick={async () => { window.location.href = await createStripePortal('/profile') }}>
            Manage Plan
        </div>
    )
}