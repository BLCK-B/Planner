import {expect, test} from "vitest";
import {parseItemData, stringifyItemData} from "@/functions/Parsing.ts";

const backendResponseTask = `{
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
const parsedResponseTask = JSON.parse(backendResponseTask);

const backendResponseTag = `{
    "tagID": "5965a261-c096-4276",
    "data": {
      "tagName": "Tag name",
      "color": "rgb(255, 255, 255)"
    }
}`
const parsedResponseTag = JSON.parse(backendResponseTag);

test('task data parsing', () => {
    const parsedTaskData = parseItemData(parsedResponseTask);

    expect(parsedTaskData.name).toEqual("Item name");
    expect(parsedTaskData.date).toEqual("2025-05-05");
    expect(parsedTaskData.tags).toEqual(["tagOne", "tagTwo"]);
});

test('tag data parsing', () => {
    const parsedTaskData = parseItemData(parsedResponseTag);

    expect(parsedTaskData.tagName).toEqual("Tag name");
    expect(parsedTaskData.color).toEqual("rgb(255, 255, 255)");
});

test('task data formatting', () => {
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

test('task data formatting - empty array', () => {
    const updatedTaskData = {
        data: {
            tags: [],
        }
    };

    expect(stringifyItemData(updatedTaskData)).toEqual({
        tags: [],
    });
});