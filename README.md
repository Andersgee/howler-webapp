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
