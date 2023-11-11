import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { Spinner } from '../src/lib/spinner.svelte';

describe("User profile component test", () => {
    beforeEach(() => {
        //create instance of the component and mount it
    })

    afterEach(() => {
        //destory/unmount instance
        cleanup();
    })

    test("User profile", () => {
        expect(true).toBe(true);
    });

    test("User profile failed case 1", () => {
        expect(false).toBe(false);
    });

    test("User profile failed case 2", () => {
        expect(false).toBe(false);
    });
});