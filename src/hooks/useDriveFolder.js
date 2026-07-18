/**
 * useDriveFolder — busca fotos de uma pasta do Drive via Apps Script
 * Mesmo padrão JSONP do exemplo: action=photos&folder=FOLDER_ID
 */

import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

const folderCache = new Map();

function fetchPhotosJSONP(folderId) {
  return new Promise((resolve, reject) => {
    if (!API_URL) { reject(new Error('VITE_APPS_SCRIPT_URL não configurada.')); return; }
    if (!folderId) { resolve([]); return; }

    if (folderCache.has(folderId)) {
      resolve(folderCache.get(folderId));
      return;
    }

    const cbName   = `__imobiPhotosCb_${folderId.replace(/\W/g, '_')}`;
    const scriptId = `imobi-photos-${folderId}`;

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('Timeout ao carregar fotos.'));
    }, 10000);

    function cleanup() {
      clearTimeout(timer);
      delete window[cbName];
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    }

    window[cbName] = function(data) {
      cleanup();
      if (data.ok && Array.isArray(data.photos)) {
        const urls = data.photos.map(id =>
          `https://drive.google.com/thumbnail?id=${id}&sz=w1200`
        );
        folderCache.set(folderId, urls);
        resolve(urls);
      } else {
        reject(new Error(data.error || 'Erro ao carregar fotos.'));
      }
    };

    const s = document.createElement('script');
    s.id    = scriptId;
    s.src   = `${API_URL}?action=photos&folder=${encodeURIComponent(folderId)}&callback=${cbName}`;
    s.onerror = () => { cleanup(); reject(new Error('Falha ao conectar.')); };
    document.head.appendChild(s);
  });
}

export function useDriveFolder(folderId) {
  const [images, setImages]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!folderId) { setImages([]); return; }

    if (folderCache.has(folderId)) {
      setImages(folderCache.get(folderId));
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPhotosJSONP(folderId)
      .then(urls => { if (!cancelled) setImages(urls); })
      .catch(err  => { if (!cancelled) setError(err.message); })
      .finally(()  => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [folderId]);

  return { images, loading, error };
}