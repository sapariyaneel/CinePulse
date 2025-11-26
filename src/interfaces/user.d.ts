interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarId: number;
  createdAt: string;
  savedMovies: number[];
  reviewCount: number;
}

interface SavedMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  savedAt: string;
}

interface MovieReview {
  id: string;
  movieId: number;
  movieTitle: string;
  moviePoster: string;
  userId: string;
  username: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

type WatchStatus = 'want_to_watch' | 'watching' | 'completed';

interface WatchlistCategory {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  itemCount?: number;
}

interface WatchlistItem {
  id: string;
  userId: string;
  categoryId: string;
  movieId: number;
  title: string;
  posterPath: string;
  voteAverage: number;
  releaseDate: string;
  watchStatus: WatchStatus;
  watchProgress: number;
  notes?: string;
  addedAt: string;
  watchedAt?: string;
  category?: WatchlistCategory;
}
