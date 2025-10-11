# Security Policy

## Overview

Print.js takes security seriously. This document outlines security considerations when using Print.js and how to report vulnerabilities.

## Security Considerations

### URL Validation

Print.js validates all URLs to prevent security issues:

- **PDF URLs**: Only `http:`, `https:`, `blob:`, and `data:application/pdf` protocols are allowed
- **CSS URLs**: Only `http:` and `https:` protocols are allowed for external stylesheets
- **Window URLs**: Only `http:`, `https:`, and `data:application/pdf` are allowed for `window.open()`

Protocol-relative URLs (`//example.com`) are rejected to prevent protocol confusion attacks.

### Content Security Policy (CSP)

If your application uses Content Security Policy, you may need to adjust your policy to allow Print.js to function:

```
Content-Security-Policy:
  default-src 'self';
  frame-src 'self' blob:;
  style-src 'self' 'unsafe-inline';
  script-src 'self';
```

Key directives:
- `frame-src blob:` - Required for PDF printing (Print.js creates blob URLs)
- `style-src 'unsafe-inline'` - Required for dynamic styling (if using `style` parameter)

## Reporting a Vulnerability

If you discover a security vulnerability in Print.js, please report it by:

1. **DO NOT** open a public GitHub issue
2. Email the maintainers with details about the vulnerability
3. Include steps to reproduce, impact assessment, and any suggested fixes

We aim to respond to security reports within 48 hours and will work with you to understand and address the issue promptly.

## Known Limitations

- Print.js uses `innerHTML` in some areas for dynamic content rendering. Always sanitize user input before passing it to Print.js.
- PDF printing relies on the browser's PDF viewer capabilities and is subject to browser security policies.
- Internet Explorer is not fully supported due to security and compatibility limitations.
