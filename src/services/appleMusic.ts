/**
 * Apple Music API service — uses MusicKit JS (loaded from CDN in index.html)
 * and the iTunes Search API (no auth required) for catalog search.
 *
 * MusicKit playback requires an Apple Music developer token (JWT).
 * The REACT_APP_APPLE_MUSIC_DEVELOPER_TOKEN env var should hold that token.
 * Without it, catalog search still works but playback previews fall back to
 * the 30-second preview URLs returned by the iTunes Search API.
 */

export interface AppleMusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  artworkUrl: string;
  previewUrl: string | null;
  durationMs: number;
  appleMusicUrl: string;
}

export interface AppleMusicAlbum {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string;
  trackCount: number;
  year: string;
  appleMusicUrl: string;
}

const ITUNES_API = 'https://itunes.apple.com';

function artworkUrl(url: string, size = 300): string {
  return url.replace('{w}', String(size)).replace('{h}', String(size));
}

/** Search iTunes catalog — returns tracks */
export async function searchTracks(query: string, limit = 20): Promise<AppleMusicTrack[]> {
  if (!query.trim()) return [];
  const url = `${ITUNES_API}/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map((r: any) => ({
    id: String(r.trackId),
    title: r.trackName,
    artist: r.artistName,
    album: r.collectionName,
    artworkUrl: artworkUrl(r.artworkUrl100 || '', 300),
    previewUrl: r.previewUrl || null,
    durationMs: r.trackTimeMillis || 0,
    appleMusicUrl: r.trackViewUrl,
  }));
}

/** Search iTunes catalog — returns albums */
export async function searchAlbums(query: string, limit = 12): Promise<AppleMusicAlbum[]> {
  if (!query.trim()) return [];
  const url = `${ITUNES_API}/search?term=${encodeURIComponent(query)}&media=music&entity=album&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map((r: any) => ({
    id: String(r.collectionId),
    title: r.collectionName,
    artist: r.artistName,
    artworkUrl: artworkUrl(r.artworkUrl100 || '', 300),
    trackCount: r.trackCount || 0,
    year: r.releaseDate ? r.releaseDate.slice(0, 4) : '',
    appleMusicUrl: r.collectionViewUrl,
  }));
}

/** Get top tracks for an artist via iTunes lookup */
export async function getArtistTopTracks(artistId: string, limit = 10): Promise<AppleMusicTrack[]> {
  const url = `${ITUNES_API}/lookup?id=${artistId}&entity=song&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || [])
    .filter((r: any) => r.wrapperType === 'track')
    .map((r: any) => ({
      id: String(r.trackId),
      title: r.trackName,
      artist: r.artistName,
      album: r.collectionName,
      artworkUrl: artworkUrl(r.artworkUrl100 || '', 300),
      previewUrl: r.previewUrl || null,
      durationMs: r.trackTimeMillis || 0,
      appleMusicUrl: r.trackViewUrl,
    }));
}

/** Get new releases — top 20 US chart via RSS feed */
export async function getNewReleases(): Promise<AppleMusicAlbum[]> {
  const url =
    'https://itunes.apple.com/us/rss/topalbums/limit=20/json';
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const entries: any[] = data?.feed?.entry || [];
    return entries.map((e: any) => ({
      id: e.id?.attributes?.['im:id'] || '',
      title: e['im:name']?.label || '',
      artist: e['im:artist']?.label || '',
      artworkUrl: e['im:image']?.[2]?.label || '',
      trackCount: 0,
      year: e['im:releaseDate']?.label?.slice(0, 4) || '',
      appleMusicUrl: e?.link?.attributes?.href || '',
    }));
  } catch {
    return [];
  }
}

/** Get featured/editorial playlists — top 20 US chart songs */
export async function getTopSongs(): Promise<AppleMusicTrack[]> {
  const url = 'https://itunes.apple.com/us/rss/topsongs/limit=20/json';
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const entries: any[] = data?.feed?.entry || [];
    // Lookup full track data for the first 10 to get previewUrls
    const ids = entries.slice(0, 10).map((e: any) => e.id?.attributes?.['im:id']).filter(Boolean);
    if (ids.length === 0) return [];
    const lookupRes = await fetch(`${ITUNES_API}/lookup?id=${ids.join(',')}`);
    if (!lookupRes.ok) return [];
    const lookupData = await lookupRes.json();
    return (lookupData.results || [])
      .filter((r: any) => r.kind === 'song')
      .map((r: any) => ({
        id: String(r.trackId),
        title: r.trackName,
        artist: r.artistName,
        album: r.collectionName,
        artworkUrl: artworkUrl(r.artworkUrl100 || '', 300),
        previewUrl: r.previewUrl || null,
        durationMs: r.trackTimeMillis || 0,
        appleMusicUrl: r.trackViewUrl,
      }));
  } catch {
    return [];
  }
}
