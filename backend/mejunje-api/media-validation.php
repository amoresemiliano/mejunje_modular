<?php
const MEDIA_MAX_BYTES = 8 * 1024 * 1024;
function validateImageFile(string $path, int $size): string {
    if ($size <= 0 || $size > MEDIA_MAX_BYTES || filesize($path) > MEDIA_MAX_BYTES) throw new InvalidArgumentException('La imagen debe pesar entre 1 byte y 8 MB.');
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($path);
    $extensions = ['image/jpeg'=>'jpg', 'image/png'=>'png', 'image/webp'=>'webp'];
    if (!isset($extensions[$mime])) throw new InvalidArgumentException('Solo se permiten imágenes JPEG, PNG o WebP.');
    $info = @getimagesize($path);
    if (!$info || ($info['mime'] ?? '') !== $mime) throw new InvalidArgumentException('El contenido no es una imagen válida.');
    // Reject common executable/polyglot payloads; originals are never executable in uploads.
    $content = file_get_contents($path);
    if ($content === false || preg_match('/<\?(?:php|=|\s)|<script\b|<svg\b/i', $content)) throw new InvalidArgumentException('La imagen contiene contenido no permitido.');
    return $extensions[$mime];
}
function mediaFilename(string $extension): string {
    if (!in_array($extension, ['jpg','png','webp'], true)) throw new InvalidArgumentException('Formato no permitido.');
    return 'img-' . bin2hex(random_bytes(24)) . '.' . $extension;
}
function mediaPublicUrl(string $filename): string {
    return '/dev/api/uploads/images/' . $filename;
}
