import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { icons } from '@/constants/icons';
import { toggleReaction, getReviewWithReactions, type ReviewWithReactions } from '@/services/reviewReactionsService';
import { supabase } from '@/services/supabase';

interface ReviewReactionsProps {
  reviewId: string;
  isOwnReview?: boolean;
}

const ReviewReactions: React.FC<ReviewReactionsProps> = ({ reviewId, isOwnReview = false }) => {
  const [reactions, setReactions] = useState<ReviewWithReactions>({
    reviewId,
    likeCount: 0,
    helpfulCount: 0,
    userHasLiked: false,
    userHasMarkedHelpful: false,
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadReactions();
    checkAuth();
  }, [reviewId]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
  };

  const loadReactions = async () => {
    const data = await getReviewWithReactions(reviewId);
    setReactions(data);
  };

  const handleToggleReaction = async (type: 'like' | 'helpful') => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please log in to react to reviews');
      return;
    }

    if (isOwnReview) {
      Alert.alert('Not Allowed', 'You cannot react to your own review');
      return;
    }

    setLoading(true);
    const success = await toggleReaction(reviewId, type);
    
    if (success) {
      // Reload reactions to get updated counts
      await loadReactions();
    }
    
    setLoading(false);
  };

  return (
    <View className="flex-row items-center gap-4 mt-2">
      {/* Like Button */}
      <TouchableOpacity
        onPress={() => handleToggleReaction('like')}
        disabled={loading || isOwnReview}
        className={`flex-row items-center px-3 py-1.5 rounded-lg ${
          reactions.userHasLiked
            ? 'bg-accent/20 border border-accent'
            : 'bg-dark-100 border border-light-300/20'
        }`}
      >
        <Text className="text-lg mr-1.5">
          {reactions.userHasLiked ? '❤️' : '🤍'}
        </Text>
        <Text
          className={`text-xs font-semibold ${
            reactions.userHasLiked ? 'text-accent' : 'text-light-300'
          }`}
        >
          {reactions.likeCount > 0 ? reactions.likeCount : 'Like'}
        </Text>
      </TouchableOpacity>

      {/* Helpful Button */}
      <TouchableOpacity
        onPress={() => handleToggleReaction('helpful')}
        disabled={loading || isOwnReview}
        className={`flex-row items-center px-3 py-1.5 rounded-lg ${
          reactions.userHasMarkedHelpful
            ? 'bg-accent/20 border border-accent'
            : 'bg-dark-100 border border-light-300/20'
        }`}
      >
        <Text className="text-lg mr-1.5">👍</Text>
        <Text
          className={`text-xs font-semibold ${
            reactions.userHasMarkedHelpful ? 'text-accent' : 'text-light-300'
          }`}
        >
          {reactions.helpfulCount > 0 ? reactions.helpfulCount : 'Helpful'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReviewReactions;
