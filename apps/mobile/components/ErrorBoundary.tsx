import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    public resetError = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Text style={{ fontSize: 64 }}>⚠️</Text>
                        <Text style={styles.title}>Oops! Something went wrong.</Text>
                        <Text style={styles.subtitle}>
                            We encountered an error while rendering this screen.
                        </Text>

                        <ScrollView style={styles.errorContainer}>
                            <Text style={styles.errorText}>
                                {this.state.error && this.state.error.toString()}
                            </Text>
                            {this.state.errorInfo && (
                                <Text style={styles.stackTrace}>
                                    {this.state.errorInfo.componentStack}
                                </Text>
                            )}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={this.resetError}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundDark,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    content: {
        width: '100%',
        alignItems: 'center',
        gap: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginTop: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textMuted,
        textAlign: 'center',
        marginBottom: 16,
    },
    errorContainer: {
        width: '100%',
        maxHeight: 200,
        backgroundColor: Colors.cardDark,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    errorText: {
        fontSize: 14,
        color: Colors.error,
        marginBottom: 8,
        fontFamily: 'monospace',
    },
    stackTrace: {
        fontSize: 12,
        color: Colors.textMuted,
        fontFamily: 'monospace',
    },
    button: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    buttonText: {
        color: Colors.textPrimary,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
