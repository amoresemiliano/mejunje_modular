<?php
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/media-validation.php';
if (strtoupper($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST, OPTIONS');
    sendError('METHOD_NOT_ALLOWED', 'Use POST para subir imágenes.', 405);
}
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > MEDIA_MAX_BYTES + 65536) sendError('FILE_TOO_LARGE', 'La imagen supera el máximo de 8 MB.', 413);
$file = $_FILES['file'] ?? null;
if (!is_array($file) || !isset($file['error']) || is_array($file['error'])) sendError('VALIDATION_ERROR', 'Seleccione una imagen para subir.', 400);
if (in_array($file['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)) sendError('FILE_TOO_LARGE', 'La imagen supera el límite de carga del servidor (máximo 8 MB).', 413);
if ($file['error'] !== UPLOAD_ERR_OK) sendError('UPLOAD_ERROR', 'No se pudo recibir la imagen. Intente nuevamente.', 400);
if (!isset($file['tmp_name']) || !is_string($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) sendError('VALIDATION_ERROR', 'El archivo recibido no es una carga válida.', 400);
try {
    $extension = validateImageFile($file['tmp_name'], (int)$file['size']);
    $filename = mediaFilename($extension);
    // Only fixed, local directories beneath this API. Never follow upload symlinks.
    $uploads = __DIR__ . '/uploads';
    $directory = $uploads . '/images';
    foreach ([$uploads, $directory] as $dir) {
        if (is_link($dir)) throw new RuntimeException('Unsafe upload directory.');
        if (!is_dir($dir) && !mkdir($dir, 0755)) throw new RuntimeException('Cannot create upload directory.');
    }
    if (realpath($directory) !== realpath(__DIR__) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'images') throw new RuntimeException('Unsafe upload path.');
    $target = $directory . '/' . $filename;
    if (file_exists($target) || !move_uploaded_file($file['tmp_name'], $target)) throw new RuntimeException('Cannot store upload.');
    if (!chmod($target, 0644)) { unlink($target); throw new RuntimeException('Cannot set file permissions.'); }
    sendSuccess(['url'=>mediaPublicUrl($filename)], 201);
} catch (InvalidArgumentException $e) {
    sendError('VALIDATION_ERROR', $e->getMessage(), 400);
} catch (Throwable $e) {
    error_log('Media upload: ' . $e->getMessage());
    sendError('UPLOAD_ERROR', 'No se pudo guardar la imagen. Intente nuevamente.', 500);
}
