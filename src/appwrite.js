import { Client, Databases, Query, ID } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const ENDPOINT_ID = import.meta.env.VITE_APPWRITE_ENDPOINT;

console.log(PROJECT_ID,DATABASE_ID,COLLECTION_ID,ENDPOINT_ID);
const client = new Client()
                .setEndpoint(ENDPOINT_ID)
                .setProject(PROJECT_ID)

const database = new Databases(client);

export const updateSearchCount = async (searchTerm,movie) => {
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('movie_id', movie.id)
        ]);
        
        if(result.documents.length > 0) {
            // Movie exists, update the count
            const doc = result.documents[0];

            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            });
        } else {
            // Movie does not exist, create a new document
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                title: movie.title,
            });
        }
    }
    catch(error){
        console.error('Error updating search count:', error);
    }
}

export const getTrendingMovies = async () => {
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count')
        ]);

        return result.documents;
    } catch(error) {
        console.error('Error fetching trending movies:', error);
        return [];
    }
}