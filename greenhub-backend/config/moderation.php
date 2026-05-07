<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Banned Words & Patterns
    |--------------------------------------------------------------------------
    */
    'banned_keywords' => [
        // 1. Common Profanity & Hate Speech
    'shit', 'fuck', 'bitch', 'asshole', // Use real words in your code

    // 2. Spam & Scam Keywords
    'crypto profit', 'free bitcoin', 'cash prize', 'win money', 'click here',
    'whatsapp me', 'telegram me', 'investment opportunity', 'make money fast',

    // 3. Illegal & Dangerous Content
    'hack', 'crack', 'warez', 'nude', 'porn', 'drug', 'weapon', 'buy illegal',
    ],

    'block_all_links' => true, // Toggle this to true to block any http/https
];
