import React from 'react';

interface SplitTextProps {
    /** Each entry renders on its own line. */
    lines: string[];
    /** Optional class per line. */
    lineClassName?: string;
    /** Rendered after the last character of the last line (e.g. an accent full stop). */
    suffix?: React.ReactNode;
    /** Delay between characters in ms. */
    stagger?: number;
}

// Per-character rise reveal. Must sit inside an element with `data-inview`
// (MotionEffects adds `is-inview` when it scrolls into view). The characters
// stay real text (words and line breaks keep their spaces), so crawlers and
// copy/paste see the plain sentence once.
export function SplitText({ lines, lineClassName = '', suffix, stagger = 28 }: SplitTextProps) {
    let index = 0;
    return (
        <span className="flex flex-col">
            {lines.map((line, li) => (
                <React.Fragment key={li}>
                    <span className={`motion-split-line ${lineClassName}`}>
                        {line.split(' ').map((word, wi, words) => (
                            <React.Fragment key={wi}>
                                <span className="motion-split-word">
                                    {Array.from(word).map((char, ci) => (
                                        <span
                                            key={ci}
                                            className="motion-split-char"
                                            style={{ animationDelay: `${index++ * stagger}ms` }}
                                        >
                                            {char}
                                        </span>
                                    ))}
                                    {li === lines.length - 1 && wi === words.length - 1 && suffix ? (
                                        <span className="motion-split-char" style={{ animationDelay: `${index++ * stagger}ms` }}>
                                            {suffix}
                                        </span>
                                    ) : null}
                                </span>
                                {wi < words.length - 1 ? ' ' : null}
                            </React.Fragment>
                        ))}
                    </span>
                    {li < lines.length - 1 ? ' ' : null}
                </React.Fragment>
            ))}
        </span>
    );
}
