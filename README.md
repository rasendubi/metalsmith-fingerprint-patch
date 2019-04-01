# metalsmith-fingerprint-patch

Patch html files after assets fingerprinting.

## Usage

### Javascript API

```javascript
const metalsmith = require('metalsmith');
const fingerprint = require('metalsmith-fingerprint');
const fingerprintPatch = require('metalsmith-fingerprint-patch');

metalsmith(__dirname)
  .use(fingerprint({
    pattern: 'assets/**',
  }))
  .use(fingerprintPatch())
  .build();
```
