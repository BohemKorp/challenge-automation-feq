import { test, expect } from '../../fixtures/custom-fixtures';

test.describe('JSONPlaceholder API Tests - Part 2', () => {
  test('POST - Create new post', async ({ request, logTest }) => {
    // Prepare test data
    const payload = {
      title: 'Test Automation Post',
      body: 'This is a test post created by automation testing framework using Playwright',
      userId: 1
    };

    // Make POST request
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: payload
    });

    // Assertions
    // Validate status code is 201 (Created)
    expect(response.status()).toBe(201);

    // Parse response data
    const data = await response.json();

    // Validate that an ID was generated
    expect(data.id).toBeTruthy();
    expect(typeof data.id).toBe('number');
    expect(data.id).toBeGreaterThan(0);

    // Validate that the sent data is returned correctly
    expect(data.title).toBe(payload.title);
    expect(data.body).toBe(payload.body);
    expect(data.userId).toBe(payload.userId);

    // Log the created post ID
    console.log(`Created post with ID: ${data.id}`);

    // Log test end time
    logTest.end();
  });

  test('POST - Create post with empty body', async ({ request, logTest }) => {
    const payload = {
      title: 'Post with empty body',
      body: '',
      userId: 2
    };

    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: payload
    });

    // Validate successful creation even with empty body
    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data.id).toBeTruthy();
    expect(data.title).toBe(payload.title);
    expect(data.body).toBe('');

    console.log(`Created post with empty body, ID: ${data.id}`);

    logTest.end();
  });

  test('POST - Create post with different user', async ({ request, logTest }) => {
    const payload = {
      title: 'User 10 Test Post',
      body: 'Testing with different user ID',
      userId: 10
    };

    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: payload
    });

    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data.id).toBeTruthy();
    expect(data.userId).toBe(10);

    console.log(`Created post for user ${data.userId}, post ID: ${data.id}`);

    logTest.end();
  });
});
