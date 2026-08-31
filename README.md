# Response-Able Solutions Website Demo

Private redesign concept for Response-Able Solutions Ltd.

Step 2 contains the React, TypeScript and Vite foundation. It includes the
brand system, reusable header and footer, responsive navigation and a temporary
foundation page. No production systems, customer records or company accounts
are connected.

## Open the project in VS Code

1. Extract the ZIP.
2. Open VS Code.
3. Select **File > Open Folder**.
4. Select the extracted `response-able-demo` folder.
5. Select **Terminal > New Terminal**.
6. Run:

```bash
npm install
npm run dev
```

7. Hold `Ctrl` and click the local address shown in the terminal.

## Stop the local website

Click inside the terminal and press `Ctrl + C`.

## Main project files

```text
src/
  App.tsx                Current page content
  main.tsx               React entry point
  styles.css             Brand, layout and responsive rules
  components/
    BrandMark.tsx        Reusable logo and company name
    SiteHeader.tsx       Desktop and mobile navigation
    SiteFooter.tsx       Reusable footer
  data/
    site.ts              Navigation and public contact details

public/brand/
  ras-mark.jpg           Temporary logo from the supplied calculator
```

## Useful commands

```bash
npm run dev
npm run build
npm run preview
```

Use Node.js 22 or newer.
