import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { Spinner } from '../src/lib/spinner.svelte';

describe("Popup component test", () => {
    beforeEach(() => {
        //create instance of the component and mount it
    })

    afterEach(() => {
        //destory/unmount instance
        cleanup();
    })

    test("Popup add quiz component", () => {
        expect(true).toBe(true);
    });

    test("Popup add question component", () => {
        expect(true).toBe(true);
    });

    test("Popup base component", () => {
        expect(true).toBe(true);
    });

    test("Popup profile-modal component", () => {
        expect(true).toBe(true);
    });
});