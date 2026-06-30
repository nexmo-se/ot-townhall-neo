#!/bin/bash
set -e

# The compiled React frontend lives in backend/public/build/ as a pre-built artifact.
# Patch the bundle in-place to use SSE-only (idempotent: each patch is skipped if already applied).
echo "=== Patching frontend bundle (SSE-only) ==="
node - <<'NODE'
const fs = require('fs');
const dir = 'backend/public/build/static/js';
const bundleFile = fs.readdirSync(dir).find(f => f.startsWith('main.') && f.endsWith('.chunk.js') && !f.endsWith('.map'));
if (!bundleFile) { console.log('No main bundle found, skipping patch'); process.exit(0); }
const BUNDLE = dir + '/' + bundleFile;
let js = fs.readFileSync(BUNDLE, 'utf8');
let changes = 0;
function replace(label, from, to) {
  const count = js.split(from).length - 1;
  if (count === 0) { console.log('SKIP [' + label + ']: already applied'); return; }
  js = js.split(from).join(to);
  changes++;
  console.log('OK [' + label + ']: replaced ' + count);
}
const siBlock = 'var t=setInterval((function(){xn.fetchQuestions(e).then((function(e){var t=e.map((function(e){var t=new d({name:e.owner.name,role:e.owner.role});return t.id=e.owner.id,new hn({id:e.id,owner:t,content:e.content,vote:e.vote,voters:e.voters,status:e.status})}));t.sort((function(e,t){return t.vote-e.vote})),a(t)})).catch(console.error)}),5e3),n=xn.subscribe';
replace('question setInterval', siBlock, 'var n=xn.subscribe');
replace('question clearInterval', 'clearInterval(t),n()', 'n()');
const pollContextRetrieve = 'l=r.a.useCallback(Object(w.a)(y.a.mark((function e(){var t;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,H.retrieve({sessionID:s.id});case 3:t=e.sent,c(t),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),c(void 0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])}))),[s]);function u()';
const pollContextSSE = 'l=r.a.useCallback((function(){return Promise.resolve()}),[s]);r.a.useEffect((function(){if(s){var e=new EventSource("".concat(B.apiURL,"/pollings/stream?session_id=").concat(s.id));e.onmessage=function(t){try{var a=JSON.parse(t.data);c(a&&a.length>0?M.fromResponse(a[0]):void 0)}catch(n){}};e.onerror=function(){};return function(){e.close()}}}),[s]);function u()';
replace('PollingContext SSE', pollContextRetrieve, pollContextSSE);
replace('PollingPanel remove k,S+initial fetch', 'var k=r.a.useCallback((function(){Lt.fetch(g,a)}),[g]),S=r.a.useCallback((function(){Lt.fetch(g,a)}),[g]);return r.a.useEffect((function(){b&&Lt.fetch(g,a)}),[b,g]),', 'return ');
replace('PollingPanel remove signal useEffect', 'r.a.useEffect((function(){return b&&b.on("signal:start-polling",k),b&&b.on("signal:stop-polling",S),function(){b&&b.off("signal:start-polling",k),b&&b.off("signal:stop-polling",S)}}),[b,k,S]),', '');
replace('ViewPoll remove initial fetch', 'r.a.useEffect((function(){O&&Lt.fetch(m,c)}),[O,m]),i?', 'i?');
replace('ModeratorPolling loading=false', 'var vr=function(e){var t=e.refresh,n=r.a.useState(!0),', 'var vr=function(e){var t=e.refresh,n=r.a.useState(!1),');
replace('ModeratorPolling remove fetch', 'return r.a.useEffect((function(){s&&Lt.fetch(f,c)}),[s,f,t]),', 'return ');
if (changes > 0) fs.writeFileSync(BUNDLE, js);
console.log('Done. ' + changes + ' patch(es) applied.');
NODE

echo "=== Building backend ==="
cd backend
yarn install --production=false
node_modules/.bin/rimraf ./build
node_modules/.bin/tsc
# Copy certs only if they exist
if [ -d "./src/certs" ]; then
  mkdir -p ./build/certs && cp -a ./src/certs/. ./build/certs/
fi
# Keep only production dependencies for runtime image.
npm prune --omit=dev
cd ..

echo "=== Build complete ==="
