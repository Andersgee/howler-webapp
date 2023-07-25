# howler-webapp

## random notes

- the cache stack?
- use the nextjs http cache for any SELECT queries (GET requests)
  - revalidateTag when needed
  - POST requests for mutations.
- page loads should never wait for data
  - pretty much every page will need to be dynamic though for user status.
  - use suspense (or loading.tsx which is same thing)
