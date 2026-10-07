<?php
/**
 * MEJUNJE Backoffice API - Response Envelope & HTTP Helpers
 */

if (!function_exists('sendSuccess')) {
    /**
     * Send a successful JSON response envelope.
     *
     * @param mixed $data
     * @param int $statusCode
     * @return void
     */
    function sendSuccess($data = null, int $statusCode = 200): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => true,
            'data'    => $data
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}

if (!function_exists('sendError')) {
    /**
     * Send a standardized error JSON response envelope.
     *
     * @param string $code
     * @param string $message
     * @param int $statusCode
     * @return void
     */
    function sendError(string $code, string $message, int $statusCode = 400): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false,
            'error'   => [
                'code'    => $code,
                'message' => $message
            ]
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}

if (!function_exists('getRequestJson')) {
    /**
     * Decode incoming JSON payload from request body safely.
     *
     * @return array
     */
    function getRequestJson(): array {
        $raw = file_get_contents('php://input');
        if ($raw === false || trim($raw) === '') {
            return [];
        }

        $decoded = json_decode($raw, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            sendError('INVALID_JSON', 'Malformed JSON payload: ' . json_last_error_msg(), 400);
        }

        return is_array($decoded) ? $decoded : [];
    }
}
