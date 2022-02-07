---
title: Search for failures in bootstrapper log
queries:
  - grep bootstrapper log
---

```bash
grep -m1 failed=1 -B20 /root/apnscp-bootstrapper.log
```
