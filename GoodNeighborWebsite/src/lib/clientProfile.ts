import { query } from '@/lib/db';

type NullableDate = Date | string | null;

export type ClientProfileMember = {
  clientId: number;
  fullName: string;
  ageLabel: string;
  isDeceased: boolean;
  deceasedDate: string | null;
  dateOfBirth: string | null;
  eligibilityDate: string | null;
};

export type ClientDetailField = {
  group: string;
  label: string;
  value: string;
};

export type ClientAlertRecord = {
  alertId: number;
  alertDate: string;
  alertDescription: string;
  agentFullName: string;
};

export type ClientNoShowRecord = {
  noShowId: number;
  noShowDate: string;
  description: string;
  agentFullName: string;
};

export type ClientVisitRecord = {
  visitId: number;
  visitDate: string;
  description: string;
  agentName: string;
  status: string;
};

export type ClientIndirectVisitRecord = {
  indirectVisitId: number;
  beneficiaryName: string;
  mainRecipient: string;
  visitDate: string;
  agentName: string;
  status: string;
  address: string;
};

export type ClientAssistanceRecord = {
  assistanceId: number;
  amount: string;
  assistanceNote: string;
  dateGranted: string;
  countsTowardEligibility: boolean;
  description: string;
  agentFullName: string;
  categoryName: string;
  fundingSourceName: string;
};

export type ClientIndirectAssistanceRecord = {
  indirectAssistanceId: number;
  clientId: number;
  clientFullName: string;
  assistanceId: number;
  assistanceCategory: string;
  amount: string;
  dateGranted: string;
  address: string;
  mainRecipient: string;
};

export type ClientRelative = {
  relatedClientId: number | null;
  relatedName: string;
  description: string;
  ageLabel: string;
  isDeceased: boolean;
};

export type ClientRelativesGroup = {
  clientId: number;
  memberName: string;
  memberExtraInfo: string;
  relatives: ClientRelative[];
};

export type ClientProfileDashboard = {
  client: {
    clientId: number;
    fullName: string;
    displayName: string;
    nickname: string | null;
    maidenName: string | null;
    suffix: string | null;
    dateOfBirth: string | null;
    entryDate: string | null;
    email: string;
    cellPhone1: string;
    cellPhone2: string;
    fullAddress: string;
    county: string;
    householdId: number | null;
    isDeceased: boolean;
    deceasedDate: string | null;
    isOnHold: boolean;
    onHoldReason: string;
    eligibilityDate: string | null;
    agentFullName: string;
  };
  status: {
    isDeceased: boolean;
    deceasedDate: string | null;
    dateOfBirth: string | null;
    isOnHold: boolean;
    onHoldReason: string;
    householdId: number | null;
  };
  counts: {
    householdMembers: string;
    householdMemberCount: number;
    relativeCount: number;
    assistanceCount: number;
    indirectAssistanceCount: number;
    visitCount: number;
    indirectVisitCount: number;
    totalAssistance: string;
  };
  eligibility: {
    lastAssistedPerson: string;
    lastAssistanceAmount: number;
    totalAssistances: number;
    lastAssistanceDate: string | null;
    assistancesLimit: number;
    message: string;
    progress: number;
    color: 'green' | 'orange' | 'red' | 'gray';
    nextEligibilityDate: string | null;
  };
  recent: {
    alertDate: string | null;
    alertDescription: string;
    hasAlert: boolean;
    noShowDate: string | null;
    noShowDescription: string;
    noShowAgentName: string;
    hasNoShow: boolean;
    visitDate: string | null;
    visitDescription: string;
    visitAgentName: string;
    hasVisit: boolean;
    assistanceName: string;
    assistanceAmount: string;
    assistanceDescription: string;
    hasAssistance: boolean;
    noteAgentName: string;
    noteDescription: string;
    hasNote: boolean;
    fileEntryDate: string | null;
    fileAgentFullName: string;
    fileMessage: string;
  };
  assessments: {
    hasAssessment: boolean;
    items: string[];
  };
  household: {
    members: ClientProfileMember[];
    livingWith: ClientProfileMember[];
    relatives: ClientRelativesGroup[];
  };
  details: ClientDetailField[];
  records: {
    alerts: ClientAlertRecord[];
    noShows: ClientNoShowRecord[];
    visits: ClientVisitRecord[];
    indirectVisits: ClientIndirectVisitRecord[];
    assistances: ClientAssistanceRecord[];
    indirectAssistances: ClientIndirectAssistanceRecord[];
  };
};

type ClientRow = {
  [key: string]: any;
  ClientID: number;
  FirstName: string | null;
  MiddleName: string | null;
  LastName: string | null;
  Suffix: string | null;
  Nickname: string | null;
  MaidenName: string | null;
  EntryDate: Date | string | null;
  DateOfBirth: Date | string | null;
  cell_phone: string | null;
  home_phone: string | null;
  email: string | null;
  HouseholdID: number | null;
  StreetAddress: string | null;
  StreetApartmentNumber: string | null;
  City: string | null;
  State: string | null;
  PostalCode: string | null;
  County: string | null;
  IsDeceased: number | boolean | null;
  DeceasedDate: Date | string | null;
  OnHold: number | boolean | null;
  OnHoldReasonText: string | null;
  EligibilityDate: Date | string | null;
  AgentFullName?: string | null;
};

type HouseholdMemberRow = {
  ClientID: number;
  FirstName: string | null;
  MiddleName: string | null;
  LastName: string | null;
  DateOfBirth: Date | string | null;
  IsDeceased: number | boolean | null;
  DeceasedDate: Date | string | null;
  EligibilityDate: Date | string | null;
};

type RelativeRow = {
  RelatedClientID: number | null;
  Description: string | null;
  FirstName: string | null;
  MiddleName: string | null;
  LastName: string | null;
  DateOfBirth: Date | string | null;
  IsDeceased: number | boolean | null;
};

function isPresent(value: unknown) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

function textOrFallback(value: unknown, fallback = 'Not available') {
  return isPresent(value) ? String(value).trim() : fallback;
}

function boolFromDb(value: unknown) {
  return value === true || value === 1 || value === '1';
}

function money(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number.isFinite(value) ? value : 0);
}

function formatDate(value: NullableDate) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatDateShort(value: NullableDate) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
}

function calculateAge(dateOfBirth: NullableDate) {
  if (!dateOfBirth) {
    return 'Age Unknown';
  }

  const dob = dateOfBirth instanceof Date ? dateOfBirth : new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) {
    return 'Age Unknown';
  }

  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }

  return `Age ${age}`;
}

function buildFullName(row: Pick<ClientRow, 'FirstName' | 'MiddleName' | 'LastName' | 'Suffix'>) {
  return [row.FirstName, row.MiddleName, row.LastName, row.Suffix]
    .map((part) => (isPresent(part) ? String(part).trim() : ''))
    .filter(Boolean)
    .join(' ')
    .trim();
}

function buildDisplayName(row: Pick<ClientRow, 'FirstName' | 'MiddleName' | 'LastName' | 'Suffix' | 'Nickname' | 'MaidenName'>) {
  const fullName = buildFullName(row);

  if (isPresent(row.MaidenName)) {
    return `${fullName} (Maiden: ${String(row.MaidenName).trim()})`;
  }

  if (isPresent(row.Nickname)) {
    return `${fullName} (Nickname: ${String(row.Nickname).trim()})`;
  }

  return fullName;
}

function buildAddress(row: Pick<ClientRow, 'StreetAddress' | 'StreetApartmentNumber' | 'City' | 'State' | 'PostalCode' | 'County'>) {
  const addressParts: string[] = [];

  if (isPresent(row.StreetAddress)) {
    addressParts.push(String(row.StreetAddress).trim());
  }

  if (isPresent(row.StreetApartmentNumber)) {
    addressParts.push(`Apt ${String(row.StreetApartmentNumber).trim()}`);
  }

  if (isPresent(row.City)) {
    addressParts.push(String(row.City).trim());
  }

  if (isPresent(row.State)) {
    addressParts.push(String(row.State).trim());
  }

  if (isPresent(row.PostalCode)) {
    addressParts.push(String(row.PostalCode).trim());
  }

  if (isPresent(row.County)) {
    addressParts.push(String(row.County).trim());
  }

  return addressParts.length > 0 ? addressParts.join(', ') : 'Not available';
}

async function queryRows<T>(sql: string, values: any[] = []) {
  return (await query(sql, values)) as T[];
}

async function querySingle<T>(sql: string, values: any[] = []) {
  const rows = await queryRows<T>(sql, values);
  return rows[0] ?? null;
}

async function getHouseholdMembers(householdId: number) {
  const members = await queryRows<HouseholdMemberRow>(
    `
      SELECT ClientID, FirstName, MiddleName, LastName, DateOfBirth, IsDeceased, DeceasedDate, EligibilityDate
      FROM client
      WHERE HouseholdID = ?
      ORDER BY FirstName ASC, LastName ASC, ClientID ASC
    `,
    [householdId]
  );

  return members.map((member) => {
    const fullName = buildFullName(member);
    return {
      clientId: member.ClientID,
      fullName: fullName || 'Not available',
      ageLabel: calculateAge(member.DateOfBirth),
      isDeceased: boolFromDb(member.IsDeceased),
      deceasedDate: formatDateShort(member.DeceasedDate),
      dateOfBirth: formatDateShort(member.DateOfBirth),
      eligibilityDate: formatDateShort(member.EligibilityDate),
    };
  });
}

async function getHouseholdRelatives(members: { clientId: number; fullName: string; ageLabel: string; isDeceased: boolean }[]) {
  const groups = await Promise.all(
    members.map(async (member) => {
      const relatives = await queryRows<RelativeRow>(
        `
          SELECT
            r.RelatedClientID,
            r.Description,
            c.FirstName,
            c.MiddleName,
            c.LastName,
            c.DateOfBirth,
            c.IsDeceased
          FROM relative r
          LEFT JOIN client c ON r.RelatedClientID = c.ClientID
          WHERE r.ClientID = ?
        `,
        [member.clientId]
      );

      return {
        clientId: member.clientId,
        memberName: member.fullName,
        memberExtraInfo: member.ageLabel,
        relatives: relatives.map((relative) => {
          const relatedName = buildFullName(relative);
          return {
            relatedClientId: relative.RelatedClientID,
            relatedName: relatedName || 'Unknown relative',
            description: textOrFallback(relative.Description, 'Unknown relationship'),
            ageLabel: calculateAge(relative.DateOfBirth),
            isDeceased: boolFromDb(relative.IsDeceased),
          };
        }),
      } satisfies ClientRelativesGroup;
    })
  );

  return groups;
}

async function getRecentAlertInfo(clientId: number) {
  const row = await querySingle<{ AlertDate: Date | string | null; AlertDescription: string | null }>(
    `
      SELECT AlertDate, AlertDescription
      FROM alerts
      WHERE ClientID = ?
      ORDER BY AlertDate DESC
      LIMIT 1
    `,
    [clientId]
  );

  return {
    alertDate: row ? formatDate(row.AlertDate) : null,
    alertDescription: textOrFallback(row?.AlertDescription, 'No alert description available.'),
    hasAlert: Boolean(row),
  };
}

async function getRecentNoShowInfo(clientId: number) {
  const row = await querySingle<{
    NoShowDate: Date | string | null;
    Description: string | null;
    AgentFullName: string | null;
  }>(
    `
      SELECT
        ns.NoShowDate,
        ns.Description,
        CONCAT(a.FirstName, ' ', a.LastName) AS AgentFullName
      FROM noshows ns
      INNER JOIN agent a ON ns.AgentID = a.AgentID
      WHERE ns.ClientID = ?
      ORDER BY ns.NoShowDate DESC
      LIMIT 1
    `,
    [clientId]
  );

  return {
    noShowDate: row ? formatDate(row.NoShowDate) : null,
    noShowDescription: textOrFallback(row?.Description, 'No no-show description available.'),
    noShowAgentName: textOrFallback(row?.AgentFullName, 'Not available'),
    hasNoShow: Boolean(row),
  };
}

async function getRecentVisitInfo(clientId: number) {
  const row = await querySingle<{
    VisitDate: Date | string | null;
    Description: string | null;
    AgentName: string | null;
  }>(
    `
      SELECT
        VisitDate,
        Description,
        CONCAT(a.FirstName, ' ', a.LastName) AS AgentName
      FROM visit v
      INNER JOIN agent a ON v.AgentID = a.AgentID
      WHERE v.ClientID = ?
      ORDER BY v.VisitDate DESC
      LIMIT 1
    `,
    [clientId]
  );

  return {
    visitDate: row ? formatDate(row.VisitDate) : null,
    visitDescription: textOrFallback(row?.Description, 'No visit description available.'),
    visitAgentName: textOrFallback(row?.AgentName, 'Not available'),
    hasVisit: Boolean(row),
  };
}

async function getRecentAssistanceInfo(clientId: number) {
  const row = await querySingle<{
    AssistanceName: string | null;
    Amount: number | string | null;
    Description: string | null;
  }>(
    `
      SELECT ac.assistanceCategory AS AssistanceName, a.Amount, a.Description
      FROM assistance a
      INNER JOIN assistance_category ac ON ac.assistanceCategoryID = a.assistanceCategoryID
      WHERE a.ClientID = ?
      ORDER BY a.DateGranted DESC
      LIMIT 1
    `,
    [clientId]
  );

  const amount = row?.Amount != null ? Number(row.Amount) : 0;

  return {
    assistanceName: textOrFallback(row?.AssistanceName, 'No assistance available.'),
    assistanceAmount: amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    }),
    assistanceDescription: textOrFallback(row?.Description, 'No assistance description available.'),
    hasAssistance: Boolean(row),
  };
}

async function getRecentNoteInfo(clientId: number) {
  const row = await querySingle<{
    NoteDescription: string | null;
    NoteAgentName: string | null;
  }>(
    `
      SELECT
        n.NoteDescription,
        CONCAT(a.FirstName, ' ', a.LastName) AS NoteAgentName
      FROM notes n
      INNER JOIN agent a ON n.AgentID = a.AgentID
      WHERE n.ClientID = ?
      ORDER BY n.NoteDate DESC
      LIMIT 1
    `,
    [clientId]
  );

  return {
    noteAgentName: textOrFallback(row?.NoteAgentName, 'Not available'),
    noteDescription: textOrFallback(row?.NoteDescription, 'No note available.'),
    hasNote: Boolean(row),
  };
}

async function getAllAlerts(clientId: number) {
  const rows = await queryRows<{
    alerts_id: number;
    AlertDate: Date | string | null;
    AlertDescription: string | null;
    AgentFullName: string | null;
  }>(
    `
      SELECT
        Alerts.alerts_id,
        Alerts.AlertDate,
        Alerts.AlertDescription,
        CONCAT(Agent.FirstName, ' ', Agent.LastName) AS AgentFullName
      FROM Alerts
      INNER JOIN Agent ON Alerts.AgentID = Agent.AgentID
      WHERE Alerts.ClientID = ?
      ORDER BY Alerts.AlertDate DESC
    `,
    [clientId]
  );

  return rows.map((row) => ({
    alertId: Number(row.alerts_id),
    alertDate: formatDate(row.AlertDate) ?? 'Not available',
    alertDescription: textOrFallback(row.AlertDescription, 'No alert description available.'),
    agentFullName: textOrFallback(row.AgentFullName, 'Not available'),
  }));
}

async function getAllNoShows(clientId: number) {
  const rows = await queryRows<{
    NoShowsID: number;
    NoShowDate: Date | string | null;
    Description: string | null;
    AgentFullName: string | null;
  }>(
    `
      SELECT
        ns.NoShowsID,
        ns.NoShowDate,
        ns.Description,
        CONCAT(a.FirstName, ' ', a.LastName) AS AgentFullName
      FROM noshows ns
      INNER JOIN agent a ON ns.AgentID = a.AgentID
      WHERE ns.ClientID = ?
      ORDER BY ns.NoShowDate DESC
    `,
    [clientId]
  );

  return rows.map((row) => ({
    noShowId: Number(row.NoShowsID),
    noShowDate: formatDate(row.NoShowDate) ?? 'Not available',
    description: textOrFallback(row.Description, 'No no-show description available.'),
    agentFullName: textOrFallback(row.AgentFullName, 'Not available'),
  }));
}

async function getAllVisits(clientId: number) {
  const rows = await queryRows<{
    VisitID: number;
    VisitDate: Date | string | null;
    Description: string | null;
    AgentName: string | null;
    VisitStatus: string | null;
  }>(
    `
      SELECT
        v.VisitID,
        v.VisitDate,
        v.Description,
        CONCAT(a.FirstName, ' ', a.LastName) AS AgentName,
        CASE
          WHEN v.JustVisit = 1 THEN 'Visit Only (No Assistance Provided)'
          WHEN v.AssistanceID IS NOT NULL THEN CONCAT(
            'Got Assistance on ',
            DATE_FORMAT(asst.DateGranted, '%b %d, %Y'),
            ' in the amount of $',
            FORMAT(asst.Amount, 2),
            '. See Assistance record for further details.'
          )
          ELSE 'Status Not Available'
        END AS VisitStatus
      FROM Visit v
      INNER JOIN Agent a ON v.AgentID = a.AgentID
      LEFT JOIN Assistance asst ON v.AssistanceID = asst.AssistanceID
      WHERE v.ClientID = ?
      ORDER BY v.VisitDate DESC
    `,
    [clientId]
  );

  return rows.map((row) => ({
    visitId: Number(row.VisitID),
    visitDate: formatDate(row.VisitDate) ?? 'Not available',
    description: textOrFallback(row.Description, 'No visit description available.'),
    agentName: textOrFallback(row.AgentName, 'Not available'),
    status: textOrFallback(row.VisitStatus, 'Status Not Available'),
  }));
}

async function getAllIndirectVisits(clientId: number) {
  const rows = await queryRows<{
    IndirectVisitID: number;
    BeneficiaryName: string | null;
    MainRecipient: string | null;
    VisitDate: Date | string | null;
    AgentName: string | null;
    VisitStatus: string | null;
    StreetAddress: string | null;
    City: string | null;
    State: string | null;
    PostalCode: string | null;
  }>(
    `
      SELECT
        iv.IndirectVisitID,
        CONCAT(c_ben.FirstName, ' ', IFNULL(c_ben.MiddleName,''), ' ', c_ben.LastName) AS BeneficiaryName,
        CONCAT(c_main.FirstName, ' ', IFNULL(c_main.MiddleName,''), ' ', c_main.LastName) AS MainRecipient,
        DATE_FORMAT(v.VisitDate, '%b %d, %Y') AS VisitDate,
        CONCAT(a.FirstName, ' ', a.LastName) AS AgentName,
        h.StreetAddress,
        h.City,
        h.State,
        h.PostalCode,
        CASE
          WHEN v.JustVisit = 1 THEN 'Visit Only (No Assistance Provided)'
          WHEN v.AssistanceID IS NOT NULL THEN CONCAT(
            'Got indirect Assistance in the amount of $',
            FORMAT(asst.Amount, 2)
          )
          ELSE 'Status Not Available'
        END AS VisitStatus
      FROM indirectVisits iv
      JOIN Visit v ON iv.VisitID = v.VisitID
      JOIN Client c_ben ON iv.ClientID = c_ben.ClientID
      JOIN Client c_main ON v.ClientID = c_main.ClientID
      JOIN Agent a ON v.AgentID = a.AgentID
      LEFT JOIN Assistance asst ON v.AssistanceID = asst.AssistanceID
      LEFT JOIN Household h ON c_main.HouseholdID = h.HouseholdID
      WHERE iv.ClientID = ?
      ORDER BY v.VisitDate DESC
    `,
    [clientId]
  );

  return rows.map((row) => {
    const address = [row.StreetAddress, row.City, row.State, row.PostalCode]
      .map((part) => (isPresent(part) ? String(part).trim() : ''))
      .filter(Boolean)
      .join(', ');

    return {
      indirectVisitId: Number(row.IndirectVisitID),
      beneficiaryName: textOrFallback(row.BeneficiaryName, 'Not available'),
      mainRecipient: textOrFallback(row.MainRecipient, 'Not available'),
      visitDate: row.VisitDate ? String(row.VisitDate) : 'Not available',
      agentName: textOrFallback(row.AgentName, 'Not available'),
      status: textOrFallback(row.VisitStatus, 'Status Not Available'),
      address: address || 'Not available',
    };
  });
}

async function getAllAssistances(clientId: number) {
  const rows = await queryRows<{
    AssistanceID: number;
    Amount: number | string | null;
    AssistanceNote: string | null;
    DateGranted: Date | string | null;
    countAssistances: number | boolean | null;
    Description: string | null;
    AgentFullName: string | null;
    AssistanceCategoryName: string | null;
    FundingSourceName: string | null;
  }>(
    `
      SELECT
        Assistance.AssistanceID,
        Assistance.Amount,
        Assistance.AssistanceNote,
        Assistance.DateGranted,
        Assistance.countAssistances,
        Assistance.Description,
        CONCAT(Agent.FirstName, ' ', Agent.LastName) AS AgentFullName,
        Assistance_Category.AssistanceCategory AS AssistanceCategoryName,
        fundingsource.FundingSourceName AS FundingSourceName
      FROM Assistance
      INNER JOIN Agent ON Assistance.AgentID = Agent.AgentID
      INNER JOIN Assistance_Category
        ON Assistance.assistanceCategoryID = Assistance_Category.assistanceCategoryID
      LEFT JOIN fundingsource
        ON Assistance.FundingSourceID = fundingsource.FundingSourceID
      WHERE Assistance.ClientID = ?
      ORDER BY Assistance.DateGranted DESC
    `,
    [clientId]
  );

  return rows.map((row) => ({
    assistanceId: Number(row.AssistanceID),
    amount: Number(row.Amount ?? 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    }),
    assistanceNote: textOrFallback(row.AssistanceNote, 'No note available.'),
    dateGranted: formatDate(row.DateGranted) ?? 'Not available',
    countsTowardEligibility: boolFromDb(row.countAssistances),
    description: textOrFallback(row.Description, 'No description available.'),
    agentFullName: textOrFallback(row.AgentFullName, 'Not available'),
    categoryName: textOrFallback(row.AssistanceCategoryName, 'Not available'),
    fundingSourceName: textOrFallback(row.FundingSourceName, 'Not available'),
  }));
}

async function getAllIndirectAssistances(clientId: number) {
  const rows = await queryRows<{
    IndirectAssistanceID: number;
    ClientID: number;
    ClientFullName: string | null;
    AssistanceID: number;
    AssistanceCategory: string | null;
    Amount: number | string | null;
    DateGranted: Date | string | null;
    StreetAddress: string | null;
    City: string | null;
    State: string | null;
    PostalCode: string | null;
    MainRecipient: string | null;
  }>(
    `
      SELECT
        ia.IndirectAssistanceID,
        c.ClientID,
        CONCAT(c.FirstName, ' ', IFNULL(c.MiddleName, ''), ' ', c.LastName) AS ClientFullName,
        a.AssistanceID,
        ac.AssistanceCategory,
        a.Amount,
        DATE_FORMAT(a.DateGranted, '%M %e, %Y') AS DateGranted,
        h.StreetAddress,
        h.City,
        h.State,
        h.PostalCode,
        (SELECT CONCAT(c2.FirstName, ' ', IFNULL(c2.MiddleName, ''), ' ', c2.LastName)
         FROM Client c2 WHERE c2.ClientID = a.ClientID) AS MainRecipient
      FROM IndirectAssistance ia
      INNER JOIN Client c ON ia.ClientID = c.ClientID
      INNER JOIN Assistance a ON ia.AssistanceID = a.AssistanceID
      INNER JOIN Assistance_Category ac ON a.AssistanceCategoryID = ac.AssistanceCategoryID
      INNER JOIN Household h ON a.HouseholdID = h.HouseholdID
      WHERE ia.ClientID = ?
      ORDER BY a.DateGranted DESC
    `,
    [clientId]
  );

  return rows.map((row) => {
    const address = [row.StreetAddress, row.City, row.State, row.PostalCode]
      .map((part) => (isPresent(part) ? String(part).trim() : ''))
      .filter(Boolean)
      .join(', ');

    return {
      indirectAssistanceId: Number(row.IndirectAssistanceID),
      clientId: Number(row.ClientID),
      clientFullName: textOrFallback(row.ClientFullName, 'Not available'),
      assistanceId: Number(row.AssistanceID),
      assistanceCategory: textOrFallback(row.AssistanceCategory, 'Not available'),
      amount: Number(row.Amount ?? 0).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
      dateGranted: row.DateGranted ? String(row.DateGranted) : 'Not available',
      address: address || 'Not available',
      mainRecipient: textOrFallback(row.MainRecipient, 'Not available'),
    };
  });
}

async function getFileDetails(clientId: number) {
  const row = await querySingle<{ EntryDate: Date | string | null; AgentFullName: string | null }>(
    `
      SELECT c.EntryDate, CONCAT(a.FirstName, ' ', a.LastName) AS AgentFullName
      FROM client c
      INNER JOIN agent a ON c.AgentID = a.AgentID
      WHERE c.ClientID = ?
      LIMIT 1
    `,
    [clientId]
  );

  const entryDate = row ? formatDate(row.EntryDate) : null;
  const agentFullName = textOrFallback(row?.AgentFullName, 'Not available');

  return {
    fileEntryDate: entryDate,
    fileAgentFullName: agentFullName,
    fileMessage: entryDate
      ? `The neighbor's file was created on ${entryDate} by volunteer/staff ${agentFullName}.`
      : 'File creation date is not available.',
  };
}

async function getNeedAssessmentInfo(clientId: number) {
  const row = await querySingle<{
    FoodResources: number | boolean | null;
    Transportation: number | boolean | null;
    Employment: number | boolean | null;
    Counseling: number | boolean | null;
    Community: number | boolean | null;
    BudgetCoaching: number | boolean | null;
    Education: number | boolean | null;
  }>(
    `
      SELECT
        NeedAssessmentFoodResources AS FoodResources,
        NeedAssessmentTransportation AS Transportation,
        NeedAssessmentEmploymentOpportunities AS Employment,
        NeedAssessmentCounseling AS Counseling,
        NeedAssessmentCommunityFellowship AS Community,
        NeedAssessmentBudgetCoaching AS BudgetCoaching,
        NeedAssesmentEducation AS Education
      FROM client
      WHERE ClientID = ?
    `,
    [clientId]
  );

  const items: string[] = [];

  if (row?.FoodResources) items.push('Food Resources');
  if (row?.Transportation) items.push('Transportation');
  if (row?.Employment) items.push('Employment Opportunities');
  if (row?.Counseling) items.push('Counseling');
  if (row?.Community) items.push('Community Fellowship');
  if (row?.BudgetCoaching) items.push('Budget Coaching');
  if (row?.Education) items.push('Education');

  return {
    hasAssessment: items.length > 0,
    items,
  };
}

async function getCountsAndTotals(clientId: number, householdId: number | null) {
  const householdMembersResult = householdId
    ? await querySingle<{ MemberCount: number }>(
      `
          SELECT COUNT(*) AS MemberCount
          FROM client
          WHERE HouseholdID = ?
        `,
      [householdId]
    )
    : null;

  const relativeCountResult = await querySingle<{ CountValue: number }>(
    'SELECT COUNT(*) AS CountValue FROM relative WHERE ClientID = ?',
    [clientId]
  );

  const assistanceCountResult = await querySingle<{ CountValue: number }>(
    'SELECT COUNT(*) AS CountValue FROM assistance WHERE ClientID = ?',
    [clientId]
  );

  const indirectAssistanceCountResult = await querySingle<{ CountValue: number }>(
    'SELECT COUNT(*) AS CountValue FROM indirectassistance WHERE ClientID = ?',
    [clientId]
  );

  const visitCountResult = await querySingle<{ CountValue: number }>(
    'SELECT COUNT(*) AS CountValue FROM visit WHERE ClientID = ?',
    [clientId]
  );

  const indirectVisitCountResult = await querySingle<{ CountValue: number }>(
    'SELECT COUNT(*) AS CountValue FROM indirectVisits WHERE ClientID = ?',
    [clientId]
  );

  const totalAssistanceResult = await querySingle<{ DirectTotal: number | string; IndirectTotal: number | string }>(
    `
      SELECT
        (SELECT IFNULL(SUM(Amount), 0) FROM assistance WHERE ClientID = ?) AS DirectTotal,
        (SELECT IFNULL(SUM(a.Amount), 0)
         FROM indirectassistance ia
         INNER JOIN assistance a ON ia.AssistanceID = a.AssistanceID
         WHERE ia.ClientID = ?) AS IndirectTotal
    `,
    [clientId, clientId]
  );

  const householdMemberCount = Number(householdMembersResult?.MemberCount ?? 0);
  const directTotal = Number(totalAssistanceResult?.DirectTotal ?? 0);
  const indirectTotal = Number(totalAssistanceResult?.IndirectTotal ?? 0);
  const total = directTotal + indirectTotal;

  return {
    householdMembers: householdMemberCount > 0 ? `${Math.max(householdMemberCount - 1, 0)} people` : 'No Address Provided!',
    householdMemberCount,
    relativeCount: Number(relativeCountResult?.CountValue ?? 0),
    assistanceCount: Number(assistanceCountResult?.CountValue ?? 0),
    indirectAssistanceCount: Number(indirectAssistanceCountResult?.CountValue ?? 0),
    visitCount: Number(visitCountResult?.CountValue ?? 0),
    indirectVisitCount: Number(indirectVisitCountResult?.CountValue ?? 0),
    totalAssistance: total.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    }),
  };
}

async function getEligibilityDetails(householdId: number | null, members: { clientId: number; fullName: string; eligibilityDate?: Date | string | null }[]) {
  if (!householdId || members.length === 0) {
    return {
      lastAssistedPerson: 'N/A',
      lastAssistanceAmount: 0,
      totalAssistances: 0,
      lastAssistanceDate: null,
      assistancesLimit: 0,
      message: 'Eligibility status unknown',
      progress: 0,
      color: 'gray' as const,
      nextEligibilityDate: null,
    };
  }

  const settings = await querySingle<{ AssistancesLimit: number }>(
    'SELECT AssistancesLimit FROM settings WHERE id = 1'
  );

  const assistancesLimit = Number(settings?.AssistancesLimit ?? 0);

  let lastAssistedPerson = 'N/A';
  let lastAssistanceAmount = 0;
  let lastAssistanceDate: Date | null = null;
  let maxTotalAssistances = 0;
  let mostRecentEligibilityDate: Date | null = null;

  for (const member of members) {
    const [directAssistance, indirectAssistance, totalAssistances] = await Promise.all([
      querySingle<{ Amount: number | string; DateGranted: Date | string }>(
        `
          SELECT Amount, DateGranted
          FROM assistance
          WHERE ClientID = ?
          ORDER BY DateGranted DESC
          LIMIT 1
        `,
        [member.clientId]
      ),
      querySingle<{ DateGranted: Date | string }>(
        `
          SELECT a.DateGranted
          FROM assistance a
          INNER JOIN indirectassistance ia ON ia.AssistanceID = a.AssistanceID
          WHERE ia.ClientID = ? AND a.countAssistances = TRUE
          ORDER BY a.DateGranted DESC
          LIMIT 1
        `,
        [member.clientId]
      ),
      querySingle<{ TotalAssistances: number }>(
        `
          SELECT
            (
              SELECT COUNT(*)
              FROM assistance
              WHERE ClientID = ? AND countAssistances = TRUE
            ) +
            (
              SELECT COUNT(*)
              FROM indirectassistance ia
              INNER JOIN assistance a ON ia.AssistanceID = a.AssistanceID
              WHERE ia.ClientID = ? AND a.countAssistances = TRUE
            ) AS TotalAssistances
        `,
        [member.clientId, member.clientId]
      ),
    ]);

    const directDate = directAssistance?.DateGranted ? new Date(directAssistance.DateGranted) : null;
    const indirectDate = indirectAssistance?.DateGranted ? new Date(indirectAssistance.DateGranted) : null;
    const totalValue = Number(totalAssistances?.TotalAssistances ?? 0);

    if (totalValue > maxTotalAssistances) {
      maxTotalAssistances = totalValue;
    }

    if (member.eligibilityDate) {
      const eligibilityDate = member.eligibilityDate instanceof Date
        ? member.eligibilityDate
        : new Date(member.eligibilityDate);

      if (!mostRecentEligibilityDate || eligibilityDate > mostRecentEligibilityDate) {
        mostRecentEligibilityDate = eligibilityDate;
      }
    }

    const newestDate =
      directDate && indirectDate ? (indirectDate > directDate ? indirectDate : directDate) : directDate || indirectDate;

    if (newestDate && (!lastAssistanceDate || newestDate > lastAssistanceDate)) {
      lastAssistanceDate = newestDate;
      lastAssistedPerson = member.fullName || 'Not available';

      if (indirectDate && (!directDate || indirectDate > directDate)) {
        lastAssistanceAmount = 0;
      } else {
        lastAssistanceAmount = Number(directAssistance?.Amount ?? 0);
      }
    }
  }

  let message = 'Eligibility status unknown';
  let progress = 0;
  let color: 'green' | 'orange' | 'red' | 'gray' = 'gray';

  if (maxTotalAssistances >= assistancesLimit && assistancesLimit > 0) {
    message = 'Not eligible for further help. Max help reached.';
    progress = 100;
    color = 'red';
  } else if (maxTotalAssistances === 0) {
    message = 'Eligible for further help.';
    progress = 100;
    color = 'green';
  } else if (mostRecentEligibilityDate && mostRecentEligibilityDate <= new Date()) {
    message = 'Eligible for further help.';
    progress = 100;
    color = 'green';
  } else if (mostRecentEligibilityDate) {
    const timeSpanDays = (mostRecentEligibilityDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    progress = Math.max(0, 100 - ((timeSpanDays / 365.25) * 100));
    color = 'orange';

    const years = Math.floor(timeSpanDays / 365.25);
    const months = Math.floor((timeSpanDays % 365.25) / 30.44);
    const days = Math.floor(timeSpanDays % 365.25 % 30.44);

    message = `Eligible in ${years} years, ${months} months, and ${days} days (Date: ${formatDate(mostRecentEligibilityDate) ?? 'Unknown'}).`;
  }

  return {
    lastAssistedPerson,
    lastAssistanceAmount,
    totalAssistances: maxTotalAssistances,
    lastAssistanceDate: formatDate(lastAssistanceDate),
    assistancesLimit,
    message,
    progress,
    color,
    nextEligibilityDate: formatDate(mostRecentEligibilityDate),
  };
}

export async function getClientProfileDashboard(clientId: number): Promise<ClientProfileDashboard | null> {
  const clientRow = await querySingle<ClientRow>(
    `
      SELECT
        c.*,
        h.StreetAddress,
        h.StreetApartmentNumber,
        h.City,
        h.State,
        h.PostalCode,
        h.County,
        c.IsDeceased,
        c.DeceasedDate,
        c.OnHold,
        c.OnHoldReasonText,
        c.EligibilityDate,
        CONCAT(a.FirstName, ' ', a.LastName) AS AgentFullName
      FROM client c
      LEFT JOIN household h ON c.HouseholdID = h.HouseholdID
      LEFT JOIN agent a ON c.AgentID = a.AgentID
      WHERE c.ClientID = ?
      LIMIT 1
    `,
    [clientId]
  );

  if (!clientRow) {
    return null;
  }

  const fullName = buildFullName(clientRow) || 'Not available';
  const displayName = buildDisplayName(clientRow) || fullName;
  const fullAddress = buildAddress(clientRow);
  const householdId = clientRow.HouseholdID ?? null;

  const membersRaw = householdId ? await getHouseholdMembers(householdId) : [];
  const livingWith = membersRaw.filter((member) => member.clientId !== clientId);
  const relatives = householdId ? await getHouseholdRelatives(membersRaw) : [];
  const eligibility = await getEligibilityDetails(householdId, membersRaw);
  const counts = await getCountsAndTotals(clientId, householdId);
  const recentAlert = await getRecentAlertInfo(clientId);
  const recentNoShow = await getRecentNoShowInfo(clientId);
  const recentVisit = await getRecentVisitInfo(clientId);
  const recentAssistance = await getRecentAssistanceInfo(clientId);
  const recentNote = await getRecentNoteInfo(clientId);
  const fileDetails = await getFileDetails(clientId);
  const assessments = await getNeedAssessmentInfo(clientId);
  const allAlerts = await getAllAlerts(clientId);
  const allNoShows = await getAllNoShows(clientId);
  const allVisits = await getAllVisits(clientId);
  const allIndirectVisits = await getAllIndirectVisits(clientId);
  const allAssistances = await getAllAssistances(clientId);
  const allIndirectAssistances = await getAllIndirectAssistances(clientId);

  const raw = clientRow as ClientRow;
  const roiStatusDate = raw.ROISTATUSDate ? new Date(raw.ROISTATUSDate) : null;
  const roiExpirationDate = roiStatusDate ? new Date(roiStatusDate) : null;
  if (roiExpirationDate) {
    roiExpirationDate.setFullYear(roiExpirationDate.getFullYear() + 3);
  }

  const detailFields: ClientDetailField[] = [
    { group: 'Identity', label: 'Client ID', value: String(raw.ClientID ?? 'Not available') },
    { group: 'Identity', label: 'Full Name', value: displayName },
    { group: 'Identity', label: 'First Name', value: textOrFallback(raw.FirstName) },
    { group: 'Identity', label: 'Middle Name', value: textOrFallback(raw.MiddleName) },
    { group: 'Identity', label: 'Last Name', value: textOrFallback(raw.LastName) },
    { group: 'Identity', label: 'Nickname', value: textOrFallback(raw.Nickname) },
    { group: 'Identity', label: 'Maiden Name', value: textOrFallback(raw.MaidenName) },
    { group: 'Identity', label: 'Suffix', value: textOrFallback(raw.Suffix) },
    { group: 'Identity', label: 'Entry Date', value: formatDateShort(raw.EntryDate) ?? 'No Entry Date' },
    {
      group: 'Identity',
      label: 'Date of Birth',
      value: formatDateShort(raw.DateOfBirth) ?? 'No Date of Birth',
    },
    { group: 'Identity', label: 'SSN', value: textOrFallback(raw.SSNumber) },
    {
      group: 'Identity',
      label: 'ROI Status',
      value: roiStatusDate && roiExpirationDate
        ? `${formatDateShort(roiStatusDate)} (expires ${formatDateShort(roiExpirationDate)})`
        : 'No ROI Status Date',
    },
    { group: 'Address', label: 'Household ID', value: raw.HouseholdID ? String(raw.HouseholdID) : 'Not available' },
    { group: 'Address', label: 'Mailing Address ID', value: raw.MailingAddressID ? String(raw.MailingAddressID) : 'Not available' },
    { group: 'Address', label: 'Full Address', value: fullAddress },
    { group: 'Address', label: 'County', value: textOrFallback(raw.County) },
    { group: 'Contact', label: 'Cell Phone', value: textOrFallback(raw.cell_phone) },
    { group: 'Contact', label: 'Home Phone', value: textOrFallback(raw.home_phone) },
    { group: 'Contact', label: 'Email', value: textOrFallback(raw.email) },
    {
      group: 'Contact',
      label: 'Leave Voicemail',
      value: raw.IsOkayToLeaveVoicemail ? 'Yes' : 'No',
    },
    {
      group: 'Contact',
      label: 'Leave Message With Someone',
      value: raw.IsOkayToLeaveMessageWithSomeone ? 'Yes' : 'No',
    },
    {
      group: 'Contact',
      label: 'Follow Up Call',
      value: raw.IsOkayToFollowUpCall ? 'Yes' : 'No',
    },
    { group: 'Demographics', label: 'Relationship Type', value: textOrFallback(raw.relationshipType) },
    { group: 'Demographics', label: 'Gender', value: textOrFallback(raw.Gender) },
    { group: 'Demographics', label: 'Ethnicity', value: textOrFallback(raw.Ethnicity) },
    { group: 'Demographics', label: 'Marital Status', value: textOrFallback(raw.MaritalStatus) },
    { group: 'Demographics', label: 'Education', value: textOrFallback(raw.Education) },
    { group: 'Demographics', label: 'Employment Status', value: textOrFallback(raw.Employment) },
    { group: 'Demographics', label: 'Veteran', value: raw.IsVeteran ? 'Yes' : 'No' },
    { group: 'Demographics', label: 'Employed', value: raw.IsEmployed ? 'Yes' : 'No' },
    { group: 'Income', label: 'Employment Amount', value: textOrFallback(raw.EmploymentAmount) },
    { group: 'Income', label: 'Other Income', value: textOrFallback(raw.OtherIncome) },
    { group: 'Income', label: 'Total Income', value: money(Number(raw.TotalIncome ?? 0)) },
    { group: 'Income', label: 'Total Expenses', value: money(Number(raw.TotalExpenses ?? 0)) },
    { group: 'Income', label: 'Net Amount', value: money(Number(raw.TotalIncome ?? 0) - Number(raw.TotalExpenses ?? 0)) },
    { group: 'Benefits', label: 'Food Stamps / SNAP', value: textOrFallback(raw.ReceivesFoodStampORSNAPs) },
    { group: 'Benefits', label: 'SSI', value: textOrFallback(raw.ReceivesDisabilitySSI) },
    { group: 'Benefits', label: 'Social Security', value: textOrFallback(raw.ReceivesSocialSecurity) },
    { group: 'Benefits', label: 'Veterans Benefits', value: textOrFallback(raw.ReceivesVeteransBenefits) },
    { group: 'Benefits', label: 'WIC', value: textOrFallback(raw.ReceivesWIC) },
    { group: 'Benefits', label: 'Families First', value: textOrFallback(raw.ReceivesFamiliesFirst) },
    { group: 'Benefits', label: 'Child Care', value: textOrFallback(raw.ReceivesChildcare) },
    { group: 'Benefits', label: 'Survivors Benefits', value: textOrFallback(raw.ReceivesSurvivorsBenefits) },
    { group: 'Benefits', label: 'Alimony', value: textOrFallback(raw.ReceivesAlimony) },
    { group: 'Benefits', label: 'Foster Care', value: textOrFallback(raw.FosterCare) },
    { group: 'Benefits', label: 'TennCare', value: raw.ReceivesTennCare ? 'Yes' : 'No' },
    { group: 'Benefits', label: 'Medicare', value: raw.ReceivesMedicare ? 'Yes' : 'No' },
    { group: 'Needs', label: 'Food Resources', value: raw.NeedAssessmentFoodResources ? 'Yes' : 'No' },
    { group: 'Needs', label: 'Transportation', value: raw.NeedAssessmentTransportation ? 'Yes' : 'No' },
    { group: 'Needs', label: 'Employment Opportunities', value: raw.NeedAssessmentEmploymentOpportunities ? 'Yes' : 'No' },
    { group: 'Needs', label: 'Counseling', value: raw.NeedAssessmentCounseling ? 'Yes' : 'No' },
    { group: 'Needs', label: 'Community Fellowship', value: raw.NeedAssessmentCommunityFellowship ? 'Yes' : 'No' },
    { group: 'Needs', label: 'Budget Coaching', value: raw.NeedAssessmentBudgetCoaching ? 'Yes' : 'No' },
    { group: 'Needs', label: 'Education', value: raw.NeedAssesmentEducation ? 'Yes' : 'No' },
    { group: 'Needs', label: 'Other Needs', value: textOrFallback(raw.NeedAssessmentOtherNeeds) },
    { group: 'Children', label: 'Children Count', value: String(raw.Children ?? 0) },
    { group: 'Children', label: 'Children JSON', value: textOrFallback(raw.ChildrenJson, '{}') },
    { group: 'Documents', label: 'Has Documents', value: raw.Documents ? 'Yes' : 'No' },
    { group: 'Documents', label: 'Document URL', value: textOrFallback(raw.Documents) },
    { group: 'Documents', label: 'Personal Document Details', value: textOrFallback(raw.PersonalDocumentDetails) },
    { group: 'Documents', label: 'Liability Waiver', value: textOrFallback(raw.LiabilityWaiverDoc) },
    { group: 'Status', label: 'Deceased', value: raw.IsDeceased ? 'Yes' : 'No' },
    { group: 'Status', label: 'Deceased Date', value: formatDateShort(raw.DeceasedDate) ?? 'Not available' },
    { group: 'Status', label: 'On Hold', value: raw.OnHold ? 'Yes' : 'No' },
    { group: 'Status', label: 'On Hold Reason', value: textOrFallback(raw.OnHoldReasonText, 'No reason provided.') },
    { group: 'Status', label: 'Head of Household', value: raw.IsHeadOfHousehold ? 'Yes' : 'No' },
    { group: 'Status', label: 'Agent', value: textOrFallback(raw.AgentFullName) },
    { group: 'Status', label: 'Entry Years in File', value: raw.EntryDate ? `${Math.max(0, new Date().getFullYear() - new Date(raw.EntryDate).getFullYear())} years in file` : 'No Entry Date' },
  ];

  return {
    client: {
      clientId: clientRow.ClientID,
      fullName,
      displayName,
      nickname: clientRow.Nickname ?? null,
      maidenName: clientRow.MaidenName ?? null,
      suffix: clientRow.Suffix ?? null,
      dateOfBirth: formatDateShort(clientRow.DateOfBirth),
      entryDate: formatDateShort(clientRow.EntryDate),
      email: textOrFallback(clientRow.email),
      cellPhone1: textOrFallback(clientRow.cell_phone),
      cellPhone2: textOrFallback(clientRow.home_phone),
      fullAddress,
      county: textOrFallback(clientRow.County),
      householdId,
      isDeceased: boolFromDb(clientRow.IsDeceased),
      deceasedDate: formatDateShort(clientRow.DeceasedDate),
      isOnHold: boolFromDb(clientRow.OnHold),
      onHoldReason: textOrFallback(clientRow.OnHoldReasonText, 'No reason provided.'),
      eligibilityDate: formatDateShort(clientRow.EligibilityDate),
      agentFullName: textOrFallback(clientRow.AgentFullName),
    },
    status: {
      isDeceased: boolFromDb(clientRow.IsDeceased),
      deceasedDate: formatDateShort(clientRow.DeceasedDate),
      dateOfBirth: formatDateShort(clientRow.DateOfBirth),
      isOnHold: boolFromDb(clientRow.OnHold),
      onHoldReason: textOrFallback(clientRow.OnHoldReasonText, 'No reason provided.'),
      householdId,
    },
    counts,
    eligibility,
    recent: {
      ...recentAlert,
      ...recentNoShow,
      ...recentVisit,
      ...recentAssistance,
      ...recentNote,
      ...fileDetails,
    },
    assessments,
    household: {
      members: membersRaw.map((member) => ({
        clientId: member.clientId,
        fullName: member.fullName,
        ageLabel: member.ageLabel,
        isDeceased: member.isDeceased,
        deceasedDate: member.deceasedDate,
        dateOfBirth: member.dateOfBirth,
        eligibilityDate: member.eligibilityDate,
      })),
      livingWith: livingWith.map((member) => ({
        clientId: member.clientId,
        fullName: member.fullName,
        ageLabel: member.ageLabel,
        isDeceased: member.isDeceased,
        deceasedDate: member.deceasedDate,
        dateOfBirth: member.dateOfBirth,
        eligibilityDate: member.eligibilityDate,
      })),
      relatives,
    },
    details: detailFields,
    records: {
      alerts: allAlerts,
      noShows: allNoShows,
      visits: allVisits,
      indirectVisits: allIndirectVisits,
      assistances: allAssistances,
      indirectAssistances: allIndirectAssistances,
    },
  };
}
