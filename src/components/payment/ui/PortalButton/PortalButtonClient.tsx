'use client';

import { createStripePortal } from '@/utils/stripe/server';

export default async function PortalButtonClient() {
    async function handleClick() {
        window.location.href = await createStripePortal('/profile')
    }

    return (
        <div className="btn btn-secondary" onClick={handleClick}>
            Manage Plan
        </div>
    )
}