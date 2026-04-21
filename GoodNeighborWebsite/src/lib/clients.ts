import { query } from '@/lib/db';

export type ClientNameRow = {
  ClientID: number;
  FullName: string;
  Suffix: string | null;
  DateOfBirth: string | null;
  EntryDate: string | null;
  MaidenName: string | null;
  FirstName: string | null;
  MiddleName: string | null;
  LastName: string | null;
  FullAddress: string;
  County: string | null;
  CellPhone1: string;
  CellPhone2: string;
  Email: string;
};

const CLIENTS_CACHE_TTL_MS = 60_000;

type CachedClientPage = {
  data: ClientNameRow[];
  hasMore: boolean;
  nextOffset: number;
  expiresAt: number;
};

const clientsCache = new Map<string, CachedClientPage>();

export type GetClientNamesOptions = {
  limit?: number;
  offset?: number;
  search?: string;
};

export async function getClientNames(options: GetClientNamesOptions = {}) {
  const limit = Math.min(Math.max(options.limit ?? 100, 1), 100);
  const offset = Math.max(options.offset ?? 0, 0);
  const search = (options.search ?? '').trim();
  const cacheKey = JSON.stringify({ limit, offset, search });
  const cached = clientsCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return {
      data: cached.data,
      hasMore: cached.hasMore,
      nextOffset: cached.nextOffset,
      cacheStatus: 'HIT' as const,
    };
  }

  const queryLimit = limit + 1;
  const searchTerm = `%${search}%`;
  const limitClause = `LIMIT ${queryLimit} OFFSET ${offset}`;
  const sql = search
    ? `
        SELECT
          c.ClientID,
          TRIM(CONCAT(
            c.FirstName, ' ',
            IFNULL(c.MiddleName, ''), ' ',
            c.LastName,
            IF(c.MaidenName IS NOT NULL AND c.MaidenName != '', CONCAT(' (', c.MaidenName, ')'), '')
          )) AS FullName,
          c.Suffix,
          DATE_FORMAT(c.DateOfBirth, '%m/%d/%Y') AS DateOfBirth,
          DATE_FORMAT(c.EntryDate, '%m/%d/%Y') AS EntryDate,
          c.MaidenName,
          c.FirstName,
          c.MiddleName,
          c.LastName,
          IFNULL(
            TRIM(CONCAT(
              h.StreetAddress,
              IF(h.StreetApartmentNumber IS NOT NULL AND h.StreetApartmentNumber != '', CONCAT(', Apt ', h.StreetApartmentNumber), ''),
              ', ', h.City, ', ', h.State, ' ', h.PostalCode
            )),
            'Not available'
          ) AS FullAddress,
          h.County,
          IFNULL(c.cell_phone, 'Not available') AS CellPhone1,
          IFNULL(c.home_phone, 'Not available') AS CellPhone2,
          IFNULL(c.email, 'Not available') AS Email
        FROM client AS c
        LEFT JOIN household AS h ON c.HouseholdID = h.HouseholdID
        WHERE c.FirstName LIKE ?
          OR c.MiddleName LIKE ?
          OR c.LastName LIKE ?
          OR CAST(c.ClientID AS CHAR) LIKE ?
        ORDER BY c.LastName ASC, c.FirstName ASC, c.ClientID ASC
        ${limitClause}
      `
    : `
        SELECT
          c.ClientID,
          TRIM(CONCAT(
            c.FirstName, ' ',
            IFNULL(c.MiddleName, ''), ' ',
            c.LastName,
            IF(c.MaidenName IS NOT NULL AND c.MaidenName != '', CONCAT(' (', c.MaidenName, ')'), '')
          )) AS FullName,
          c.Suffix,
          DATE_FORMAT(c.DateOfBirth, '%m/%d/%Y') AS DateOfBirth,
          DATE_FORMAT(c.EntryDate, '%m/%d/%Y') AS EntryDate,
          c.MaidenName,
          c.FirstName,
          c.MiddleName,
          c.LastName,
          IFNULL(
            TRIM(CONCAT(
              h.StreetAddress,
              IF(h.StreetApartmentNumber IS NOT NULL AND h.StreetApartmentNumber != '', CONCAT(', Apt ', h.StreetApartmentNumber), ''),
              ', ', h.City, ', ', h.State, ' ', h.PostalCode
            )),
            'Not available'
          ) AS FullAddress,
          h.County,
          IFNULL(c.cell_phone, 'Not available') AS CellPhone1,
          IFNULL(c.home_phone, 'Not available') AS CellPhone2,
          IFNULL(c.email, 'Not available') AS Email
        FROM client AS c
        LEFT JOIN household AS h ON c.HouseholdID = h.HouseholdID
        ORDER BY c.LastName ASC, c.FirstName ASC, c.ClientID ASC
        ${limitClause}
      `;

  const data = (await query(
    sql,
    search ? [searchTerm, searchTerm, searchTerm, searchTerm] : undefined
  )) as ClientNameRow[];

  const hasMore = data.length > limit;
  const rows = hasMore ? data.slice(0, limit) : data;
  const nextOffset = offset + rows.length;

  clientsCache.set(cacheKey, {
    data: rows,
    hasMore,
    nextOffset,
    expiresAt: Date.now() + CLIENTS_CACHE_TTL_MS,
  });

  return {
    data: rows,
    hasMore,
    nextOffset,
    cacheStatus: 'MISS' as const,
  };
}
