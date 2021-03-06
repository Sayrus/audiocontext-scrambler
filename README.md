# AudioContext Scrambler

Protects you against AudioContext fingerprinting by adding random noise.

## What is AudioContext Fingerprinting


## Installation

### From the store

As any addons, navigate to its [store page](https://addons.mozilla.org/en-US/firefox/addon/audiocontext-scrambler/)
and click `Install`.

### From releases

1. Download the XPI file from Github Releases
2. Navigate to about:addons
3. Install Add-on from file
4. Select the XPI file

#### Build it myself

Use `make release` to create the same XPI file as releases

## Difference with the existing AudioContext Fingerprint Defender

While the prupose is the same, this extension fixes several problems I had with
AFD :
- AFD inject code in the page as a script element
- AFD then inject code in iframes if the document doesn't contain the attribute
  `data-acxscriptallow`

This extension uses `exportFunction`. This means that the DOM is not modified.
Unlike AFD, this extension cannot be blocked by setting CSP to `unsafe-inline`
or presetting `data-acxscriptallow` and using iframes.

Finally, this extension has a Github repository so that everyone can participate
and improve it.

## Support

This extension currently only support Firefox and Firefox for Android.

## What's next?

- Support Chromium (Requires injecting JavaScript into the page instead of using
  `exportFunction`.)
- Configurable noise amplitude
- Use the allowlist to create a `RequestFilter` that filters out allowed pages

## Articles

- [sayr.us: AudioContext Fingerprinting - An explanation of why this add-on exists](https://sayr.us/privacy/audiocontext-fingerprinting/)
