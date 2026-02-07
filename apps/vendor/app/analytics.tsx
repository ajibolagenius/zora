import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    TrendUp,
    TrendDown,
    ArrowUp,
    ArrowDown,
    Download,
    Calendar,
    Filter,
    Users,
    Package,
    Star,
    Clock,
    CurrencyDollar,
    ChartLine,
    Lightbulb,
    Minus,
} from 'phosphor-react-native';
import { useVendorAnalytics, useAnalyticsFilters, useRealTimeAnalytics } from '../hooks/useVendorAnalytics';
import { useAuthStore } from '../stores/authStore';
import { Card, MetricCard, FilterChip } from '../components/ui';
import { Colors, Spacing, BorderRadius, FontSize, FontFamily } from '../constants';

export default function VendorAnalyticsScreen() {
    const { user } = useAuthStore();
    const vendorId = user?.vendor_id;

    const {
        analytics,
        isLoading,
        error,
        refreshAnalytics,
        updateFilters,
        exportAnalytics,
        isExporting,
    } = useVendorAnalytics(vendorId, filters);

    const {
        filters,
        updateFilter,
        clearFilters,
        setDateRange,
    } = useAnalyticsFilters();

    const realTimeData = useRealTimeAnalytics(vendorId);

    const [selectedTimeRange, setSelectedTimeRange] = useState<'today' | 'week' | 'month' | 'quarter' | 'year'>('month');

    // Handle time range change
    const handleTimeRangeChange = (range: typeof selectedTimeRange) => {
        setSelectedTimeRange(range);
        setDateRange(range);
    };

    // Handle export
    const handleExport = (format: 'csv' | 'json') => {
        exportAnalytics(format);
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading analytics...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Failed to load analytics</Text>
                    <TouchableOpacity onPress={refreshAnalytics}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Analytics Dashboard</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.exportButton}
                        onPress={() => handleExport('csv')}
                        disabled={isExporting}
                    >
                        <Download size={20} color={Colors.textPrimary} />
                        <Text style={styles.exportButtonText}>Export</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Real-time Stats */}
            <View style={styles.realTimeSection}>
                <Text style={styles.sectionTitle}>Real-time Activity</Text>
                <View style={styles.realTimeGrid}>
                    <MetricCard
                        title="Active Orders"
                        value={realTimeData.activeOrders.toString()}
                        icon={<Package size={24} color={Colors.primary} />}
                        trend="stable"
                    />
                    <MetricCard
                        title="Today's Revenue"
                        value={`$${realTimeData.todayRevenue.toFixed(2)}`}
                        icon={<CurrencyDollar size={24} color={Colors.success} />}
                        trend="up"
                    />
                    <MetricCard
                        title="Online Customers"
                        value={realTimeData.onlineCustomers.toString()}
                        icon={<Users size={24} color={Colors.info} />}
                        trend="stable"
                    />
                </View>
            </View>

            {/* Time Range Selector */}
            <View style={styles.timeRangeSection}>
                <Text style={styles.sectionTitle}>Time Period</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {(['today', 'week', 'month', 'quarter', 'year'] as const).map((range) => (
                        <FilterChip
                            key={range}
                            label={range.charAt(0).toUpperCase() + range.slice(1)}
                            selected={selectedTimeRange === range}
                            onPress={() => handleTimeRangeChange(range)}
                        />
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refreshAnalytics} />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Revenue Overview */}
                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>Revenue Overview</Text>
                    <View style={styles.metricsGrid}>
                        <MetricCard
                            title="Total Revenue"
                            value={`$${analytics?.revenue.total?.toFixed(2) || '0'}`}
                            icon={<CurrencyDollar size={24} color={Colors.primary} />}
                            trend={analytics?.revenue.changePercent >= 0 ? 'up' : 'down'}
                            trendValue={`${analytics?.revenue.changePercent >= 0 ? '+' : ''}${analytics?.revenue.changePercent?.toFixed(1)}%`}
                        />
                        <MetricCard
                            title="This Month"
                            value={`$${analytics?.revenue.thisMonth?.toFixed(2) || '0'}`}
                            icon={<Calendar size={24} color={Colors.info} />}
                        />
                        <MetricCard
                            title="Last Month"
                            value={`$${analytics?.revenue.lastMonth?.toFixed(2) || '0'}`}
                            icon={<Calendar size={24} color={Colors.textMuted} />}
                        />
                    </View>
                </Card>

                {/* Orders Overview */}
                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>Orders Overview</Text>
                    <View style={styles.metricsGrid}>
                        <MetricCard
                            title="Total Orders"
                            value={analytics?.orders.total?.toString() || '0'}
                            icon={<Package size={24} color={Colors.primary} />}
                            trend={analytics?.orders.changePercent >= 0 ? 'up' : 'down'}
                            trendValue={`${analytics?.orders.changePercent >= 0 ? '+' : ''}${analytics?.orders.changePercent?.toFixed(1)}%`}
                        />
                        <MetricCard
                            title="Completed"
                            value={analytics?.orders.completed?.toString() || '0'}
                            icon={<ArrowUp size={24} color={Colors.success} />}
                        />
                        <MetricCard
                            title="Pending"
                            value={analytics?.orders.pending?.toString() || '0'}
                            icon={<Clock size={24} color={Colors.warning} />}
                        />
                        <MetricCard
                            title="Cancelled"
                            value={analytics?.orders.cancelled?.toString() || '0'}
                            icon={<ArrowDown size={24} color={Colors.error} />}
                        />
                    </View>
                </Card>

                {/* Customer Analytics */}
                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>Customer Analytics</Text>
                    <View style={styles.metricsGrid}>
                        <MetricCard
                            title="Total Customers"
                            value={analytics?.customers.total?.toString() || '0'}
                            icon={<Users size={24} color={Colors.primary} />}
                            trend={analytics?.customers.new > 0 ? 'up' : 'stable'}
                            trendValue={`${analytics?.customers.new} new`}
                        />
                        <MetricCard
                            title="Returning"
                            value={analytics?.customers.returning?.toString() || '0'}
                            icon={<Users size={24} color={Colors.info} />}
                        />
                        <MetricCard
                            title="Avg Order Value"
                            value={`$${analytics?.customers.averageOrderValue?.toFixed(2) || '0'}`}
                            icon={<CurrencyDollar size={24} color={Colors.success} />}
                        />
                        <MetricCard
                            title="Retention Rate"
                            value={`${analytics?.customers.retentionRate?.toFixed(1) || '0'}%`}
                            icon={<ChartLine size={24} color={Colors.primary} />}
                        />
                    </View>
                </Card>

                {/* Performance Metrics */}
                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>Performance Metrics</Text>
                    <View style={styles.metricsGrid}>
                        <MetricCard
                            title="Average Rating"
                            value={analytics?.performance.averageRating?.toFixed(1) || '0'}
                            icon={<Star size={24} color={Colors.warning} />}
                        />
                        <MetricCard
                            title="Total Reviews"
                            value={analytics?.performance.totalReviews?.toString() || '0'}
                            icon={<Star size={24} color={Colors.info} />}
                        />
                        <MetricCard
                            title="Fulfillment Rate"
                            value={`${analytics?.performance.fulfillmentRate?.toFixed(1) || '0'}%`}
                            icon={<Package size={24} color={Colors.success} />}
                        />
                        <MetricCard
                            title="On-time Delivery"
                            value={`${analytics?.performance.onTimeDelivery?.toFixed(1) || '0'}%`}
                            icon={<Clock size={24} color={Colors.success} />}
                        />
                    </View>
                </Card>

                {/* Top Products */}
                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>Top Selling Products</Text>
                    {analytics?.products.topSelling?.slice(0, 5).map((product, index) => (
                        <View key={product.id} style={styles.productItem}>
                            <View style={styles.productRank}>
                                <Text style={styles.rankText}>#{index + 1}</Text>
                            </View>
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productStats}>
                                    {product.sales} sold • ${product.revenue.toFixed(2)}
                                </Text>
                            </View>
                            <View style={styles.productRating}>
                                <Star size={16} color={Colors.warning} />
                                <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
                            </View>
                        </View>
                    ))}
                </Card>

                {/* Business Insights */}
                <Card style={styles.section}>
                    <View style={styles.insightsHeader}>
                        <Text style={styles.sectionTitle}>Business Insights</Text>
                        <Lightbulb size={24} color={Colors.warning} />
                    </View>

                    <View style={styles.insightsContent}>
                        <View style={styles.insightItem}>
                            <Text style={styles.insightLabel}>Best Selling Category</Text>
                            <Text style={styles.insightValue}>{analytics?.insights.bestSellingCategory}</Text>
                        </View>

                        <View style={styles.insightItem}>
                            <Text style={styles.insightLabel}>Customer Satisfaction</Text>
                            <View style={styles.satisfactionBadge}>
                                <Text style={styles.satisfactionText}>
                                    {analytics?.insights.customerSatisfaction?.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.insightItem}>
                            <Text style={styles.insightLabel}>Peak Hours</Text>
                            <Text style={styles.insightValue}>{analytics?.insights.peakHours?.join(', ')}</Text>
                        </View>

                        <View style={styles.insightItem}>
                            <Text style={styles.insightLabel}>Growth Opportunities</Text>
                            <View style={styles.opportunitiesList}>
                                {analytics?.insights.growthOpportunities?.map((opportunity, index) => (
                                    <Text key={index} style={styles.opportunityText}>
                                        • {opportunity}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    </View>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: Spacing.md,
        fontSize: FontSize.body,
        color: Colors.textMuted,
        fontFamily: FontFamily.body,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    errorText: {
        fontSize: FontSize.body,
        color: Colors.error,
        fontFamily: FontFamily.body,
        marginBottom: Spacing.md,
    },
    retryText: {
        fontSize: FontSize.body,
        color: Colors.primary,
        fontFamily: FontFamily.bodySemiBold,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.card,
        borderBottomLeftRadius: BorderRadius.xl,
        borderBottomRightRadius: BorderRadius.xl,
    },
    headerTitle: {
        fontSize: FontSize.h2,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        fontFamily: FontFamily.displayBold,
    },
    headerActions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    exportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.full,
        gap: Spacing.xs,
    },
    exportButtonText: {
        fontSize: FontSize.small,
        color: Colors.textPrimary,
        fontFamily: FontFamily.bodySemiBold,
    },
    realTimeSection: {
        margin: Spacing.lg,
        paddingHorizontal: Spacing.lg,
    },
    realTimeGrid: {
        gap: Spacing.md,
    },
    timeRangeSection: {
        marginHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: FontSize.h3,
        fontWeight: '600',
        color: Colors.textPrimary,
        fontFamily: FontFamily.displaySemiBold,
        marginBottom: Spacing.md,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    metricsGrid: {
        gap: Spacing.md,
    },
    insightsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    insightsContent: {
        gap: Spacing.md,
    },
    insightItem: {
        marginBottom: Spacing.md,
    },
    insightLabel: {
        fontSize: FontSize.small,
        color: Colors.textMuted,
        fontFamily: FontFamily.body,
        marginBottom: Spacing.xs,
    },
    insightValue: {
        fontSize: FontSize.body,
        color: Colors.textPrimary,
        fontFamily: FontFamily.bodySemiBold,
    },
    satisfactionBadge: {
        backgroundColor: Colors.success,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
        alignSelf: 'flex-start',
    },
    satisfactionText: {
        fontSize: FontSize.small,
        color: Colors.textPrimary,
        fontFamily: FontFamily.bodySemiBold,
    },
    opportunitiesList: {
        gap: Spacing.xs,
    },
    opportunityText: {
        fontSize: FontSize.small,
        color: Colors.textPrimary,
        fontFamily: FontFamily.body,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
    },
    productRank: {
        width: 32,
        height: 32,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    rankText: {
        fontSize: FontSize.small,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: FontSize.body,
        fontWeight: '600',
        color: Colors.textPrimary,
        fontFamily: FontFamily.bodySemiBold,
        marginBottom: Spacing.xs,
    },
    productStats: {
        fontSize: FontSize.small,
        color: Colors.textMuted,
        fontFamily: FontFamily.body,
    },
    productRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    ratingText: {
        fontSize: FontSize.small,
        color: Colors.textMuted,
        fontFamily: FontFamily.body,
    },
};
