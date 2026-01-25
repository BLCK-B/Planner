import {describe, expect, vi, beforeEach, test} from "vitest";
import FetchRequest, {decryptBody, encryptBody} from "@/functions/FetchRequest";
import {encrypt, decrypt} from "@/functions/Crypto";

global.fetch = vi.fn() as any;

const task = {
    itemID: "123",
    data: {
        date: "2020-05-01",
    }
};

const nestedTask = {
    itemID: "123",
    data: {
        date: "2020-05-01",
        tags: {
            tag1: {
                tagID: "12",
                data: {
                    tagName: "tag1",
                },
            },
            tag2: {
                tagID: "34",
                data: {
                    tagName: "tag2",
                },
            },
        },
    },
};

vi.mock("@/functions/Crypto", () => ({
    encrypt: vi.fn((x) => Promise.resolve({...x, encrypted: true})),
    decrypt: vi.fn((x) => Promise.resolve({...x, decrypted: true})),
}));

describe("FetchRequest", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (fetch as any).mockReset();
        (fetch as any).mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve(JSON.stringify({data: "resp"})),
        });
    });

    test("doesnt encrypt not-encryptable body", async () => {
        const body = {name: "itemName", date: "2025-01-01"};

        const result = await encryptBody(body);

        expect(encrypt).not.toHaveBeenCalled();
        expect(result).toStrictEqual(body);
    });

    test("doesnt decrypt not-decryptable body", async () => {
        const body = {name: "itemName", date: "2025-01-01"};

        const result = await decryptBody(body);

        expect(decrypt).not.toHaveBeenCalled();
        expect(result).toStrictEqual(body);
    });

    test("encrypts encryptable body", async () => {
        const result = await encryptBody(task);

        expect(encrypt).toHaveBeenCalledWith(task);
        expect(result).toStrictEqual({...task, encrypted: true});
    });

    test("encrypts encryptable body and nested objects", async () => {
        const result = await encryptBody(nestedTask);

        expect(encrypt).toHaveBeenCalledTimes(3);
        expect(result.data.tags).toEqual({
            tag1: {tagID: '12', data: {tagName: 'tag1'}, encrypted: true},
            tag2: {tagID: '34', data: {tagName: 'tag2'}, encrypted: true}
        });
    })

    test("decrypts decryptable body", async () => {
        const result = await decryptBody(task);

        expect(decrypt).toHaveBeenCalledWith(task);
        expect(result).toEqual({...task, decrypted: true});
    });

    test("decrypts decryptable body and nested objects", async () => {
        const result = await decryptBody(nestedTask);

        expect(decrypt).toHaveBeenCalledTimes(3);
        expect(result.data.tags).toEqual({
            tag1: {tagID: '12', data: {tagName: 'tag1'}, decrypted: true},
            tag2: {tagID: '34', data: {tagName: 'tag2'}, decrypted: true}
        });
    })
    
    test("throws FetchError on error response", async () => {
        (fetch as any).mockReset();
        (fetch as any).mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: "Server Error",
            json: async () => ({message: "Server Error"}),
        });

        await expect(FetchRequest("GET", "/fail")).rejects.toThrow("Server Error");
    });

    test("returns responseText if JSON parsing fails", async () => {
        (fetch as any).mockReset();
        (fetch as any).mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve("A string"),
        });

        const result = await FetchRequest("GET", "/text");
        expect(result).toBe("A string");
    });
});
