import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { Spinner } from '../src/lib/spinner.svelte';

describe("Chat component test", () => {
    beforeEach(() => {
        //create instance of the component and mount it
    })

    afterEach(() => {
        //destory/unmount instance
        cleanup();
    })

    test("Chat component", () => {
        expect(true).toBe(true);
    });
});