import {expect, test, vi} from "vitest";
import {getPendingInitiatives} from "@/functions/Reusable.ts";
import type {InitiativeType} from "@/types/InitiativeType.ts";
import type {InitiativeRecordType} from "@/types/InitiativeRecordType.ts";

const records: InitiativeRecordType[] = [
    {
        data: {
            recordID: 'r1',
            date: '2026-01-10',
            rating: 1,
            comment: 'comment'
        }
    },
]

const initiatives: InitiativeType[] = [
    {
        itemID: '1',
        data: {
            name: "name",
            remindDays: 3,
            records: records
        }
    }
]

test('getPendingInitiatives', () => {
    expect(getPendingInitiatives(undefined)).toEqual([])

    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-10T00:00:00Z'))

    expect(getPendingInitiatives(initiatives)).toEqual([])

    vi.setSystemTime(new Date('2026-01-13T00:00:00Z'))

    expect(getPendingInitiatives(initiatives)).toStrictEqual(initiatives)

    initiatives[0].data.remindDays = 0;
    expect(getPendingInitiatives(initiatives)).toEqual([])
})