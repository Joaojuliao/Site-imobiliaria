/**
 * useSheetCache — paginação server-side via Apps Script
 * Carrega apenas a página atual (24 itens), com cache por página no localStorage.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

const CACHE_PREFIX  = 'imobisheet_page_';
const CACHE_VERSION = 'v4';
const CACHE_TTL_MS  = 5 * 60 * 1000;
const PAGE_SIZE     = 24;

const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

// ── localStorage por página ───────────────────────────────────────

function readPageCache(page) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + page);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== CACHE_VERSION) return null;
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch { return null; }
}

function writePageCache(page, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + page, JSON.stringify({
      version: CACHE_VERSION,
      timestamp: Date.now(),
      data,
    }));
  } catch {}
}

// ── Fetch JSONP de uma página ────────────────────────────────────

function fetchPage(page) {
  return new Promise((resolve, reject) => {
    if (!API_URL) { reject(new Error('VITE_APPS_SCRIPT_URL não configurada.')); return; }

    const cbName   = `__imobiPageCb_${page}_${Date.now()}`;
    const scriptId = `imobi-page-script-${page}`;

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('Timeout ao carregar imóveis.'));
    }, 15000);

    function cleanup() {
      clearTimeout(timer);
      delete window[cbName];
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    }

    window[cbName] = function(data) {
      cleanup();
      if (data.ok) {
        resolve(data);
      } else {
        reject(new Error(data.error || 'Erro ao carregar imóveis.'));
      }
    };

    // Remove script anterior da mesma página se existir
    const old = document.getElementById(scriptId);
    if (old) old.remove();

    const s = document.createElement('script');
    s.id  = scriptId;
    s.src = `${API_URL}?action=properties&page=${page}&limit=${PAGE_SIZE}&callback=${cbName}&t=${Date.now()}`;
    s.onerror = () => { cleanup(); reject(new Error('Falha ao conectar com o Apps Script.')); };
    document.head.appendChild(s);
  });
}

// ── Hook principal ────────────────────────────────────────────────

/**
 * @returns {{
 *   properties, loading, revalidating, error,
 *   page, totalPages, total,
 *   goToPage, refresh
 * }}
 */
export function useSheetCache() {
  const [properties, setProperties]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [revalidating, setRevalidating] = useState(false);
  const [error, setError]               = useState(null);
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [total, setTotal]               = useState(0);
  const mountedRef = useRef(true);

  const loadPage = useCallback(async (targetPage, { silent = false } = {}) => {
    if (silent) setRevalidating(true);
    else        setLoading(true);
    setError(null);

    // Tenta cache primeiro
    const cached = readPageCache(targetPage);
    if (cached && !silent) {
      setProperties(cached.properties);
      setTotalPages(cached.totalPages);
      setTotal(cached.total);
      setLoading(false);
      // Revalida em background
      fetchPage(targetPage).then(data => {
        if (!mountedRef.current) return;
        setProperties(data.properties);
        setTotalPages(data.totalPages);
        setTotal(data.total);
        writePageCache(targetPage, data);
      }).catch(() => {}).finally(() => {
        if (mountedRef.current) setRevalidating(false);
      });
      return;
    }

    try {
      const data = await fetchPage(targetPage);
      if (!mountedRef.current) return;
      setProperties(data.properties);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      writePageCache(targetPage, data);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err.message);
    } finally {
      if (!mountedRef.current) return;
      setLoading(false);
      setRevalidating(false);
    }
  }, []);

  // Carrega quando a página muda
  useEffect(() => {
    mountedRef.current = true;
    loadPage(page);
    return () => { mountedRef.current = false; };
  }, [page, loadPage]);

  const goToPage = useCallback((newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const refresh = useCallback(() => {
    // Limpa cache da página atual
    try { localStorage.removeItem(CACHE_PREFIX + page); } catch {}
    loadPage(page);
  }, [page, loadPage]);

  return {
    properties,
    loading,
    revalidating,
    error,
    page,
    totalPages,
    total,
    goToPage,
    refresh,
  };
}