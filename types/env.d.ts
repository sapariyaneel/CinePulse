declare module '@env' {
    export const MOVIE_API_KEY: string;
    export const APPWRITE_PROJECT_ID: string;
    export const APPWRITE_DATABASE_ID: string;
    export const APPWRITE_COLLECTION_ID: string;
    export const SUPABASE_PROJECT_URL: string;
    export const SUPABASE_API_KEY: string;
    export const SUPABASE_URI: string;
}

// Image file declarations
declare module '*.jpg' {
    const value: any;
    export default value;
}

declare module '*.jpeg' {
    const value: any;
    export default value;
}

declare module '*.png' {
    const value: any;
    export default value;
}

declare module '*.gif' {
    const value: any;
    export default value;
}

declare module '*.svg' {
    const value: any;
    export default value;
}

declare module '*.webp' {
    const value: any;
    export default value;
}
