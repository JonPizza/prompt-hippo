import { useState, useEffect } from 'react';

export default function APIStatus({ error, loading }: { error?: string; loading?: boolean }) {
  if (loading) {
    return <div className="text-blue-500 text-xs mt-2">Connecting to API...</div>;
  }
  if (error) {
    return <div className="text-red-500 text-xs mt-2">{error}</div>;
  }
  return null;
}
