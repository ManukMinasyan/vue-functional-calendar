---
title: "Contributing"
description: "Report bugs, propose changes and run the project locally."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/community/contributing"
---
# Contributing

> Report bugs, propose changes and run the project locally.

Bug reports, fixes and ideas are welcome. Open an [issue](https://github.com/ManukMinasyan/vue-functional-calendar/issues) or a pull request against the `3.x` branch.

## Set up

```bash
git clone https://github.com/ManukMinasyan/vue-functional-calendar.git
cd vue-functional-calendar
git checkout 3.x
npm ci
```

## Scripts

<table>
<thead>
  <tr>
    <th>
      Command
    </th>
    
    <th>
      What it does
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        npm run dev
      </code>
    </td>
    
    <td>
      Starts the internal test page from <code>
        src/Demo.vue
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        npm test
      </code>
    </td>
    
    <td>
      Runs the Vitest suite.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        npm run lint
      </code>
    </td>
    
    <td>
      Runs ESLint over <code>
        src
      </code>
      
      , <code>
        tests
      </code>
      
       and <code>
        index.js
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        npx prettier --check src tests index.js
      </code>
    </td>
    
    <td>
      Checks formatting.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        npm run build
      </code>
    </td>
    
    <td>
      Builds <code>
        dist/
      </code>
      
       for ESM, CJS and UMD, plus <code>
        style.css
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        npm run docs:dev
      </code>
    </td>
    
    <td>
      Runs this documentation site.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        npm run docs:build
      </code>
    </td>
    
    <td>
      Builds this documentation site.
    </td>
  </tr>
</tbody>
</table>

The documentation site imports the calendar from the repository source, so every demo runs the current code.

## Pull requests

1. Branch from `3.x`.
2. Add tests for new behavior.
3. Update the documentation if you change a prop, event or slot.
4. Make sure the tests and the linter pass.

## Style

Two spaces, no semicolons and single quotes. Prettier enforces it with the `.prettierrc` in the repository.

## Reporting bugs

A good report has a short summary, steps to reproduce, what you expected, what happened, and a minimal example if you can. You can use the [playground](https://manukminasyan.github.io/vue-functional-calendar/playground) to find the props that trigger the bug.

## License

By contributing, you agree that your contributions are licensed under the MIT License.


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
