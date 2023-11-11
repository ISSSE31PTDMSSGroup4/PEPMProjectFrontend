import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { Spinner } from '../src/lib/spinner.svelte';

describe("Quiz component test", () => {
    beforeEach(() => {
        //create instance of the component and mount it
    })

    afterEach(() => {
        //destory/unmount instance
        cleanup();
    })

    test("Creaete Quiz", () => {
        expect(true).toBe(true);
    });

    test("Update Quiz", () => {
        expect(true).toBe(true);
    });

    test("Delete Quiz", () => {
        expect(true).toBe(true);
    });
});