# the cache stack

- pages loads should never ever wait for data
- rely on the nextjs http cache instead of fetching data
  - use tags and revalidate when needed instead
- first load for a particular user will need suspense for data

perhaps use parallel-routes instead when it makes sense, but its literally the same thing as Suspense but with fallback=loading.tsx

## notifications:

Firebase cloud messaging setup:

- https://firebase.google.com/docs/cloud-messaging/js/client
- fcm service if apparently 0 cost
- (GCM, google cloud messaging is deprecated)

# random notes

try to make user always hit cached data

search? https://github.com/nextapps-de/flexsearch

need notifications, pwa / service-worker probably
https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Re-engageable_Notifications_Push
does this work on a phone? yes it triggers the OS native notification system... but not on iOS??
https://github.com/GoogleChrome/samples/tree/gh-pages/push-messaging-and-notifications

so those are all old and archived ish info.. in 2023, this is the way?: https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#notification

https://github.com/GoogleChrome/samples/tree/gh-pages/push-messaging-and-notifications

google sais GCM (Google Cloud Messaging) is deprecated
use FCM instead https://firebase.google.com/docs/cloud-messaging/messages#notification
which is the same thing but via firebase

man... maybe just roll my own with VAPID keys instead?
https://blog.mozilla.org/services/2016/08/23/sending-vapid-identified-webpush-notifications-via-mozillas-push-service/

## rsc input type datetime-local

since the date in a datetime-local can not include timezone info, aka does not include all info required for a universal date... how to know the real date to save to db?
perhaps send a an extra date.getTimezoneOffset() string along with the formData? that would atleast allow server to know the real date...
`<input type="hidden" name="tz" defaultValue={d.getTimezoneOffset()} />`
ok that worked.. it this really the developer experience with date inputs in 2023? sigh

## TODO

figure out how notifications work

- [x] separate package for building `sw.js` (0 dependency, single file)
- [x] api for `firebase-admin/messaging` for sending notifications
- [x] initialize `sw.js` and `firebase/messaging` client side
- [x] allow user to "join" to events
- [x] prompt for "alert me" on some button click, perhaps when joining an event
- [x] store fcmToken in db after user allows notifications
- [ ] send a notification to all users that are "attending" to a particular event id when its updated
- [x] send a notification to everyone that follows a user when that user howls
- [x] test notifications when app is open (in foreground), perhaps show toast or something
  - handle in js with onMessage from "firebase/messaging"
- [x] test notifications when app is not open (in background)
  - ~~handle with onBackgroundMessage in sw.js~~
  - actually, the onBackgroundMessage is for special handling of "data messages". Regular "notification messages" work normally by just instantiating firebase/messaging.

more

- [ ] seems like a user doesnt save the fcmToken do db the first time? eg if signing in and enabling notifications?
  - investigate
  - welp it does...

other

- server actions are... not the best developer experience currently
  - stay with cache stack for server components
  - go with trpc api for client components but populate initial value from nextjs fetch cache
  - main idea is pretty much to avoid real database query on page visit, will often result in force dynamic server components though since reading from cookie
