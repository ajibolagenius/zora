import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Camera, X } from 'phosphor-react-native';
import { useProduct } from '../../hooks/useQueries';
import { useCreateReview } from '../../hooks/useQueries';

export default function WriteReviewScreen() {
  const router = useRouter();
  const { productId, vendorId, productName } = useLocalSearchParams<{
    productId?: string;
    vendorId?: string;
    productName?: string;
  }>();
  
  // Form state
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  
  // Get product details if available
  const { data: product } = useProduct(productId || '');
  
  // Review mutation
  const createReview = useCreateReview();
  
  // Character count
  const maxCommentLength = 500;
  const remainingChars = maxCommentLength - comment.length;
  
  // Validation
  const isValid = rating > 0 && title.trim().length >= 3 && comment.trim().length >= 10 && userName.trim().length >= 2;
  
  // Submit review
  const handleSubmit = async () => {
    if (!isValid) {
      Alert.alert('Incomplete Review', 'Please fill in all required fields.');
      return;
    }
    
    try {
      await createReview.mutateAsync({
        productId: productId || undefined,
        vendorId: vendorId || undefined,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        userName: userName.trim(),
      });
      
      Alert.alert(
        'Review Submitted!',
        'Thank you for sharing your feedback.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    }
  };
  
  // Rating labels
  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <View className="flex-1 bg-bg-dark">
      <SafeAreaView className="flex-1" edges={['top']}>
        <KeyboardAvoidingView 
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View className="flex-row items-center px-4 py-3 border-b border-card-dark">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-11 h-11 rounded-full bg-card-dark items-center justify-center"
            >
              <ArrowLeft size={24} color="#FFFFFF" weight="bold" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-text-primary text-lg font-bold mr-11">
              Write a Review
            </Text>
          </View>
          
          <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
            {/* Product Info (if available) */}
            {(product || productName) && (
              <View className="flex-row items-center bg-card-dark rounded-xl p-3 mt-4">
                {product?.image_urls?.[0] && (
                  <Image
                    source={{ uri: product.image_urls[0] }}
                    className="w-16 h-16 rounded-lg"
                    resizeMode="cover"
                  />
                )}
                <View className="flex-1 ml-3">
                  <Text className="text-text-primary font-semibold" numberOfLines={2}>
                    {product?.name || productName || 'Product'}
                  </Text>
                  {product?.category && (
                    <Text className="text-text-muted text-sm mt-1">{product.category}</Text>
                  )}
                </View>
              </View>
            )}
            
            {/* Rating Section */}
            <View className="mt-6">
              <Text className="text-text-primary text-base font-semibold mb-3">
                Your Rating <Text className="text-zora-red">*</Text>
              </Text>
              <View className="flex-row items-center justify-center gap-2 py-4 bg-card-dark rounded-xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                  >
                    <Star
                      size={40}
                      color={star <= rating ? '#FFCC00' : '#3D3D3D'}
                      weight={star <= rating ? 'fill' : 'regular'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {rating > 0 && (
                <Text className="text-center text-zora-yellow font-medium mt-2">
                  {ratingLabels[rating]}
                </Text>
              )}
            </View>
            
            {/* Your Name */}
            <View className="mt-6">
              <Text className="text-text-primary text-base font-semibold mb-2">
                Your Name <Text className="text-zora-red">*</Text>
              </Text>
              <TextInput
                className="bg-card-dark rounded-xl px-4 py-3 text-text-primary text-base"
                placeholder="Enter your name"
                placeholderTextColor="#CBA990"
                value={userName}
                onChangeText={setUserName}
                maxLength={50}
              />
            </View>
            
            {/* Review Title */}
            <View className="mt-6">
              <Text className="text-text-primary text-base font-semibold mb-2">
                Review Title <Text className="text-zora-red">*</Text>
              </Text>
              <TextInput
                className="bg-card-dark rounded-xl px-4 py-3 text-text-primary text-base"
                placeholder="Summarize your experience"
                placeholderTextColor="#CBA990"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>
            
            {/* Review Comment */}
            <View className="mt-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-text-primary text-base font-semibold">
                  Your Review <Text className="text-zora-red">*</Text>
                </Text>
                <Text className={`text-sm ${remainingChars < 50 ? 'text-zora-red' : 'text-text-muted'}`}>
                  {remainingChars} characters left
                </Text>
              </View>
              <TextInput
                className="bg-card-dark rounded-xl px-4 py-3 text-text-primary text-base min-h-[120px]"
                placeholder="Share details of your experience..."
                placeholderTextColor="#CBA990"
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={5}
                maxLength={maxCommentLength}
                textAlignVertical="top"
              />
            </View>
            
            {/* Guidelines */}
            <View className="mt-6 bg-card-dark rounded-xl p-4">
              <Text className="text-text-primary font-semibold mb-2">Review Guidelines</Text>
              <View className="gap-1">
                <Text className="text-text-muted text-sm">• Be honest and specific</Text>
                <Text className="text-text-muted text-sm">• Focus on product quality and experience</Text>
                <Text className="text-text-muted text-sm">• Avoid personal information</Text>
                <Text className="text-text-muted text-sm">• Keep it respectful and constructive</Text>
              </View>
            </View>
            
            <View style={{ height: 100 }} />
          </ScrollView>
          
          {/* Submit Button */}
          <View className="px-4 py-4 border-t border-card-dark">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!isValid || createReview.isPending}
              className={`rounded-full py-4 items-center ${
                isValid && !createReview.isPending ? 'bg-zora-red' : 'bg-card-dark'
              }`}
              activeOpacity={0.8}
            >
              <Text className={`text-base font-bold ${isValid ? 'text-white' : 'text-text-muted'}`}>
                {createReview.isPending ? 'Submitting...' : 'Submit Review'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
