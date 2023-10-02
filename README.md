# howler-webapp

https://howler.andyfx.net

#### random notes / todo

- use the nextjs http cache for any SELECT queries (GET requests)
  - revalidateTag when needed
  - POST requests for mutations.
- page loads should never wait for data

  - pretty much every page will need to be dynamic though for user status.
  - use suspense (or loading.tsx which is same thing)

- can register the app as file handler
  - https://developer.mozilla.org/en-US/docs/Web/Manifest/file_handlers
  - perhaps allow create event directly from image
- custom og image
- multiple event images
