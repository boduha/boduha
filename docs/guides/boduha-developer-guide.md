# Project boduha Developer Guide

2026-04-03

<https://github.com/boduha>

## 1. Overview

This project is a **monorepo** containing:

* `client/` → Frontend (React + Vite)
* `server/` → Backend (Spring Boot)

The application is split into two parts:

* The **server** provides data (e.g., Question 42)
* The **client** consumes and displays that data

---

## 2. Working in GitHub Codespaces

Open the repository in **GitHub Codespaces**.

👉 Always open the **root folder** of the project, not just `client/` or `server/`.

You will typically use:

* **One terminal for the server**
* **One terminal for the client**

---

## 3. Running the Server (Spring Boot)

Open a terminal:

```bash
cd server
chmod +x mvnw
./mvnw spring-boot:run
```

Expected result:

* The server starts on port `8080`
* You should see logs indicating Spring Boot started successfully

### Test the server

Open the forwarded port (see section 5) and access:

```text
/question/42
```

Example response:

```json
{
  "id": 42,
  "statement": "Convert 42 to binary",
  "value": 42,
  "expectedAnswer": "101010"
}
```

---

## 4. Running the Client (React + Vite)

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Expected result:

* Vite dev server starts (usually port `5173`)
* A URL will be available in the **PORTS** tab

---

## 5. Ports in Codespaces

In GitHub Codespaces:

* Open the **PORTS** tab
* You should see:

  * `8080` → server
  * `5173` (or similar) → client

### Open in browser

Click:

```text
Open in Browser
```

### Share publicly (for demos)

1. Go to **PORTS**
2. Select a port (e.g., 8080)
3. Change visibility:

   * `Private` → `Public`
4. Copy the URL

⚠️ Do NOT use `localhost` in Codespaces
Always use the forwarded URL.

---

## 6. Server Entry Points

Useful URLs:

* `/` → (optional landing page)
* `/question/42` → main endpoint
* `/swagger-ui.html` → API UI (if enabled)
* `/v3/api-docs` → OpenAPI JSON (if enabled)

---

## 7. Connecting Client to Server

### Same Codespace

Use the forwarded backend URL:

```text
https://<your-codespace>-8080.githubpreview.dev
```

---

### Using environment variable (recommended)

In `client/`, create a `.env` file:

```env
VITE_API_BASE_URL=https://<your-backend-url>
```

Then in the frontend code:

```js
const baseUrl = import.meta.env.VITE_API_BASE_URL;
```

---

### Different server (remote)

You can point the client to:

* another Codespace
* a deployed backend (Render, etc.)

Just change:

```env
VITE_API_BASE_URL=https://your-server.com
```

---

## 8. Development Workflow

Recommended order:

1. Start the **server**
2. Test `/question/42`
3. Start the **client**
4. Connect client → server

---

## 9. Troubleshooting

### Java in LightWeight Mode

* Run: `Java: Import Java Projects`
* Restart VS Code if needed

---

### Missing imports (Spring)

Check imports like:

```java
import org.springframework.web.bind.annotation.*;
```

---

### mvnw permission error

```bash
chmod +x mvnw
```

---

### Port not visible

* Check **PORTS** tab
* Add port manually if needed

---

### Backend not reachable

* Make sure server is running
* Use forwarded URL, not `localhost`

---

### npm issues

```bash
npm install
```

---

## 10. Key Principle

> The editor (VS Code) helps you write code.
> The terminal runs your application.

Use:

* `npm run dev` → client
* `./mvnw spring-boot:run` → server

---

## 11. Current Scope

This is an early stage of the project:

* One backend endpoint (`/question/42`)
* Simple client consumption
* No persistence
* No authentication

The goal is clarity, not completeness.

---
