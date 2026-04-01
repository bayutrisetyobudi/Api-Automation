const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('API Tests - JSONPlaceholder', () => {

  // =========================
  // GET /posts
  // =========================
  test('GET /posts - should return list of posts', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts`);

    // Validasi status
    expect(response.status()).toBe(200);

    const body = await response.json();

    // Validasi struktur
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    // Validasi field
    const post = body[0];
    expect(post).toHaveProperty('userId');
    expect(post).toHaveProperty('id');
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
  });

  // =========================
  // GET /posts/{id}
  // =========================
  test('GET /posts/1 - should return correct post', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts/1`);

    // Status code
    expect(response.status()).toBe(200);

    const body = await response.json();

    // Struktur
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('userId');
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('body');

    // Validasi data spesifik
    expect(body.id).toBe(1);
  });

  // =========================
  // GET /posts/{invalid id}
  // =========================
  test('GET /posts/9999 - should return 404', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts/9999`);

    expect(response.status()).toBe(404);
  });

  // =========================
  // POST /posts
  // =========================
  test('POST /posts - should create new post', async ({ request }) => {
    const payload = {
      title: 'Test Title',
      body: 'Test Body',
      userId: 1
    };

    const response = await request.post(`${BASE_URL}/posts`, {
      data: payload
    });

    // Status code
    expect(response.status()).toBe(201);

    const body = await response.json();

    // Validasi response
    expect(body).toHaveProperty('id');
    expect(body.title).toBe(payload.title);
    expect(body.body).toBe(payload.body);
    expect(body.userId).toBe(payload.userId);
  });

  // =========================
  // POST /posts - invalid body
  // =========================
  test('POST /posts - invalid payload', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/posts`, {
      data: {}
    });

    // JSONPlaceholder biasanya tetap 201 (fake API)
    expect([201, 400]).toContain(response.status());
  });

});