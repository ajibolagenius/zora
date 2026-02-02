/**
 * Admin Dashboard Hooks
 */

export { useAuth, useAdminId } from './useAuth';
export {
    useAdminStats,
    usePendingItems,
    useRecentOrders,
    useVendorApplications,
    useAllOrders,
    useAllVendors,
    useAllProducts,
    useUpdateOrderStatus,
    useApproveVendorApplication,
    useRejectVendorApplication,
    adminQueryKeys,
    type VendorWithProductCount,
} from './useAdminData';
