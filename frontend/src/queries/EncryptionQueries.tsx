import FetchRequest from "@/functions/FetchRequest.tsx";

const fetchEncryptionPhrase = async (): Promise<string> => {
    return await FetchRequest("GET", "/auth/encryptionPhrase");
};

export const loadEncryptionPhraseQuery = () => ({
    queryKey: ['encryptionPhrase'],
    queryFn: fetchEncryptionPhrase,
});