import * as navigationPreload from "workbox-navigation-preload";
import {registerRoute, NavigationRoute} from "workbox-routing";
import {NetworkOnly} from "workbox-strategies";

// This console.log is partially for debugging reasons
// (yes, on producion, the build version isn't really sensitive)
// and it's a good practice to have at least a bit that's
// changing in the service worker file so it get's
// reinstalled properly.
console.log(`SW v${__BUILD_VERSION__}`);

// There's a Workbox build error if `self.__WB_MANIFEST`:
self.__WB_MANIFEST;
// is not present in the SW file, hence this comment :D

// To skip the `waiting` step in the service worker lifecycle:
// installing -> waiting -> activated -> redundant
self.skipWaiting();

// The name of the entry in the Cache Storage
// in the Application dev tool tab.
const CACHE_NAME = "offline-html";

// This assumes /offline.html is a URL for your self-contained
// (no external images or styles) offline page.
const FALLBACK_HTML_URL = "/offline.html";

// Populate the cache with the offline HTML page when the
// service worker is installed.
self.addEventListener("install", async event => {
	event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.add(FALLBACK_HTML_URL)));
});

navigationPreload.enable();

const networkOnly = new NetworkOnly();

const navigationHandler = async params => {
	try {
		// Attempt a network request.
		return await networkOnly.handle(params);
	} catch (error) {
		// If it fails, return the cached HTML.
		return caches.match(FALLBACK_HTML_URL, {
			cacheName: CACHE_NAME,
		});
	}
};

// Register this strategy to handle all navigations.
registerRoute(new NavigationRoute(navigationHandler));
