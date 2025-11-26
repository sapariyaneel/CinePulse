import { APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, APPWRITE_PROJECT_ID } from '@env';
import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = APPWRITE_DATABASE_ID!;
const COLLECTION_ID = APPWRITE_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(APPWRITE_PROJECT_ID!);

const database = new Databases(client); 

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error: any) {
    // Handle archived project gracefully - don't throw error
    if (error?.message?.includes('archived')) {
      console.warn('Appwrite project is archived. Search tracking disabled.');
      return;
    }
    console.error("Error updating search count:", error);
    // Don't throw error to prevent app crashes
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error: any) {
    // Handle archived project gracefully
    if (error?.message?.includes('archived')) {
      console.warn('Appwrite project is archived. Trending movies feature disabled.');
      return [];
    }
    console.error('Error fetching trending movies:', error);
    return [];
  }
};
