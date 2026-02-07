
import { IconWeight } from "@phosphor-icons/react";

export type IconName =
    | 'home' | 'home-outline' | 'explore' | 'compass' | 'compass-outline'
    | 'orders' | 'clipboard-text' | 'clipboard-text-outline'
    | 'cart' | 'cart-outline' | 'profile' | 'account' | 'account-outline'
    | 'search' | 'magnify' | 'filter' | 'tune'
    | 'plus' | 'minus' | 'close' | 'check'
    | 'arrow-left' | 'arrow-right' | 'chevron-down' | 'chevron-up' | 'chevron-left' | 'chevron-right'
    | 'heart' | 'heart-outline' | 'star' | 'star-outline' | 'bell' | 'bell-outline'
    | 'map-marker' | 'location' | 'clock' | 'clock-outline' | 'truck-delivery' | 'truck-delivery-outline'
    | 'qrcode' | 'qrcode-scan'
    | 'basket' | 'bag' | 'tag' | 'percent' | 'gift' | 'package' | 'receipt' | 'credit-card' | 'wallet'
    | 'settings' | 'cog' | 'logout' | 'login' | 'email' | 'email-outline'
    | 'lock' | 'lock-outline' | 'eye' | 'eye-outline' | 'eye-off' | 'eye-off-outline'
    | 'google' | 'apple' | 'facebook' | 'share'
    | 'food' | 'pot-steam' | 'leaf' | 'coffee' | 'tshirt-crew' | 'palette' | 'flower' | 'fire' | 'diamond-stone'
    | 'information' | 'help-circle' | 'phone' | 'camera' | 'image' | 'trash' | 'pencil' | 'edit' | 'crosshairs-gps';

export const PHOSPHOR_ICON_MAP: Record<string, string> = {
    // Navigation
    'home': 'House',
    'home-outline': 'House',
    'explore': 'Compass',
    'compass': 'Compass',
    'compass-outline': 'Compass',
    'orders': 'ClipboardText',
    'clipboard-text': 'ClipboardText',
    'clipboard-text-outline': 'ClipboardText',
    'cart': 'ShoppingCart',
    'cart-outline': 'ShoppingCart',
    'profile': 'User',
    'account': 'User',
    'account-outline': 'User',

    // Common Actions
    'search': 'MagnifyingGlass',
    'magnify': 'MagnifyingGlass',
    'filter': 'Funnel',
    'tune': 'Sliders',
    'plus': 'Plus',
    'minus': 'Minus',
    'close': 'X',
    'check': 'Check',
    'arrow-left': 'ArrowLeft',
    'arrow-right': 'ArrowRight',
    'chevron-down': 'CaretDown',
    'chevron-up': 'CaretUp',
    'chevron-left': 'CaretLeft',
    'chevron-right': 'CaretRight',

    // Features
    'heart': 'Heart',
    'heart-outline': 'Heart',
    'star': 'Star',
    'star-outline': 'Star',
    'bell': 'Bell',
    'bell-outline': 'Bell',
    'map-marker': 'MapPin',
    'location': 'MapPin',
    'clock': 'Clock',
    'clock-outline': 'Clock',
    'truck-delivery': 'Truck',
    'truck-delivery-outline': 'Truck',
    'qrcode': 'QrCode',
    'qrcode-scan': 'QrCode',

    // Products & Shopping
    'basket': 'Basket',
    'bag': 'Bag',
    'tag': 'Tag',
    'percent': 'Percent',
    'gift': 'Gift',
    'package': 'Package',
    'receipt': 'Receipt',
    'credit-card': 'CreditCard',
    'wallet': 'Wallet',

    // User & Settings
    'settings': 'Gear',
    'cog': 'Gear',
    'logout': 'SignOut',
    'login': 'SignIn',
    'email': 'Envelope',
    'email-outline': 'Envelope',
    'lock': 'Lock',
    'lock-outline': 'Lock',
    'eye': 'Eye',
    'eye-outline': 'Eye',
    'eye-off': 'EyeSlash',
    'eye-off-outline': 'EyeSlash',

    // Social
    'google': 'GoogleLogo',
    'apple': 'AppleLogo',
    'facebook': 'FacebookLogo',
    'share': 'ShareNetwork',

    // Categories
    'food': 'CookingPot',
    'pot-steam': 'CookingPot',
    'leaf': 'Leaf',
    'coffee': 'Coffee',
    'tshirt-crew': 'TShirt',
    'palette': 'Palette',
    'flower': 'Flower',
    'fire': 'Fire',
    'diamond-stone': 'Diamond',

    // Misc
    'information': 'Info',
    'help-circle': 'Question',
    'phone': 'Phone',
    'camera': 'Camera',
    'image': 'Image',
    'trash': 'Trash',
    'pencil': 'Pencil',
    'edit': 'PencilSimple',
    'crosshairs-gps': 'Crosshair',
};
