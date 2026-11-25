# scriba

Pacote scriba da distribuição ThinkIac.

Repositório: https://github.com/ThinkIac/scriba.

## Uso no ThinkIac

Este pacote foi extraído de `vendor/packages/scriba`. Preserve a identidade `scriba` do manifest ao instalá-lo em um workspace Lógos. Views, rotas, ferramentas e hooks são descobertos pelo runtime e dependem dos provedores correspondentes. Esta extração publica o código atual; não converte JavaScript para LógosType nem implementa instalação por perfil.

Entrada declarada: `src/index.js`.

## Dependências e validação

Dependências declaradas: `@johanlabs/rust-scriba`, `@prisma/internals`, `better-sqlite3`, `chokidar`, `cors`, `crypto`, `express`, `pluralize`, `scriba-rule-engine`, `swagger-themes`, `swagger-ui-express`, `logos`.

O pacote não declara scripts npm de build/teste. Os testes existentes acompanham o fonte; a composição completa requer o host ThinkIac.

## Segurança e dados locais

Credenciais devem ser configuradas no ambiente de destino. Não acompanham esta extração bancos, sessões, uploads, perfis pessoais, arquivos `.env`, caches ou backups. As exclusões foram registradas em relatório externo à publicação. Configure segredos pelo host, sem incluí-los em commits.

## Documentação anterior

# 📝 **Scriba — The Zero-Learning Curve Reactive ORM**

Scriba is a minimalist, reactive, SQLite-powered ORM designed with one radical principle:

> **“If it feels like working with plain JavaScript objects, you're doing it right.”**

Forget complex schemas, migrations, data mappers, or cryptic APIs. Scriba turns every database row into a **live object**: accessing a property loads it lazily, updating it writes to the database instantly, and relations behave like native properties.

Scriba is not just an ORM — it is the **easiest and most intuitive persistence layer you can use in JavaScript.**

---

## 🚀 Features

* **Zero Learning Curve**
  You work with normal JS objects. No `.save()`, `.update()`, `.populate()`, `.from()`, or `.select()`.

* **Auto-Persisting Objects**
  Assigning a property automatically updates SQLite:

  ```js
  user.name = "Alice"; // Writes instantly to DB
  ```

* **Lazy Loading**
  Accessing a field loads it on demand:

  ```js
  user = User[3]; // Auto SELECT * WHERE id = 3
  ```

* **Reactive Records**
  Subscribe to live updates:

  ```js
  user.subscribe(u => console.log("Updated:", u));
  ```

* **1:N and N:N Relations Automatically Resolved**
  If your schema defines relations, you get:

  ```js
  user.posts;  // Auto SELECT posts
  user.roles;  // Auto SELECT through join table
  ```

* **Type-Aware Fields**
  JSON → JS object
  datetime → Date instance
  boolean → native boolean

* **Hot Schema Reload (with auto-migrations)**
  Update your `.scriba` schema file and watch your tables update automatically.

* **Multi-Tenant by Design**
  Each tenant gets its own isolated SQLite database and schema.

---

## 📦 Installation

```bash
npm install scriba
```

*(or whatever your real package name will be)*

---

## 🧠 How It Works

Scriba uses four core abstractions:

### `Scriba`

Multi-tenant manager, schema loader, table initializer.

### `TenantProxy`

Gives easy access to entities inside a tenant.

### `TableProxy`

Represents a database table.
Responsible for:

* lazy loading
* record caching
* inserts
* queries
* relation metadata

### `RecordProxy`

Represents a single record.
Through a JavaScript `Proxy`, it intercepts:

* `get` → loads relations, parses types, returns cached values
* `set` → normalizes, auto-updates SQLite, notifies subscribers, invalidates caches

---

## 🧩 Basic Usage

### 1. Initialize Scriba

```js
import Scriba from "scriba";

const scriba = new Scriba([
  { id: "app", path: "./app.db", schema: "./schema.scriba" }
]);
```

---

### 2. Define a Schema (`schema.scriba`)

```
model User {
  id int
  name text
  age int
}

model Post {
  id int
  userId int
  title text
  content text
}
```

Scriba automatically:

* creates tables if they don’t exist
* adds missing columns
* reloads when the file changes

---

### 3. Insert Data

```js
const tenant = scriba.tenant("app");
const User = tenant.entity("User");

const alice = await User.push({
  name: "Alice",
  age: 25
});
```

---

### 4. Fetch Data (lazy)

```js
const u = User[1]; // Auto SELECT

console.log(u.name);
```

---

### 5. Auto-Saving

```js
u.age = 26; 
// Immediately: UPDATE User SET age = 26 WHERE id = 1
```

---

### 6. Relations (zero configuration)

If the schema contains something like `userId`, Scriba exposes:

```js
u.posts;  
// SELECT * FROM Post WHERE userId = u.id
```

---

### 7. Reactive Subscriptions

```js
u.subscribe(user => {
  console.log("User updated:", user);
});
```

Now any assignment triggers the subscriber.

---

## 🔥 Example: Many-to-Many

Assume the schema:

```
model User {
  id int
  name text
}

model Role {
  id int
  label text
}

model UserRole {
  userId int
  roleId int
}
```

Scriba detects `User ↔ Role` via `UserRole`.

Then you get:

```js
user.roles; // Auto SELECT through join table
```

---

## 📊 Querying

Simple, expressive:

```js
User.query(
  { age: { $gt: 18 } },
  { sort: "age DESC", limit: 10 }
);
```

Returns real `RecordProxy` instances.

---

## ❤️ Why Scriba?

While traditional ORMs (Prisma, Sequelize, Drizzle) require learning large APIs or DSLs, Scriba has one goal:

> **Make database persistence feel like normal JavaScript.**

* No `.save()`
* No `.update()`
* No `.populate()`
* No decorators, models, or classes
* No migrations to write manually

Just:

```js
const tenant = scribe.tentant("database");
const user = tenant.entity("User");

user[1].name = "New Name";

console.log(user.posts);

```

If you know JavaScript, you already know Scriba.

---

## 📄 License

MIT
Use freely, modify freely.
## Registros encontrados no código

Não foram encontrados registros declarativos nesse formato; consulte a entrada e os exports do pacote.

A lista é um inventário estático e pode incluir registros em testes; não garante disponibilidade sem os provedores do host.

Há imports relativos para diretórios superiores. A instalação isolada e a composição por perfil precisam resolver esses vínculos antes de remover a cópia da base.

