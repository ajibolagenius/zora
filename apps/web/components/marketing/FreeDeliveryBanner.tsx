import { Truck } from "@phosphor-icons/react";

export function FreeDeliveryBanner() {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-secondary py-3 px-4 text-center">
            <div className="container mx-auto max-w-7xl flex items-center justify-center gap-2">
                <Truck size={20} weight="duotone" className="text-text-dark" />
                <span className="font-display font-bold text-text-dark text-sm">
                    FREE DELIVERY ALL ACROSS UK
                </span>
            </div>
        </div>
    );
}
