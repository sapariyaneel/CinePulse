import { supabase } from './supabase';

export type ReactionType = 'like' | 'helpful';

export interface ReviewReaction {
  id: string;
  reviewId: string;
  userId: string;
  reactionType: ReactionType;
  createdAt: string;
}

export interface ReviewReactionCounts {
  reviewId: string;
  likeCount: number;
  helpfulCount: number;
  totalReactions: number;
}

export interface ReviewWithReactions {
  reviewId: string;
  likeCount: number;
  helpfulCount: number;
  userHasLiked: boolean;
  userHasMarkedHelpful: boolean;
}

// Add a reaction to a review
export const addReaction = async (
  reviewId: string,
  reactionType: ReactionType
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('review_reactions')
      .insert({
        review_id: reviewId,
        user_id: user.id,
        reaction_type: reactionType,
      });

    if (error) {
      // If it's a duplicate, ignore
      if (error.code === '23505') {
        return true;
      }
      console.error('Error adding reaction:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error adding reaction:', error);
    return false;
  }
};

// Remove a reaction from a review
export const removeReaction = async (
  reviewId: string,
  reactionType: ReactionType
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('review_reactions')
      .delete()
      .eq('review_id', reviewId)
      .eq('user_id', user.id)
      .eq('reaction_type', reactionType);

    if (error) {
      console.error('Error removing reaction:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error removing reaction:', error);
    return false;
  }
};

// Toggle a reaction (add if not exists, remove if exists)
export const toggleReaction = async (
  reviewId: string,
  reactionType: ReactionType
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if reaction exists
    const { data: existing } = await supabase
      .from('review_reactions')
      .select('id')
      .eq('review_id', reviewId)
      .eq('user_id', user.id)
      .eq('reaction_type', reactionType)
      .single();

    if (existing) {
      // Remove reaction
      return await removeReaction(reviewId, reactionType);
    } else {
      // Add reaction
      return await addReaction(reviewId, reactionType);
    }
  } catch (error) {
    console.error('Error toggling reaction:', error);
    return false;
  }
};

// Get reaction counts for a review
export const getReactionCounts = async (reviewId: string): Promise<ReviewReactionCounts> => {
  try {
    const { data, error } = await supabase
      .from('review_reaction_counts')
      .select('*')
      .eq('review_id', reviewId)
      .single();

    if (error || !data) {
      return {
        reviewId,
        likeCount: 0,
        helpfulCount: 0,
        totalReactions: 0,
      };
    }

    return {
      reviewId: data.review_id,
      likeCount: data.like_count || 0,
      helpfulCount: data.helpful_count || 0,
      totalReactions: data.total_reactions || 0,
    };
  } catch (error) {
    console.error('Error getting reaction counts:', error);
    return {
      reviewId,
      likeCount: 0,
      helpfulCount: 0,
      totalReactions: 0,
    };
  }
};

// Get user's reactions for a review
export const getUserReactionsForReview = async (
  reviewId: string
): Promise<{ hasLiked: boolean; hasMarkedHelpful: boolean }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { hasLiked: false, hasMarkedHelpful: false };
    }

    const { data, error } = await supabase
      .from('review_reactions')
      .select('reaction_type')
      .eq('review_id', reviewId)
      .eq('user_id', user.id);

    if (error || !data) {
      return { hasLiked: false, hasMarkedHelpful: false };
    }

    const hasLiked = data.some(r => r.reaction_type === 'like');
    const hasMarkedHelpful = data.some(r => r.reaction_type === 'helpful');

    return { hasLiked, hasMarkedHelpful };
  } catch (error) {
    console.error('Error getting user reactions:', error);
    return { hasLiked: false, hasMarkedHelpful: false };
  }
};

// Get review with all reaction data
export const getReviewWithReactions = async (reviewId: string): Promise<ReviewWithReactions> => {
  try {
    const [counts, userReactions] = await Promise.all([
      getReactionCounts(reviewId),
      getUserReactionsForReview(reviewId),
    ]);

    return {
      reviewId,
      likeCount: counts.likeCount,
      helpfulCount: counts.helpfulCount,
      userHasLiked: userReactions.hasLiked,
      userHasMarkedHelpful: userReactions.hasMarkedHelpful,
    };
  } catch (error) {
    console.error('Error getting review with reactions:', error);
    return {
      reviewId,
      likeCount: 0,
      helpfulCount: 0,
      userHasLiked: false,
      userHasMarkedHelpful: false,
    };
  }
};

// Get reaction counts for multiple reviews
export const getReactionCountsForReviews = async (
  reviewIds: string[]
): Promise<Map<string, ReviewReactionCounts>> => {
  try {
    const { data, error } = await supabase
      .from('review_reaction_counts')
      .select('*')
      .in('review_id', reviewIds);

    if (error || !data) {
      return new Map();
    }

    const countsMap = new Map<string, ReviewReactionCounts>();
    data.forEach(item => {
      countsMap.set(item.review_id, {
        reviewId: item.review_id,
        likeCount: item.like_count || 0,
        helpfulCount: item.helpful_count || 0,
        totalReactions: item.total_reactions || 0,
      });
    });

    // Fill in missing reviews with zero counts
    reviewIds.forEach(id => {
      if (!countsMap.has(id)) {
        countsMap.set(id, {
          reviewId: id,
          likeCount: 0,
          helpfulCount: 0,
          totalReactions: 0,
        });
      }
    });

    return countsMap;
  } catch (error) {
    console.error('Error getting reaction counts for reviews:', error);
    return new Map();
  }
};
