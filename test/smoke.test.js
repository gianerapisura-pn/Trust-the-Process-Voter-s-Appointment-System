const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');

async function waitForServer(url, child, output) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error(`Server exited before startup.\n${output.value}`);
    }

    try {
      const response = await fetch(`${url}/health`);
      if (response.ok) return;
    } catch (error) {}

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Server did not start in time.\n${output.value}`);
}

test('server connects to the database and serves core routes', { timeout: 45000 }, async () => {
  const port = 3199;
  const url = `http://127.0.0.1:${port}`;
  const output = { value: '' };
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'admin123';
  const child = spawn(process.execPath, ['server.js'], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(port), ADMIN_USER: adminUser, ADMIN_PASS: adminPass },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (chunk) => { output.value += chunk.toString(); });
  child.stderr.on('data', (chunk) => { output.value += chunk.toString(); });

  try {
    await waitForServer(url, child, output);

    const healthResponse = await fetch(`${url}/health`);
    assert.equal(healthResponse.status, 200);
    const health = await healthResponse.json();
    assert.equal(health.message, 'CICS Voters API running');

    const sitesResponse = await fetch(`${url}/api/sites`);
    assert.equal(sitesResponse.status, 200);
    assert.ok(Array.isArray(await sitesResponse.json()));

    const slotsResponse = await fetch(`${url}/api/slots`);
    assert.equal(slotsResponse.status, 200);
    assert.ok(Array.isArray(await slotsResponse.json()));

    const loginResponse = await fetch(`${url}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: adminUser, password: adminPass }),
    });
    assert.equal(loginResponse.status, 200);
    const login = await loginResponse.json();
    assert.ok(login.token);

    const registerResponse = await fetch(`${url}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'unauthorized-test', password: 'test-password' }),
    });
    assert.equal(registerResponse.status, 401);
  } finally {
    if (child.exitCode === null) {
      child.kill();
      await once(child, 'exit');
    }
  }
});
