# Next.js backend

1. Install dependencies: `npm install`
2. Copy `.env.local.example` to `.env.local` and set `MONGODB_URI` to an Atlas
   connection string. `CORS_ORIGIN` defaults to the React app at port 5173. Do
   not commit `.env.local`.
3. Start the server: `npm run dev`

Routes:

- `GET /api/hello` returns `{ "message": "Hello from the Next.js API!" }`.
- `GET /api/mongo_test` lazily connects to MongoDB and returns up to ten
  documents from `sample_mflix.comments`.
- `GET /api/item` returns items where `status` is not `"DELETED"`.
- `POST /api/item` creates a new active item.
- `GET /api/item/:item_id` returns one non-deleted item.
- `PUT /api/item/:item_id` updates one non-deleted item.
- `DELETE /api/item/:item_id` soft deletes an item by setting
  `status: "DELETED"` and `deletedAt`.
