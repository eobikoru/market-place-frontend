const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('helpme_token');
}

export async function api<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token = getToken(), ...rest } = options;
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...rest.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data as T;
}

export const auth = {
  register: (body: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
    terms_accepted?: boolean;
  }) =>
    api<{ user: unknown; token: string }>('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    api<{ user: unknown; token: string }>('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: (token: string) =>
    api<{ id: string; name: string; email: string; role: string; workerProfile?: unknown[]; walletBalance?: number }>(
      '/api/v1/auth/me',
      { token }
    ),
  updateMe: (body: { name?: string; phone?: string; latitude?: number; longitude?: number }, token: string) =>
    api<{ ok: boolean }>('/api/v1/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(body),
      token,
    }),
};

export const services = {
  list: () => api<{ id: string; name: string; slug: string; description?: string }[]>('/api/v1/services'),
  get: (id: string) => api<{ id: string; name: string; slug: string }>(`/api/v1/services/${id}`),
};

export const workers = {
  list: (params: { lat?: number; lng?: number; service?: string; min_rating?: number; max_price?: number }) => {
    const q = new URLSearchParams();
    if (params.lat != null) q.set('lat', String(params.lat));
    if (params.lng != null) q.set('lng', String(params.lng));
    if (params.service) q.set('service', params.service);
    if (params.min_rating != null) q.set('min_rating', String(params.min_rating));
    if (params.max_price != null) q.set('max_price', String(params.max_price));
    return api<Array<Record<string, unknown>>>(`/api/v1/workers?${q}`);
  },
  get: (id: string) => api<Record<string, unknown>>(`/api/v1/workers/${id}`),
  apply: (
    body: {
      service_category_id: string;
      bio?: string;
      price_min: number;
      price_max?: number;
      id_document_url?: string;
    },
    token: string
  ) =>
    api<unknown>('/api/v1/workers/apply', { method: 'POST', body: JSON.stringify(body), token }),
};

export const bookings = {
  book: (
    body: {
      worker_id: string;
      service_category_id: string;
      price: number;
      address: string;
      scheduled_at: string;
      notes?: string;
      latitude?: number;
      longitude?: number;
    },
    token: string
  ) =>
    api<Record<string, unknown>>('/api/v1/bookings/book', {
      method: 'POST',
      body: JSON.stringify(body),
      token,
    }),
  myBookings: (token: string) =>
    api<Array<Record<string, unknown>>>('/api/v1/bookings/my-bookings', { token }),
  workerJobs: (token: string) =>
    api<Array<Record<string, unknown>>>('/api/v1/bookings/worker-jobs', { token }),
  updateStatus: (id: string, status: string, token: string) =>
    api<Record<string, unknown>>(`/api/v1/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      token,
    }),
  cancel: (id: string, token: string) =>
    api<Record<string, unknown>>(`/api/v1/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'cancelled' }),
      token,
    }),
  review: (id: string, body: { rating: number; comment?: string }, token: string) =>
    api<{ ok: boolean }>(`/api/v1/bookings/${id}/review`, { method: 'POST', body: JSON.stringify(body), token }),
};

export const payments = {
  pay: (booking_id: string, reference?: string, token?: string) =>
    api<{ ok: boolean; payment_url?: string }>(
      '/api/v1/payments/pay',
      { method: 'POST', body: JSON.stringify({ booking_id, reference }), token: token ?? getToken() }
    ),
  withdraw: (amount: number, token: string) =>
    api<{ ok: boolean; new_balance: number }>('/api/v1/payments/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount }),
      token,
    }),
  wallet: (token: string) => api<{ balance: number }>('/api/v1/payments/wallet', { token }),
};

export const notifications = {
  list: (token: string) =>
    api<Array<{ id: string; type: string; title: string; body?: string; read_at?: string; created_at: string }>>(
      '/api/v1/notifications',
      { token }
    ),
  markRead: (id: string, token: string) =>
    api<{ ok: boolean }>(`/api/v1/notifications/${id}/read`, {
      method: 'PATCH',
      token,
    }),
};

export const admin = {
  workers: (token: string) =>
    api<Array<Record<string, unknown>>>('/api/v1/admin/workers', { token }),
  workersPendingVerification: (token: string) =>
    api<Array<Record<string, unknown>>>('/api/v1/admin/workers/pending-verification', { token }),
  workerIdVerify: (workerId: string, idVerified: boolean, token: string) =>
    api<{ ok: boolean }>(`/api/v1/admin/workers/${workerId}/id-verify`, {
      method: 'PATCH',
      body: JSON.stringify({ id_verified: idVerified }),
      token,
    }),
};
