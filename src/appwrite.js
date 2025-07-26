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
    //1.use appwrite sdk to check the search term exists in database


    //4.if it does,increment the count by 1


    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm)
        ]);
        //2.if it does,update the content
        if(result.documents.length > 0) {
            // Search term exists, update the count
            const doc = result.documents[0];

            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            });
        //3.if it doesn't,create a new document with the search term and count 1
        } else {
            // Search term does not exist, create a new document
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
        }
        console.log('Sending data to Appwrite:', searchTerm, movie);
        console.log('Result:', result);
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
        ])

        console.log(result);
        return result.documents;
    } catch(error) {
        console.error(error);
    }
 
}