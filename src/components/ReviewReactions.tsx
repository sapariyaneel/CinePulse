import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { icons } from '@/constants/icons';
import { Heart, ThumbsUp } from 'lucide-react-native';
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

  const checkAuth = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
  }, []);

  const loadReactions = useCallback(async () => {
    const data = await getReviewWithReactions(reviewId);
    setReactions(data);
  }, [reviewId]);

  useEffect(() => {
    loadReactions();
    checkAuth();
  }, [loadReactions, checkAuth]);

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
        <Text className="mr-1.5">
          {reactions.userHasLiked ? (
            <Heart size={20} color="#ef4444" fill="#ef4444" />
          ) : (
            <Heart size={20} color="#9ca3af" />
          )}
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
        <ThumbsUp size={20} color={reactions.userHasMarkedHelpful ? "#AB8BFF" : "#9ca3af"} style={{ marginRight: 6 }} />
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
