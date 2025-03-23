The chrome extenstion repo for grizzhack 2025

steps to get extension

1. click the puzzle button in chrome for extensions
2. Manage Extensions
3. turn on Developer Mode
4. Load unpacked
   4-1. select the folder with the manifest.json and the other included files

option 1 for popup (use this method)

1. add to manifest.json
   "background": {
   "service_worker": "background.js"
   },

2. rename files in background.js to
   files: ["content2.js"],

option 2 for popup (this methods doesn't work anymore)

1. add to "action": in manifest.json:
   ,
   "default_popup": "popup1.html"

2. (optional) delete from manifest.json
   "background": {
   "service_worker": "background.js"
   },




in the "action":
"default_popup": "the-popup.html",
"default_popup": "popup1.html",

in the main manifest.json
"background": {
"service_worker": "background.js"
},

in the "content_scripts":
"js": ["background-content.js"]
