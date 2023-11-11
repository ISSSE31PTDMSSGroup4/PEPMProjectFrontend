import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { Spinner } from '../src/lib/spinner.svelte';

describe("Spinner component test", () => {
    beforeEach(() => {
        //create instance of the component and mount it
    })

    afterEach(() => {
        //destory/unmount instance
        cleanup();
    })

    test("Spinner component", () => {
        expect(true).toBe(true);
    });
});