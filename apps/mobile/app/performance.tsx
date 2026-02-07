import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Ionicons,
    MaterialIcons,
} from '@expo/vector-icons';
import { usePerformanceMonitoring } from '../hooks/usePerformanceMonitoring';

interface PerformanceMetric {
    id: string;
    name: string;
    value: string | number;
    unit?: string;
    status: 'good' | 'warning' | 'critical';
    icon: React.ReactNode;
    action?: string;
}

interface CacheItem {
    id: string;
    name: string;
    size: string;
    lastAccessed: string;
    type: 'image' | 'data' | 'temp';
}

export default function PerformanceScreen() {
    const [activeTab, setActiveTab] = useState<'overview' | 'cache' | 'network'>('overview');
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [optimizationResults, setOptimizationResults] = useState<string[]>([]);

    const {
        clearCache,
        optimizeDatabase,
        networkSpeed,
        batteryLevel,
        memoryUsage
    } = usePerformanceMonitoring();

    const performanceMetrics: PerformanceMetric[] = [
        {
            id: '1',
            name: 'App Startup Time',
            value: '1.2',
            unit: 's',
            status: 'good',
            icon: <MaterialIcons name="timer" size={20} color="#10B981" />
        },
        {
            id: '2',
            name: 'Memory Usage',
            value: memoryUsage,
            unit: '%',
            status: memoryUsage > 80 ? 'critical' : memoryUsage > 60 ? 'warning' : 'good',
            icon: <MaterialIcons name="storage" size={20} color={memoryUsage > 80 ? "#EF4444" : memoryUsage > 60 ? "#F59E0B" : "#10B981"} />
        },
        {
            id: '3',
            name: 'Battery Level',
            value: batteryLevel,
            unit: '%',
            status: batteryLevel < 20 ? 'critical' : batteryLevel < 50 ? 'warning' : 'good',
            icon: <MaterialIcons name="battery-full" size={20} color={batteryLevel < 20 ? "#EF4444" : batteryLevel < 50 ? "#F59E0B" : "#10B981"} />
        },
        {
            id: '4',
            name: 'Network Speed',
            value: networkSpeed,
            unit: 'Mbps',
            status: networkSpeed < 1 ? 'critical' : networkSpeed < 5 ? 'warning' : 'good',
            icon: <MaterialIcons name="wifi" size={20} color={networkSpeed < 1 ? "#EF4444" : networkSpeed < 5 ? "#F59E0B" : "#10B981"} />
        }
    ];

    const mockCacheData: CacheItem[] = [
        {
            id: '1',
            name: 'Product Images',
            size: '245 MB',
            lastAccessed: '2 hours ago',
            type: 'image'
        },
        {
            id: '2',
            name: 'Product Data',
            size: '89 MB',
            lastAccessed: '1 day ago',
            type: 'data'
        },
        {
            id: '3',
            name: 'Search History',
            size: '12 MB',
            lastAccessed: '3 hours ago',
            type: 'data'
        },
        {
            id: '4',
            name: 'Temporary Files',
            size: '45 MB',
            lastAccessed: '1 week ago',
            type: 'temp'
        }
    ];

    const handleOptimizePerformance = useCallback(async () => {
        setIsOptimizing(true);
        setOptimizationResults([]);

        try {
            // Simulate optimization steps
            const steps = [
                'Clearing temporary files...',
                'Optimizing database...',
                'Compressing images...',
                'Cleaning cache...'
            ];

            for (const step of steps) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setOptimizationResults(prev => [...prev, step]);
            }

            await clearCache();
            await optimizeDatabase();

            Alert.alert(
                'Optimization Complete',
                'Performance has been optimized successfully!',
                [{ text: 'OK', onPress: () => { } }]
            );
        } catch {
            Alert.alert(
                'Optimization Failed',
                'An error occurred during optimization. Please try again.',
                [{ text: 'OK', onPress: () => { } }]
            );
        } finally {
            setIsOptimizing(false);
        }
    }, [clearCache, optimizeDatabase]);

    const handleClearCache = useCallback(async () => {
        Alert.alert(
            'Clear Cache',
            'This will remove all cached data. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        await clearCache();
                        Alert.alert('Success', 'Cache cleared successfully!');
                    }
                }
            ]
        );
    }, [clearCache]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'good': return '#10B981';
            case 'warning': return '#F59E0B';
            case 'critical': return '#EF4444';
            default: return '#6B7280';
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
                <Text className="text-xl font-bold text-gray-900">Performance</Text>
                <TouchableOpacity
                    onPress={handleOptimizePerformance}
                    disabled={isOptimizing}
                    className="flex-row items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg disabled:bg-gray-400"
                >
                    <MaterialIcons name="speed" size={20} color="white" />
                    <Text className="text-white font-medium">
                        {isOptimizing ? 'Optimizing...' : 'Optimize'}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
                <View className="p-4">
                    {/* Tab Navigation */}
                    <View className="flex-row mb-6 bg-white rounded-lg p-1">
                        {['overview', 'cache', 'network'].map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab as any)}
                                className={`flex-1 py-2 rounded-md ${activeTab === tab ? 'bg-blue-600' : 'bg-transparent'
                                    }`}
                            >
                                <Text className={`text-center font-medium capitalize ${activeTab === tab ? 'text-white' : 'text-gray-600'
                                    }`}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {activeTab === 'overview' && (
                        <View className="space-y-4">
                            <Text className="text-lg font-semibold text-gray-900 mb-4">
                                Performance Overview
                            </Text>

                            {performanceMetrics.map((metric) => (
                                <View key={metric.id} className="bg-white rounded-lg p-4 border border-gray-200">
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center gap-3">
                                            {metric.icon}
                                            <View>
                                                <Text className="font-medium text-gray-900">{metric.name}</Text>
                                                <Text className="text-sm text-gray-600">
                                                    {metric.action || 'System performance metric'}
                                                </Text>
                                            </View>
                                        </View>
                                        <View className="items-end">
                                            <Text className="text-2xl font-bold" style={{ color: getStatusColor(metric.status) }}>
                                                {metric.value}
                                                {metric.unit && <Text className="text-lg">{metric.unit}</Text>}
                                            </Text>
                                            <View className={`px-2 py-1 rounded-full ${metric.status === 'good' ? 'bg-green-100' :
                                                    metric.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                                                }`}>
                                                <Text className={`text-xs font-medium ${metric.status === 'good' ? 'text-green-800' :
                                                        metric.status === 'warning' ? 'text-yellow-800' : 'text-red-800'
                                                    }`}>
                                                    {metric.status.toUpperCase()}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}

                            {/* Optimization Results */}
                            {optimizationResults.length > 0 && (
                                <View className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <Text className="font-medium text-blue-900 mb-2">Optimization Progress:</Text>
                                    {optimizationResults.map((result, index) => (
                                        <View key={index} className="flex-row items-center gap-2 mb-1">
                                            <MaterialIcons name="checkmark-circle" size={16} color="#10B981" />
                                            <Text className="text-blue-800">{result}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}

                    {activeTab === 'cache' && (
                        <View className="space-y-4">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-lg font-semibold text-gray-900">Cache Management</Text>
                                <TouchableOpacity
                                    onPress={handleClearCache}
                                    className="flex-row items-center gap-2 bg-red-600 px-4 py-2 rounded-lg"
                                >
                                    <MaterialIcons name="trash" size={20} color="white" />
                                    <Text className="text-white font-medium">Clear Cache</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="bg-white rounded-lg border border-gray-200">
                                {mockCacheData.map((item) => (
                                    <View key={item.id} className="flex-row items-center justify-between p-4 border-b border-gray-100">
                                        <View className="flex-row items-center gap-3">
                                            <View className={`p-2 rounded-lg ${item.type === 'image' ? 'bg-blue-100' :
                                                    item.type === 'data' ? 'bg-green-100' : 'bg-gray-100'
                                                }`}>
                                                <MaterialIcons name={
                                                    item.type === 'image' ? 'image' :
                                                        item.type === 'data' ? 'folder' : 'folder-open'
                                                } size={20} color={
                                                    item.type === 'image' ? '#3B82F6' :
                                                        item.type === 'data' ? '#10B981' : '#6B7280'
                                                } />
                                            </View>
                                            <View>
                                                <Text className="font-medium text-gray-900">{item.name}</Text>
                                                <Text className="text-sm text-gray-600">Last accessed: {item.lastAccessed}</Text>
                                            </View>
                                        </View>
                                        <View className="items-end">
                                            <Text className="font-bold text-gray-900">{item.size}</Text>
                                            <TouchableOpacity className="mt-1">
                                                <MaterialIcons name="download" size={16} color="#6B7280" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {activeTab === 'network' && (
                        <View className="space-y-4">
                            <Text className="text-lg font-semibold text-gray-900 mb-4">Network Performance</Text>

                            <View className="bg-white rounded-lg p-4 border border-gray-200">
                                <View className="space-y-4">
                                    <View className="flex-row justify-between items-center">
                                        <Text className="font-medium text-gray-900">Connection Type</Text>
                                        <Text className="font-bold">WiFi</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center">
                                        <Text className="font-medium text-gray-900">Signal Strength</Text>
                                        <Text className="font-bold text-green-600">Excellent</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center">
                                        <Text className="font-medium text-gray-900">Data Usage Today</Text>
                                        <Text className="font-bold">45.2 MB</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center">
                                        <Text className="font-medium text-gray-900">Latency</Text>
                                        <Text className="font-bold text-green-600">23ms</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="bg-white rounded-lg p-4 border border-gray-200 mt-4">
                                <Text className="font-medium text-gray-900 mb-3">Connection History</Text>
                                <View className="space-y-3">
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-sm text-gray-600">WiFi - Home Network</Text>
                                        <Text className="text-sm font-medium">Connected</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-sm text-gray-600">Mobile Data</Text>
                                        <Text className="text-sm font-medium">Last used 2h ago</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-sm text-gray-600">Offline Mode</Text>
                                        <Text className="text-sm font-medium">Never</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
