import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  onFocus?: () => void;
  onSubmit?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search for egusi, plantain, jollof...',
  onFilterPress,
  onFocus,
  onSubmit,
}) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="magnify" size={22} color={Colors.textMuted} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        onFocus={onFocus}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
      />
      {onFilterPress && (
        <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
          <MaterialCommunityIcons name="tune-vertical" size={22} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    height: 48,
  },
  input: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontFamily: FontFamily.body,
    color: Colors.textPrimary,
    fontSize: FontSize.body,
  },
  filterButton: {
    padding: Spacing.xs,
  },
});

export default SearchBar;
