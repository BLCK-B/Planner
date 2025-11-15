import {expect, test} from "vitest";
import {parseItemData, stringifyItemData} from "@/functions/Parsing.ts";

const backendResponse = `{
  "itemID": "505e8e19-9a30-4d49",
  "data": {
    "itemType": "Task",
    "name": "Item name",
    "date": "2025-05-05",
    "tags": "[\\"tagOne\\",\\"tagTwo\\"]",
    "completed": "",
    "repeatEvent": null,
    "repeatOriginDay": 0,
    "planID": null
  }
}`;
const parsedResponse = JSON.parse(backendResponse);

test('data parsing', () => {
    const parsedTaskData = parseItemData(parsedResponse);

    expect(parsedTaskData.name).toEqual("Item name");
    expect(parsedTaskData.date).toEqual("2025-05-05");
    expect(parsedTaskData.tags).toEqual(["tagOne", "tagTwo"]);
});

test('data formatting', () => {
    const updatedTaskData = {
        data: {
            itemType: "Task",
            name: "Item name",
            date: "2025-05-05",
            tags: ["tagOne", "tagTwo"],
            completed: "",
            repeatEvent: "",
            repeatOriginDay: 0,
            planID: "",
        }
    };

    expect(stringifyItemData(updatedTaskData)).toEqual({
        itemType: "Task",
        name: "Item name",
        date: "2025-05-05",
        tags: '["tagOne","tagTwo"]',
        completed: "",
        repeatEvent: "",
        repeatOriginDay: 0,
        planID: "",
    });
});