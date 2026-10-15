import { ApiError, getApiBaseUrl } from './client';

export async function uploadImageApi(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('file', file);
  try {
    const response = await fetch(`${getApiBaseUrl()}/media`, { method: 'POST', body: form });
    let body;
    try { body = await response.json(); }
    catch { throw new ApiError('INVALID_RESPONSE', 'El servidor devolvió una respuesta inválida al subir la imagen.', response.status); }
    if (!response.ok || body?.success === false) {
      throw new ApiError(body?.error?.code || `HTTP_${response.status}`, body?.error?.message || 'No se pudo subir la imagen.', response.status);
    }
    if (body?.success !== true || typeof body?.data?.url !== 'string' || !/^\/dev\/api\/uploads\/images\/img-[a-f0-9]{48}\.(jpg|png|webp)$/.test(body.data.url)) {
      throw new ApiError('INVALID_RESPONSE', 'El servidor no devolvió una ruta de imagen válida.', response.status);
    }
    return { url: body.data.url };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('NETWORK_ERROR', 'No se pudo conectar para subir la imagen. Intente nuevamente.', 0);
  }
}
