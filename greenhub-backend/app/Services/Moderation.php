<?php

namespace App\Services;

class ModerationService
{
    public function isClean($content)
    {
        $bannedWords = config('moderation.banned_keywords');

        // 1. Check for Banned Words
        foreach ($bannedWords as $word) {
            $pattern = "/\b" . preg_quote($word, '/') . "\b/i";
            if (preg_match($pattern, $content)) {
                return false;
            }
        }

        // 2. Check for Links if enabled
        if (config('moderation.block_all_links')) {
            if (preg_match('/https?:\/\/\S+/', $content)) {
                return false;
            }
        }

        return true;
    }
}
