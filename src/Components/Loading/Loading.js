import React from 'react';

const Loader = () => {
    const letters = [
        { char: 'E', delay: '0s' },
        { char: 'A', delay: '0.2s' },
        { char: 'S', delay: '0.4s' },
        { char: 'T', delay: '0.6s' },
        { char: 'E', delay: '0.8s' },
        { char: 'R', delay: '1s' },
        { char: 'N', delay: '1.2s' },
        { char: ' ', delay: '1.4s', isSpacer: true },
        { char: 'M', delay: '1.6s' },
        { char: 'I', delay: '1.8s' },
        { char: 'C', delay: '2s' },
        { char: 'H', delay: '2.2s' },
        { char: 'I', delay: '2.4s' },
        { char: 'G', delay: '2.6s' },
        { char: 'A', delay: '2.8s' },
        { char: 'N', delay: '3s' },
        { char: ' ', delay: '3.2s', isSpacer: true },
        { char: 'U', delay: '3.4s' },
        { char: 'N', delay: '3.6s' },
        { char: 'I', delay: '3.8s' },
        { char: 'V', delay: '4s' },
        { char: 'E', delay: '4.2s' },
        { char: 'R', delay: '4.4s' },
        { char: 'S', delay: '4.6s' },
        { char: 'I', delay: '4.8s' },
        { char: 'T', delay: '5s' },
        { char: 'Y', delay: '5.2s' },
    ];

    return (
        <div className='bg-white h-screen w-screen fixed top-0 left-0 flex items-center justify-center z-50'>
            <div className='flex items-center justify-center text-4xl md:text-6xl tracking-wide font-Saira font-semibold text-green-700'>
                {letters.map((letter, index) => (
                    <h1
                        key={index}
                        className={`letter ${letter.isSpacer ? 'mx-2' : ''}`}
                        style={{ animationDelay: letter.delay }}
                    >
                        {letter.char}
                    </h1>
                ))}
            </div>
        </div>
    );
};

export default Loader;
