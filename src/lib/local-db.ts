import {
  SEED_IDS,
  buildBayesScenarios,
  buildCampaign,
  buildDemoCharacter,
  buildEncounters,
  buildMap,
  buildMapMarkers,
  buildNPCs,
  buildNotes,
} from '@/lib/seed/tower-of-fate';

type AnyRecord = Record<string, any>;

type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED';

interface LocalUser {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
}

interface LocalSession {
  user: LocalUser | null;
  forceSignedOut?: boolean;
}

interface LocalDbState {
  session: LocalSession;
  tables: Record<string, AnyRecord[]>;
}

interface QueryError {
  message: string;
  code?: string;
}

const STORAGE_KEY = 'dice-decisions-local-db';
const DEFAULT_USER: LocalUser = {
  id: 'local-user-1',
  email: 'master@diceanddecisions.com',
  user_metadata: { display_name: 'Dungeon Master' },
};

const withTimestamps = <T extends AnyRecord>(rows: T[]): T[] => {
  const now = new Date().toISOString();
  return rows.map((row) => ({
    ...row,
    created_at: row.created_at ?? now,
    updated_at: row.updated_at ?? now,
  }));
};

const ensurePremadeContent = (state: LocalDbState): LocalDbState => {
  const next = clone(state);
  if (!next.tables) {
    next.tables = {};
  }

  const ensureTable = (name: string): AnyRecord[] => {
    if (!Array.isArray(next.tables[name])) {
      next.tables[name] = [];
    }
    return next.tables[name];
  };

  const upsertMissing = (tableName: string, rows: AnyRecord[]) => {
    const table = ensureTable(tableName);
    for (const row of rows) {
      if (!table.some((existing) => existing.id === row.id)) {
        table.push(row);
      }
    }
  };

  const campaign = buildCampaign(DEFAULT_USER.id);
  const premadeCampaign = withTimestamps([
    {
      ...campaign,
      dm_id: campaign.dm_user_id,
      is_template: false,
    },
  ]);

  upsertMissing(
    'profiles',
    withTimestamps([
      {
        id: DEFAULT_USER.id,
        email: DEFAULT_USER.email,
        display_name: 'Dungeon Master',
        avatar_url: null,
        preferred_role: 'dm',
        selected_theme: 'fantasy',
      },
    ]),
  );
  upsertMissing('campaigns', premadeCampaign);
  upsertMissing('characters', withTimestamps([buildDemoCharacter(DEFAULT_USER.id)]));
  upsertMissing('npcs', withTimestamps(buildNPCs()));
  upsertMissing('encounters', withTimestamps(buildEncounters()));
  upsertMissing('notes', withTimestamps(buildNotes(DEFAULT_USER.id)));
  upsertMissing('bayes_scenarios', withTimestamps(buildBayesScenarios()));
  upsertMissing('campaign_maps', withTimestamps([buildMap()]));
  upsertMissing('map_markers', withTimestamps(buildMapMarkers()));

  ensureTable('player_notes');

  const hasMainCampaign = ensureTable('campaigns').some(
    (row) => row.id === SEED_IDS.campaign,
  );
  if (!hasMainCampaign) {
    upsertMissing('campaigns', premadeCampaign);
  }

  return next;
};

const createDefaultState = (): LocalDbState => ({
  ...(() => {
    const campaign = buildCampaign(DEFAULT_USER.id);
    const demoMap = buildMap();
    return {
      session: {
        user: { ...DEFAULT_USER },
        forceSignedOut: false,
      },
      tables: {
        profiles: withTimestamps([
          {
            id: DEFAULT_USER.id,
            email: DEFAULT_USER.email,
            display_name: 'Dungeon Master',
            avatar_url: null,
            preferred_role: 'dm',
            selected_theme: 'fantasy',
          },
        ]),
        campaigns: withTimestamps([
          {
            ...campaign,
            dm_id: campaign.dm_user_id,
            is_template: false,
          },
        ]),
        characters: withTimestamps([buildDemoCharacter(DEFAULT_USER.id)]),
        npcs: withTimestamps(buildNPCs()),
        encounters: withTimestamps(buildEncounters()),
        notes: withTimestamps(buildNotes(DEFAULT_USER.id)),
        player_notes: [],
        bayes_scenarios: withTimestamps(buildBayesScenarios()),
        campaign_maps: withTimestamps([demoMap]),
        map_markers: withTimestamps(buildMapMarkers()),
      },
    };
  })(),
});

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const globalState = (): LocalDbState => {
  const g = globalThis as typeof globalThis & { __DD_LOCAL_DB__?: LocalDbState };
  if (!g.__DD_LOCAL_DB__) {
    g.__DD_LOCAL_DB__ = createDefaultState();
  } else {
    g.__DD_LOCAL_DB__ = ensurePremadeContent(g.__DD_LOCAL_DB__);
  }
  return g.__DD_LOCAL_DB__;
};

const loadClientState = (): LocalDbState => {
  if (typeof window === 'undefined') {
    return globalState();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = createDefaultState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(raw) as LocalDbState;
    const hydrated = ensurePremadeContent(parsed);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(hydrated));
    return hydrated;
  } catch {
    const fallback = createDefaultState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
};

const saveClientState = (state: LocalDbState) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
};

const makeId = (prefix: string) => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
};

class LocalQueryBuilder {
  private filters: Array<(row: AnyRecord) => boolean> = [];
  private sortField: string | null = null;
  private sortAscending = true;
  private maxRows: number | null = null;
  private mode: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private insertRows: AnyRecord[] = [];
  private updatePatch: AnyRecord = {};
  private selectOptions: { count?: string; head?: boolean } | undefined;
  private wantsSingle = false;
  private wantsMaybeSingle = false;

  constructor(
    private readonly client: LocalDbClient,
    private readonly tableName: string,
  ) {}

  select(columns: string = '*', options?: { count?: string; head?: boolean }) {
    void columns;
    this.mode = 'select';
    this.selectOptions = options;
    return this;
  }

  eq(field: string, value: unknown) {
    this.filters.push((row) => row[field] === value);
    return this;
  }

  in(field: string, values: unknown[]) {
    const set = new Set(values);
    this.filters.push((row) => set.has(row[field]));
    return this;
  }

  or(expression: string) {
    const parts = expression.split(',').map((part) => part.trim());
    const predicates = parts
      .map((part) => {
        const ilikeMatch = part.match(/^([^.]+)\.ilike\.%(.*)%$/i);
        if (ilikeMatch) {
          const [, field, term] = ilikeMatch;
          const normalized = String(term ?? '').toLowerCase();
          return (row: AnyRecord) =>
            String(row[String(field)] ?? '')
              .toLowerCase()
              .includes(normalized);
        }

        const eqMatch = part.match(/^([^.]+)\.eq\.(.*)$/i);
        if (eqMatch) {
          const [, field, rawValue] = eqMatch;
          const key = String(field);
          const expected = String(rawValue ?? '');
          return (row: AnyRecord) => String(row[key] ?? '') === expected;
        }

        return null;
      })
      .filter((predicate): predicate is (row: AnyRecord) => boolean => Boolean(predicate));

    if (predicates.length > 0) {
      this.filters.push((row) => predicates.some((predicate) => predicate(row)));
    }

    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.sortField = field;
    this.sortAscending = options?.ascending ?? true;
    return this;
  }

  limit(count: number) {
    this.maxRows = count;
    return this;
  }

  single() {
    this.wantsSingle = true;
    return this;
  }

  maybeSingle() {
    this.wantsMaybeSingle = true;
    return this;
  }

  insert(payload: AnyRecord | AnyRecord[]) {
    this.mode = 'insert';
    this.insertRows = Array.isArray(payload) ? payload : [payload];
    return this;
  }

  update(patch: AnyRecord) {
    this.mode = 'update';
    this.updatePatch = patch;
    return this;
  }

  delete() {
    this.mode = 'delete';
    return this;
  }

  async then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled as any, onrejected as any);
  }

  private applyFilters(rows: AnyRecord[]) {
    let filtered = rows;
    for (const filter of this.filters) {
      filtered = filtered.filter(filter);
    }

    if (this.sortField) {
      filtered = [...filtered].sort((a, b) => {
        const left = a[this.sortField as string];
        const right = b[this.sortField as string];
        if (left === right) return 0;
        const result = left > right ? 1 : -1;
        return this.sortAscending ? result : -result;
      });
    }

    if (typeof this.maxRows === 'number') {
      filtered = filtered.slice(0, this.maxRows);
    }

    return filtered;
  }

  private baseResult(data: unknown, error: QueryError | null = null, count?: number) {
    return { data, error, count: count ?? null };
  }

  private async execute() {
    const rows = this.client.getTable(this.tableName);

    if (this.mode === 'select') {
      const filtered = this.applyFilters(rows);

      if (this.selectOptions?.head) {
        return this.baseResult(null, null, filtered.length);
      }

      if (this.wantsSingle || this.wantsMaybeSingle) {
        if (filtered.length === 0) {
          if (this.wantsMaybeSingle) {
            return this.baseResult(null, null);
          }
          return this.baseResult(null, { message: 'No rows found', code: 'PGRST116' });
        }
        return this.baseResult(clone(filtered[0]), null);
      }

      return this.baseResult(clone(filtered), null, filtered.length);
    }

    if (this.mode === 'insert') {
      const timestamp = new Date().toISOString();
      const inserted = this.insertRows.map((row) => ({
        id: row.id ?? makeId(this.tableName),
        created_at: row.created_at ?? timestamp,
        updated_at: row.updated_at ?? timestamp,
        ...row,
      }));
      this.client.setTable(this.tableName, [...rows, ...inserted]);

      if (this.wantsSingle || this.wantsMaybeSingle) {
        return this.baseResult(clone(inserted[0] ?? null), null);
      }
      return this.baseResult(clone(inserted), null);
    }

    if (this.mode === 'update') {
      const filtered = this.applyFilters(rows);
      const updatedRows = rows.map((row) =>
        filtered.some((candidate) => candidate.id === row.id)
          ? { ...row, ...this.updatePatch, updated_at: new Date().toISOString() }
          : row,
      );
      this.client.setTable(this.tableName, updatedRows);

      const fresh = this.applyFilters(updatedRows);
      if (this.wantsSingle || this.wantsMaybeSingle) {
        return this.baseResult(clone(fresh[0] ?? null), null);
      }
      return this.baseResult(clone(fresh), null);
    }

    const kept = rows.filter((row) => !this.applyFilters([row]).length);
    this.client.setTable(this.tableName, kept);
    return this.baseResult(null, null);
  }
}

class LocalDbClient {
  private listeners = new Set<(event: AuthEvent, session: { user: LocalUser | null }) => void>();

  private state: LocalDbState;

  constructor() {
    this.state = loadClientState();
  }

  private persist() {
    if (typeof window !== 'undefined') {
      saveClientState(this.state);
    } else {
      const g = globalThis as typeof globalThis & { __DD_LOCAL_DB__?: LocalDbState };
      g.__DD_LOCAL_DB__ = this.state;
    }
  }

  private emit(event: AuthEvent) {
    const payload = { user: this.state.session.user };
    for (const listener of this.listeners) {
      listener(event, payload);
    }
  }

  getTable(name: string): AnyRecord[] {
    if (!this.state.tables[name]) {
      this.state.tables[name] = [];
    }
    return this.state.tables[name];
  }

  setTable(name: string, rows: AnyRecord[]) {
    this.state.tables[name] = rows;
    this.persist();
  }

  auth = {
    getUser: async () => {
      if (!this.state.session.user && !this.state.session.forceSignedOut) {
        this.state.session.user = clone(DEFAULT_USER);
      }
      return { data: { user: this.state.session.user }, error: null };
    },
    signInWithPassword: async ({ email }: { email: string; password: string }) => {
      this.state.session.user = {
        id: this.state.session.user?.id ?? DEFAULT_USER.id,
        email,
        user_metadata: { display_name: email.split('@')[0] || 'Adventurer' },
      };
      this.state.session.forceSignedOut = false;
      this.persist();
      this.emit('SIGNED_IN');
      return { data: { user: this.state.session.user }, error: null };
    },
    signUp: async ({
      email,
      options,
    }: {
      email: string;
      password: string;
      options?: { data?: { display_name?: string } };
    }) => {
      const displayName = options?.data?.display_name ?? email.split('@')[0] ?? 'Adventurer';
      this.state.session.user = {
        id: makeId('user'),
        email,
        user_metadata: { display_name: displayName },
      };
      this.state.session.forceSignedOut = false;
      this.getTable('profiles').push({
        id: this.state.session.user.id,
        display_name: displayName,
        avatar_url: null,
        preferred_role: 'player',
        selected_theme: 'fantasy',
      });
      this.persist();
      this.emit('SIGNED_IN');
      return { data: { user: this.state.session.user }, error: null };
    },
    signOut: async () => {
      this.state.session.user = null;
      this.state.session.forceSignedOut = true;
      this.persist();
      this.emit('SIGNED_OUT');
      return { error: null };
    },
    resetPasswordForEmail: async (email: string) => {
      void email;
      return { data: null, error: null };
    },
    exchangeCodeForSession: async (code: string) => {
      void code;
      this.state.session.user = clone(DEFAULT_USER);
      this.state.session.forceSignedOut = false;
      this.persist();
      this.emit('SIGNED_IN');
      return { data: { session: { user: this.state.session.user } }, error: null };
    },
    onAuthStateChange: (
      callback: (event: AuthEvent, session: { user: LocalUser | null }) => void,
    ) => {
      this.listeners.add(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              this.listeners.delete(callback);
            },
          },
        },
      };
    },
  };

  from(tableName: string) {
    return new LocalQueryBuilder(this, tableName);
  }

  storage = {
    from: (bucket: string) => {
      void bucket;
      return {
      upload: async (path: string, file: File | Blob) => {
        void file;
        return { data: { path }, error: null };
      },
      remove: async (paths: string[]) => {
        void paths;
        return { data: null, error: null };
      },
      getPublicUrl: (path: string) => ({
        data: {
          publicUrl: `/uploads/${path}`,
        },
      }),
    };
    },
  };
}

export function createLocalClient() {
  return new LocalDbClient();
}
