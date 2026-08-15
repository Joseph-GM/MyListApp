# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This project is making mobile apps like to-to apps.
In this app, I'd like to make 3 screens. one is for to-do, other is for to-buy, last one is for to-go.
Each screen will have separate pages which have title, last modifying date and list of to-do, to-buy or to-go.
Especally, in to-go, there should be item for saving URL of location.

## Commands

```sh
npm start                    # start Metro dev server
npm run ios                  # build & run on iOS simulator
npm run android               # build & run on Android emulator
npm test                     # run all Jest tests
npx jest __tests__/App.test.tsx   # run a single test file
npx jest -t "renders correctly"   # run a single test by name
npm run lint                 # ESLint (@react-native config)
npx prettier --write .       # format (singleQuote, trailingComma: all, arrowParens: avoid)
```

iOS native deps use CocoaPods via Bundler:

```sh
bundle install               # first time only
bundle exec pod install      # after any native dependency change
```

**Node version gotcha**: the machine's default `node`/`npm` (checked via `which node`) can be a very old v14/npm6 that silently breaks RN CLI tooling — e.g. `npx react-native config` returns an empty dependency list under it, so `pod install` won't autolink any native module and `npm install` can rewrite `package-lock.json` wholesale into a different format. If autolinking or a fresh `npm install` misbehaves, switch to a modern Node first (this repo has been driven with `nvm use 20.18.1`) before running CLI/pod commands.

## Architecture

This is a React Native CLI app (TypeScript, RN 0.86, React 19) implementing three independent tabs — To-Do, To-Buy, To-Go. Each tab is two levels deep: a list of **pages** (title + last-modified date), and inside a page, a list of **items**. There is no backend; all data is persisted locally via AsyncStorage.

**Data model**: `src/types/index.ts` defines `ListPage` (`id`, `title`, `createdAt`, `updatedAt`, `items: ListItem[]`) and `ListItem` (`id`, `title`, optional `url`, `createdAt`, `updatedAt`). A page's `updatedAt` bumps whenever the page itself or any item inside it changes — that's the "last modifying date" shown in the page row.

**Data flow**: `src/hooks/usePages.ts` is the single source of truth for a tab's state. Each screen calls `usePages(listKey)` where `listKey: ListKey` (`'todo' | 'buy' | 'go'`). The hook loads pages from `src/storage/storage.ts` on mount (key `@my_list_app:v2:<listKey>` in AsyncStorage — versioned because the stored shape changed from a flat `ListItem[]` to `ListPage[]`), keeps them sorted by `updatedAt` descending, and exposes `addPage`/`updatePage`/`deletePage` plus page-scoped `addItem`/`updateItem`/`deleteItem` (each takes a `pageId`). Every call re-persists the full `ListPage[]` array (no partial/diff writes). There's no cross-tab or global state.

**Screens are thin wrappers over one generic UI**: despite its filename, `src/screens/TodoScreen.tsx` exports `GenericListScreen`, driven by `usePages`. It holds `selectedPageId` in local state: with no page selected it renders the page list (FlatList of `ListPageRow` + FAB that creates a new page); with a page selected it renders that page's item list (FlatList of `ListItemRow` + back button + FAB that adds an item) instead of pushing a new route. `TodoWrapper.tsx` and `BuyScreen.tsx` are just `GenericListScreen` configured with `listKey="todo"`/`"buy"` and localized empty-state text for both levels. `GoScreen.tsx` duplicates this same two-level structure directly (rather than reusing `GenericListScreen`) because its item level needs the extra URL field (`showUrlField`) for map links — when changing shared behavior (e.g. FAB, empty state, delete swipe, back header), check both `GenericListScreen` and `GoScreen` since they've diverged.

**Shared components**: `ListItemRow` (`src/components/ListItem.tsx`) renders one item row, `ListPageRow` (`src/components/ListPageRow.tsx`) renders one page row (title + item count + formatted last-modified date) — both wrapped in `Swipeable` from `react-native-gesture-handler/ReanimatedSwipeable` (the plain `Swipeable` export was removed from the package's main entry in gesture-handler v3) with a right-swipe delete action; `ListItemRow` also opens `item.url` via `Linking` when present (used only by the Go list). `AddItemModal` is the shared add/edit form, reused for both creating/renaming a page (title only) and creating/editing an item (title, plus URL via `showUrlField`); edit vs. add is determined by whether `initialTitle`/`initialUrl` are passed in.

**Navigation**: `App.tsx` wraps everything in `GestureHandlerRootView` → `SafeAreaProvider` → `TabNavigator` (`src/navigation/TabNavigator.tsx`). `GestureHandlerRootView` is required at the root or any `Swipeable`/`GestureDetector` throws at render time. `TabNavigator` is a small hand-rolled tab bar (local `useState` + conditional render of the active screen) — **not** `@react-navigation/*`; `createMaterialTopTabNavigator` (react-native-pager-view-based) was replaced here because tab switching was unreliable. `@react-navigation/*`, `react-native-tab-view`, and `react-native-pager-view` are still installed but unused — safe to remove later, but leaving them avoids an extra native unlink/pod-install cycle. `import 'react-native-gesture-handler'` must stay the first line of `App.tsx` (required by that library), and the Reanimated/worklets babel plugin (`babel.config.js`) is required for `react-native-gesture-handler`/`react-native-reanimated` to work.

**Localization note**: UI strings and several code comments are in Korean (e.g. empty-state text, modal labels, date format `YYYY.MM.DD HH:mm`). Match this convention for any new user-facing strings in these screens/components unless told otherwise.
