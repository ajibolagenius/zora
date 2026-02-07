import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useSearchPerformance } from '../../hooks/useAdvancedSearch';
import { TrendingUp, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export function SearchPerformance() {
  const { metrics } = useSearchPerformance();

  const getPerformanceStatus = (avgTime: number) => {
    if (avgTime < 200) return { status: 'excellent', color: 'bg-green-500', text: 'Excellent' };
    if (avgTime < 500) return { status: 'good', color: 'bg-yellow-500', text: 'Good' };
    if (avgTime < 1000) return { status: 'fair', color: 'bg-orange-500', text: 'Fair' };
    return { status: 'poor', color: 'bg-red-500', text: 'Poor' };
  };

  const getErrorRateStatus = (errorRate: number) => {
    if (errorRate < 5) return { status: 'excellent', color: 'bg-green-500', text: 'Excellent' };
    if (errorRate < 10) return { status: 'good', color: 'bg-yellow-500', text: 'Good' };
    if (errorRate < 20) return { status: 'fair', color: 'bg-orange-500', text: 'Fair' };
    return { status: 'poor', color: 'bg-red-500', text: 'Poor' };
  };

  const performanceStatus = getPerformanceStatus(metrics.averageSearchTime);
  const errorRateStatus = getErrorRateStatus(metrics.errorRate);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Search Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Average Search Time */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Average Search Time</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">
                {metrics.averageSearchTime.toFixed(0)}ms
              </span>
              <Badge className={`${performanceStatus.color} text-white`}>
                {performanceStatus.text}
              </Badge>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${performanceStatus.color}`}
              style={{ width: `${Math.min(100, (metrics.averageSearchTime / 1000) * 100)}%` }}
            />
          </div>
        </div>

        {/* Total Searches */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Total Searches</span>
          </div>
          <span className="text-lg font-bold">{metrics.totalSearches}</span>
        </div>

        {/* Success Rate */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Successful Searches</span>
          </div>
          <span className="text-lg font-bold">{metrics.successfulSearches}</span>
        </div>

        {/* Error Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Error Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{metrics.errorRate.toFixed(1)}%</span>
              <Badge className={`${errorRateStatus.color} text-white`}>
                {errorRateStatus.text}
              </Badge>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${errorRateStatus.color}`}
              style={{ width: `${Math.min(100, metrics.errorRate)}%` }}
            />
          </div>
        </div>

        {/* Performance Insights */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Performance Insights</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            {metrics.averageSearchTime < 200 && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Excellent search performance - users are getting fast results</span>
              </div>
            )}
            {metrics.averageSearchTime > 1000 && (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3 w-3 text-red-500" />
                <span>Consider optimizing search algorithms for better performance</span>
              </div>
            )}
            {metrics.errorRate < 5 && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Low error rate - search system is reliable</span>
              </div>
            )}
            {metrics.errorRate > 20 && (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3 w-3 text-red-500" />
                <span>High error rate - investigate search failures</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
