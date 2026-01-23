import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { Region } from '../../types';

interface RegionCardProps {
  region: Region;
  onPress?: () => void;
  selected?: boolean;
}

export const RegionCard: React.FC<RegionCardProps> = ({
  region,
  onPress,
  selected = false,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.imageWrapper, selected && styles.imageWrapperSelected]}>
        <Image
          source={{ uri: region.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <Text style={[styles.name, selected && styles.nameSelected]} numberOfLines={1}>
        {region.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 80,
  },
  imageWrapper: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: Spacing.sm,
  },
  imageWrapperSelected: {
    borderColor: Colors.primary,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.cardDark,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
  },
  nameSelected: {
    color: Colors.primary,
  },
});

export default RegionCard;
