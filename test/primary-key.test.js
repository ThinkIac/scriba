import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import Scriba from '../src/Scriba.js';

test('reads declared scalar and composite keys from one tenant as plain data', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'scriba-primary-key-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const schema = path.join(dir, 'schema.prisma');
  fs.writeFileSync(schema, `model User {
  slug String @id
  name String
}
model Membership {
  workspaceId String
  code Int
  active Boolean
  @@id([workspaceId, code])
}
`);
  const scriba = new Scriba();
  for (const tenant of ['north', 'south']) {
    scriba.addTenant({ id: tenant, path: ':memory:', schema, watchSchema: false });
    t.after(() => scriba._tenants[tenant].db.close());
    const users = scriba.entity('User', tenant);
    const memberships = scriba.entity('Membership', tenant);
    users._db.prepare('INSERT INTO User (slug, name, createdAt, updatedAt) VALUES (?, ?, ?, ?)').run('ana', tenant, '', '');
    memberships._db.prepare('INSERT INTO Membership (id, workspaceId, code, active, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)').run(tenant, 'main', 7, 1, '', '');
  }
  assert.deepEqual(scriba.readByPrimaryKey('north', 'User', { slug: 'ana' }, ['slug', 'name']), { slug: 'ana', name: 'north' });
  assert.deepEqual(scriba.readByPrimaryKey('south', 'User', { slug: 'ana' }, ['slug', 'name']), { slug: 'ana', name: 'south' });
  assert.deepEqual(scriba.readByPrimaryKey('north', 'Membership', { code: 7, workspaceId: 'main' }, ['active']), { active: true });
  for (const key of [{ code: '7', workspaceId: 'main' }, { code: 7 }, { code: 7, workspaceId: 'main', extra: true }]) {
    assert.throws(() => scriba.readByPrimaryKey('north', 'Membership', key, ['active']), { code: 'SCRIBA_INVALID_KEY' });
  }
  const db = scriba._tenants.north.db;
  db.prepare('UPDATE User SET deletedAt = ? WHERE slug = ?').run('2026-01-01', 'ana');
  assert.equal(scriba.readByPrimaryKey('north', 'User', { slug: 'ana' }, ['name']), null);
  assert.equal(scriba.readByPrimaryKey('north', 'User', { slug: 'missing' }, ['name']), null);
});
