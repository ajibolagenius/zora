import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendUp, TrendDown, Minus } from 'phosphor-react-native';
import { Colors, Spacing, BorderRadius, FontSize, FontFamily } from '../../constants';

interface MetricCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: string;
}

export function MetricCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = Colors.textPrimary,
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendUp size={16} color={Colors.success} />;
      case 'down':
        return <TrendDown size={16} color={Colors.error} />;
      default:
        return <Minus size={16} color={Colors.textMuted} />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return Colors.success;
      case 'down':
        return Colors.error;
      default:
        return Colors.textMuted;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon && <View style={styles.icon}>{icon}</View>}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        
        {trend && trendValue && (
          <View style={styles.trend}>
            {getTrendIcon()}
            <Text style={[styles.trendValue, { color: getTrendColor() }]}>
              {trendValue}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.small,
    color: Colors.textMuted,
    fontFamily: FontFamily.body,
  },
  icon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: FontSize.h2,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    fontFamily: FontFamily.displayBold,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  trendValue: {
    fontSize: FontSize.small,
    fontFamily: FontFamily.bodySemiBold,
    marginLeft: Spacing.xs,
  },
});
