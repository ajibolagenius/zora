import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize, FontFamily } from '../../constants';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  style?: any;
}

export function FilterChip({ label, selected, onPress, style }: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selected, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  text: {
    fontSize: FontSize.small,
    color: Colors.textPrimary,
    fontFamily: FontFamily.body,
  },
  selectedText: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.bodySemiBold,
  },
});
