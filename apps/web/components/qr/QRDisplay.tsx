import React, { useState } from 'react';
import {
    QrCode,
    Download,
    Share,
    Copy,
    Check,
    Tag,
    Package,
    Users,
    ShoppingCart
} from '@phosphor-icons/react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../lib/utils';
import { QRData, QRCodeType } from '@zora/types';

interface QRDisplayProps {
    data: QRData;
    type: QRCodeType;
    title?: string;
    size?: number;
    className?: string;
    showActions?: boolean;
}

export function QRDisplay({ data, type, title, size = 200, className, showActions = true }: QRDisplayProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(data));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    };

    const downloadQR = () => {
        // In a real implementation, this would generate and download a QR code
        const qrData = JSON.stringify(data);
        const blob = new Blob([qrData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${type}-qr-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const shareQR = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${type} QR Code`,
                    text: JSON.stringify(data),
                });
            } catch (error) {
                console.error('Failed to share:', error);
            }
        }
    };

    const getTypeIcon = () => {
        switch (type) {
            case 'order': return ShoppingCart;
            case 'product': return Package;
            case 'vendor': return Users;
            case 'promo': return Tag;
            default: return QrCode;
        }
    };

    const getTypeColor = () => {
        switch (type) {
            case 'order': return 'text-blue-600 bg-blue-100';
            case 'product': return 'text-green-600 bg-green-100';
            case 'vendor': return 'text-purple-600 bg-purple-100';
            case 'promo': return 'text-orange-600 bg-orange-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const formatData = () => {
        if (type === 'order' && data.type === 'order') {
            return (
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="font-medium">Order Number:</span>
                        <span className="font-bold">{data.orderId}</span>
                    </div>
                    {data.customerName && (
                        <div className="flex justify-between">
                            <span className="font-medium">Customer:</span>
                            <span className="font-bold">{data.customerName}</span>
                        </div>
                    )}
                    {data.total !== undefined && (
                        <div className="flex justify-between">
                            <span className="font-medium">Total:</span>
                            <span className="font-bold">${data.total}</span>
                        </div>
                    )}
                    {data.status && (
                        <div className="flex justify-between">
                            <span className="font-medium">Status:</span>
                            <span className="font-bold">{data.status}</span>
                        </div>
                    )}
                    {data.items && (
                        <div>
                            <span className="font-medium">Items:</span>
                            <ul className="list-disc list-inside ml-4">
                                {data.items.map((item: string, index: number) => (
                                    <li key={index} className="text-gray-700">{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            );
        }

        if (type === 'product' && data.type === 'product') {
            return (
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="font-medium">Product:</span>
                        <span className="font-bold">{data.name}</span>
                    </div>
                    {data.price !== undefined && (
                        <div className="flex justify-between">
                            <span className="font-medium">Price:</span>
                            <span className="font-bold">${data.price}</span>
                        </div>
                    )}
                    {data.category && (
                        <div className="flex justify-between">
                            <span className="font-medium">Category:</span>
                            <span className="font-bold">{data.category}</span>
                        </div>
                    )}
                    {data.stock !== undefined && (
                        <div className="flex justify-between">
                            <span className="font-medium">Stock:</span>
                            <span className="font-bold">{data.stock} units</span>
                        </div>
                    )}
                    {data.sku && (
                        <div className="flex justify-between">
                            <span className="font-medium">SKU:</span>
                            <span className="font-bold">{data.sku}</span>
                        </div>
                    )}
                </div>
            );
        }

        if (type === 'vendor' && data.type === 'vendor') {
            return (
                <div className="space-y-2">
                    {data.vendorName && (
                        <div className="flex justify-between">
                            <span className="font-medium">Vendor:</span>
                            <span className="font-bold">{data.vendorName}</span>
                        </div>
                    )}
                    {data.category && (
                        <div className="flex justify-between">
                            <span className="font-medium">Category:</span>
                            <span className="font-bold">{data.category}</span>
                        </div>
                    )}
                    {data.rating !== undefined && (
                        <div className="flex justify-between">
                            <span className="font-medium">Rating:</span>
                            <span className="font-bold">{data.rating}/5.0</span>
                        </div>
                    )}
                    {data.location && (
                        <div className="flex justify-between">
                            <span className="font-medium">Location:</span>
                            <span className="font-bold">{data.location}</span>
                        </div>
                    )}
                </div>
            );
        }

        if (type === 'promo' && data.type === 'promo') {
            return (
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="font-medium">Code:</span>
                        <span className="font-bold">{data.promoCode || data.code}</span>
                    </div>
                    {data.discount !== undefined && (
                        <div className="flex justify-between">
                            <span className="font-medium">Discount:</span>
                            <span className="font-bold">{data.discount}%</span>
                        </div>
                    )}
                    {data.minimumOrder !== undefined && (
                        <div className="flex justify-between">
                            <span className="font-medium">Min Order:</span>
                            <span className="font-bold">${data.minimumOrder}</span>
                        </div>
                    )}
                    {data.expiry && (
                        <div className="flex justify-between">
                            <span className="font-medium">Expires:</span>
                            <span className="font-bold">{new Date(data.expiry).toLocaleDateString()}</span>
                        </div>
                    )}
                    {data.description && (
                        <div>
                            <span className="font-medium">Description:</span>
                            <p className="text-gray-700 mt-1">{data.description}</p>
                        </div>
                    )}
                </div>
            );
        }

        return <div className="text-gray-500">Unknown or invalid QR code type</div>;
    };


    return (
        <div className={cn("inline-block", className)}>
            <Card>
                <CardContent className="p-6">
                    {/* QR Code Visual */}
                    <div className="flex justify-center mb-4">
                        <div
                            className="bg-white p-4 rounded-lg shadow-lg"
                            style={{ width: size, height: size }}
                        >
                            {/* This would be a QR code image in a real implementation */}
                            <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded">
                                <QrCode size={size * 0.6} className="text-gray-400" />
                                <span className="text-xs text-gray-500 mt-2">QR Code</span>
                            </div>
                        </div>
                    </div>

                    {/* Title and Type */}
                    <div className="text-center mb-4">
                        {title && <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>}
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getTypeColor()}`}>
                            {React.createElement(getTypeIcon(), { size: 16, className: "text-white" })}
                            <span>{type.toUpperCase()}</span>
                        </div>
                    </div>

                    {/* Data Display */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        {formatData()}
                    </div>

                    {/* Actions */}
                    {showActions && (
                        <div className="flex justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={copyToClipboard}
                                className="relative"
                            >
                                {copied ? (
                                    <>
                                        <Check size={16} />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} />
                                        Copy
                                    </>
                                )}
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={downloadQR}
                            >
                                <Download size={16} />
                                Download
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={shareQR}
                            >
                                <Share size={16} />
                                Share
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
