
import React from 'react';
import { WifiHigh, WifiX, RefreshCw } from '@phosphor-icons/react';
import { type ConnectionStatus as StatusType } from '@zora/api-client';

interface ConnectionStatusProps {
    status: StatusType;
    className?: string;
}

export function ConnectionStatus({ status, className = '' }: ConnectionStatusProps) {
    if (status === 'connected') {
        return (
            <div className={`flex items-center gap-2 text-green-600 ${className}`} title="Connected">
                <WifiHigh size={18} weight="duotone" />
                <span className="text-xs font-medium hidden sm:inline">Live</span>
            </div>
        );
    }

    if (status === 'reconnecting') {
        return (
            <div className={`flex items-center gap-2 text-amber-600 ${className}`} title="Reconnecting...">
                <RefreshCw size={18} weight="duotone" className="animate-spin" />
                <span className="text-xs font-medium hidden sm:inline">Reconnecting</span>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2 text-slate-400 ${className}`} title="Offline">
            <WifiX size={18} weight="duotone" />
            <span className="text-xs font-medium hidden sm:inline">Offline</span>
        </div>
    );
}
