# the cache stack

pages loads should never ever hit db
also they should not ship js either, if possible

do parallel-routes for 'joinbutton' etc that needs auth state (either from servercomp or clientcomp)
https://nextjs.org/docs/app/building-your-application/routing/parallel-routes

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

## parallel routes
