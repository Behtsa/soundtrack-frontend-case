# Soundtrack Interview Case

This is the Soundtrack interview case for frontend developers. Your task is to implement a search page, with as many features, bells, and whistles as you like and have time for.

The case relies on a number of libraries and tools used at Soundtrack to help you quickly get started:

- [Vite](https://vite.dev/) - Build tooling and bundler, comes with [many features](https://vite.dev/guide/features.html) you can optionally enable (such as SCSS/LESS support)
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [React](https://react.dev/) - Library which we build user interfaces with
- [GraphQL](https://graphql.org/) - Our public APIs are almost exclusively accessed through GraphQL
- [urql](https://github.com/urql-graphql/urql) - Lightweight GraphQL JavaScript client
- [gql.tada](https://github.com/0no-co/gql.tada) - Provides TypeScript types for GraphQL queries and documents
- [wouter](https://github.com/molefrog/wouter) - Minimal routing library for React

Feel free to access the [Soundtrack API Playground](https://api.soundtrackyourbrand.com/v2/explore)
if you want to quickly explore the API - a lot of queries can be done without authentication.
We also provide additional [GraphQL API docs](https://api.soundtrackyourbrand.com/v2/docs) -
including some information about how to authenticate if you really want to go
wild, but this is usually more work than what we expect from your project.

If you try deploying the app to a domain you'll likely encounter
[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) errors when
attempting to access our APIs. This is expected - as long as you (and we) can
run the app locally you're good to go.

## Getting started

```sh
cd soundtrack-frontend-case
npm install
npm start
```

**App entry point: [src/app/App.tsx](src/app/App.tsx).**

## VS Code

If you use VS Code, make sure to allow using the workspace TypeScript version when prompted, as this is needed for `gql.tada`.
Check [the `gql.tada` documentation](https://gql-tada.0no.co/get-started/) if you run into issues.

We also provide a list of [recommended VS Code extensions](.vscode/extensions.json) which should improve your workflow, including providing intellisense for GraphQL queries.

## Ideas for what to do

- [ ] Add some style, preferably without integrating an entire CSS framework
- [ ] Make the page responsive
- [ ] Make the layout less vertical, for example by using grids or carousels
- [ ] Break up relevant markup into separate React components
- [ ] Replace existing markup as you see fit
- [ ] Loading state - show indicators, result "skeletons", etc.
- [ ] Fade in images and/or provide placeholder/fallback while an image is loading (`display.colors.*` can be used for this)
- [ ] Add "search as you type" functionality, while avoiding hitting the API too hard
- [ ] Highlight active tab
- [ ] Customize how each item type is rendered, such as making artists show up with a rounded image, displaying short descriptions for items that have them, etc.
- [ ] Render results in the tabs other than "all" as a grid instead of list
- [ ] Implement pagination (`sections` and `sections.edges.node.items` can both be paginated separately), either as infinite scroll or a manual "show more" button
- [ ] Utilize any other data available - the data that's already fetched are good starting points
- [ ] Add separate route(s) that allow the user to view details for individual items, such as playlists
- [ ] Keep track of recent searches and render those as a list in the `recent-searches` section of the search landing page
- [ ] Cache search queries/results to make returning to previously visited pages faster

But don't let these suggestions limit you! Feel free to get creative with the data available via the GraphQL API and make something cool.
