# Morrow Store

A two-page shop backed by a MongoDB product catalog. Products are fetched from the Node API; the browser stores the shopping bag locally.

## Run locally

Requirements: Node.js and a MongoDB connection string (local MongoDB or MongoDB Atlas).

Open two terminals in this `admin_panel` project folder.

1. In `server`, create `.env` from `.env.example` and set `MONGODB_URI`.
2. In the first terminal, install and start the API:

	```sh
	cd server
	npm install
	npm run dev
	```

	The API seeds six sample products when it connects to an empty database.
3. In the second terminal, install and start the frontend from `admin_panel`:

	```sh
	npm install
	npm run dev
	```

4. Open the Vite URL shown in the terminal. Vite proxies `/api` to the API on port 5000.

The product endpoint is `GET /api/products`. The cart has quantity controls and is saved in browser storage; checkout is not included.

---


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
