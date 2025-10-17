import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { copyTextToClipboard } from '../src/utils.js';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('copyTextToClipboard', () => {
    let mockClipboard;
    let copyBtn;
    let consoleErrorSpy;

    beforeEach(() => {
        // Create a button element for testing
        copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';

        // Mock navigator.clipboard
        mockClipboard = {
            writeText: vi.fn()
        };
        Object.defineProperty(navigator, 'clipboard', {
            value: mockClipboard,
            writable: true,
            configurable: true
        });

        // Spy on console.error
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        // Use fake timers
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    describe('successful copy', () => {
        it('should call navigator.clipboard.writeText with correct text', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);

            copyTextToClipboard('test text', copyBtn, 'Copy');

            expect(mockClipboard.writeText).toHaveBeenCalledWith('test text');
            expect(mockClipboard.writeText).toHaveBeenCalledTimes(1);
        });

        it('should change button text to "Copied!" on success', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);

            copyTextToClipboard('test text', copyBtn, 'Copy');

            // Wait for promise to resolve
            await vi.waitFor(() => {
                expect(copyBtn.textContent).toBe('Copied!');
            });
        });

        it('should restore original button text after 2000ms', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);
            copyBtn.textContent = 'Copy to Clipboard';

            copyTextToClipboard('test text', copyBtn, 'Copy to Clipboard');

            // Wait for promise to resolve
            await vi.waitFor(() => {
                expect(copyBtn.textContent).toBe('Copied!');
            });

            // Fast-forward time by 2000ms
            vi.advanceTimersByTime(2000);

            expect(copyBtn.textContent).toBe('Copy to Clipboard');
        });

        it('should not restore button text before 2000ms', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);

            copyTextToClipboard('test text', copyBtn, 'Copy');

            await vi.waitFor(() => {
                expect(copyBtn.textContent).toBe('Copied!');
            });

            // Fast-forward time by 1000ms (halfway through timeout)
            vi.advanceTimersByTime(1000);

            expect(copyBtn.textContent).toBe('Copied!');
            
            // Advance another 500ms (still before 2000ms)
            vi.advanceTimersByTime(500);
            
            expect(copyBtn.textContent).toBe('Copied!');
        });

        it('should handle empty string text', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);

            copyTextToClipboard('', copyBtn, 'Copy');

            expect(mockClipboard.writeText).toHaveBeenCalledWith('');

            await vi.waitFor(() => {
                expect(copyBtn.textContent).toBe('Copied!');
            });
        });

        it('should handle multi-line text', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);
            const multiLineText = 'Line 1\nLine 2\nLine 3';

            copyTextToClipboard(multiLineText, copyBtn, 'Copy');

            expect(mockClipboard.writeText).toHaveBeenCalledWith(multiLineText);
        });

        it('should handle text with special characters', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);
            const specialText = '<div class="test">Hello & "World"</div>';

            copyTextToClipboard(specialText, copyBtn, 'Copy');

            expect(mockClipboard.writeText).toHaveBeenCalledWith(specialText);
        });

        it('should handle very long text', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);
            const longText = 'a'.repeat(10000);

            copyTextToClipboard(longText, copyBtn, 'Copy');

            expect(mockClipboard.writeText).toHaveBeenCalledWith(longText);
        });

        it('should handle different original text values', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);
            const originalTexts = ['Copy', 'Copy Code', 'Copy to Clipboard', '📋 Copy'];

            for (const originalText of originalTexts) {
                copyBtn.textContent = originalText;
                copyTextToClipboard('test', copyBtn, originalText);

                await vi.waitFor(() => {
                    expect(copyBtn.textContent).toBe('Copied!');
                });

                vi.advanceTimersByTime(2000);
                expect(copyBtn.textContent).toBe(originalText);
                
                vi.clearAllTimers();
            }
        });
    });

    describe('failed copy', () => {
        it('should call console.error when clipboard write fails', async () => {
            const error = new Error('Clipboard write failed');
            mockClipboard.writeText.mockRejectedValue(error);

            copyTextToClipboard('test text', copyBtn, 'Copy');

            await vi.waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy text: ', error);
            });
        });

        it('should not change button text on failure', async () => {
            mockClipboard.writeText.mockRejectedValue(new Error('Failed'));
            copyBtn.textContent = 'Copy';

            copyTextToClipboard('test text', copyBtn, 'Copy');

            await vi.waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalled();
            });

            // Button text should remain unchanged
            expect(copyBtn.textContent).toBe('Copy');
        });

        it('should handle permission denied error', async () => {
            const permissionError = new DOMException('Permission denied', 'NotAllowedError');
            mockClipboard.writeText.mockRejectedValue(permissionError);

            copyTextToClipboard('test text', copyBtn, 'Copy');

            await vi.waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy text: ', permissionError);
            });
        });

        it('should handle clipboard not available error', async () => {
            const error = new Error('Clipboard API not available');
            mockClipboard.writeText.mockRejectedValue(error);

            copyTextToClipboard('test text', copyBtn, 'Copy');

            await vi.waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy text: ', error);
            });
        });
    });

    describe('button element validation', () => {
        it('should work with button element', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);
            const button = document.createElement('button');
            button.textContent = 'Copy';

            copyTextToClipboard('test', button, 'Copy');

            await vi.waitFor(() => {
                expect(button.textContent).toBe('Copied!');
            });
        });

        it('should work with span element', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);
            const span = document.createElement('span');
            span.textContent = 'Copy';

            copyTextToClipboard('test', span, 'Copy');

            await vi.waitFor(() => {
                expect(span.textContent).toBe('Copied!');
            });
        });

        it('should work with div element', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);
            const div = document.createElement('div');
            div.textContent = 'Copy';

            copyTextToClipboard('test', div, 'Copy');

            await vi.waitFor(() => {
                expect(div.textContent).toBe('Copied!');
            });
        });

        it('should work with anchor element', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);
            const anchor = document.createElement('a');
            anchor.textContent = 'Copy';

            copyTextToClipboard('test', anchor, 'Copy');

            await vi.waitFor(() => {
                expect(anchor.textContent).toBe('Copied!');
            });
        });
    });

    describe('multiple rapid calls', () => {
        it('should handle multiple calls in sequence', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);

            // First call
            copyTextToClipboard('text1', copyBtn, 'Copy');
            await vi.waitFor(() => {
                expect(copyBtn.textContent).toBe('Copied!');
            });

            // Second call before timeout completes
            vi.advanceTimersByTime(1000);
            copyTextToClipboard('text2', copyBtn, 'Copy');
            
            await vi.waitFor(() => {
                expect(copyBtn.textContent).toBe('Copied!');
            });

            expect(mockClipboard.writeText).toHaveBeenCalledTimes(2);
            expect(mockClipboard.writeText).toHaveBeenNthCalledWith(1, 'text1');
            expect(mockClipboard.writeText).toHaveBeenNthCalledWith(2, 'text2');
        });

        it('should handle overlapping timeouts correctly', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);

            // First call
            copyTextToClipboard('text1', copyBtn, 'Original');
            await vi.waitFor(() => {
                expect(copyBtn.textContent).toBe('Copied!');
            });

            // Second call after 500ms
            vi.advanceTimersByTime(500);
            copyTextToClipboard('text2', copyBtn, 'Original');

            // Advance time to complete all timeouts
            vi.advanceTimersByTime(2500);

            // Final text should be 'Original' from the last call's timeout
            expect(copyBtn.textContent).toBe('Original');
        });
    });

    describe('edge cases', () => {
        it('should handle null text gracefully', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);

            copyTextToClipboard(null, copyBtn, 'Copy');

            expect(mockClipboard.writeText).toHaveBeenCalledWith(null);
        });

        it('should handle undefined text gracefully', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);

            copyTextToClipboard(undefined, copyBtn, 'Copy');

            expect(mockClipboard.writeText).toHaveBeenCalledWith(undefined);
        });

        it('should handle numeric text', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);

            copyTextToClipboard(12345, copyBtn, 'Copy');

            expect(mockClipboard.writeText).toHaveBeenCalledWith(12345);
        });

        it('should handle object text', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);
            const obj = { key: 'value' };

            copyTextToClipboard(obj, copyBtn, 'Copy');

            expect(mockClipboard.writeText).toHaveBeenCalledWith(obj);
        });

        it('should handle empty originalText', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);

            copyTextToClipboard('test', copyBtn, '');

            await vi.waitFor(() => {
                expect(copyBtn.textContent).toBe('Copied!');
            });

            vi.advanceTimersByTime(2000);

            expect(copyBtn.textContent).toBe('');
        });

        it('should handle originalText with emojis', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);

            copyTextToClipboard('test', copyBtn, '📋 Copy');

            await vi.waitFor(() => {
                expect(copyBtn.textContent).toBe('Copied!');
            });

            vi.advanceTimersByTime(2000);

            expect(copyBtn.textContent).toBe('📋 Copy');
        });
    });

    describe('timer behavior', () => {
        it('should set exactly one timeout per call', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);

            copyTextToClipboard('test', copyBtn, 'Copy');

            await vi.waitFor(() => {
                expect(copyBtn.textContent).toBe('Copied!');
            });

            // Check that there's exactly one pending timer
            const timerCount = vi.getTimerCount();
            expect(timerCount).toBe(1);
        });

        it('should clear timeout after execution', async () => {
            mockClipboard.writeText.mockResolvedValue(undefined);

            copyTextToClipboard('test', copyBtn, 'Copy');

            await vi.waitFor(() => {
                expect(copyBtn.textContent).toBe('Copied!');
            });

            vi.advanceTimersByTime(2000);

            // All timers should be cleared
            expect(vi.getTimerCount()).toBe(0);
        });
    });
});