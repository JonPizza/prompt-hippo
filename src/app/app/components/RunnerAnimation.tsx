import React, { useState, useEffect } from 'react';

const RunnerAnimation: React.FC = () => {
    const [currentEmoji, setCurrentEmoji] = useState('🏃'); // Initial emoji is a runner
    const emojis = ['🏃', '🚴', '⛵']; // Array of emojis to cycle through

    useEffect(() => {
        const interval = setInterval(() => {
            // Get the index of the next emoji in the array
            const currentIndex = emojis.indexOf(currentEmoji);
            const nextIndex = (currentIndex + 1) % emojis.length;

            // Update the current emoji
            setCurrentEmoji(emojis[nextIndex]);
        }, 500); // 0.5 seconds

        return () => {
            clearInterval(interval); // Clean up the interval on component unmount
        };
    }, [currentEmoji]);

    return <span>{currentEmoji}</span>;
};

export default RunnerAnimation;