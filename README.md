# Treetoy

An easily embeddable, interactive JavaScript library for visualizing Binary Search Trees (BST) with step-by-step animations and multiple search strategies.

Designed for blog posts, educational materials, and technical documentation, **Treetoy** renders interactive SVG trees with dedicated playback controls, animated state transitions, and collapsible action logs detailing every decision and pointer movement.

---

## Features

- **Three Distinct Search Algorithms**:
  - **Default (3-Way)**: Traditional BST search testing less-than, equal, or greater-than (`<`, `==`, `>`) at each node, checking for null at leaves.
  - **Sentinel Search**: Inserts sentinel nodes at every leaf position and assigns them the search key, eliminating null checks during traversal.
  - **Two-Way (Candidate-Based)**: Traverses with only a single strict less-than (`<`) test per node, tracking a *candidate* pointer whenever `target >= current.val`, deferring equality verification until a leaf is reached.
- **Level-Order Array Reconstitution**: Construct trees directly from standard level-order (breadth-first) serialized arrays (e.g. `[8, 4, 12, 2, 6, 10, 14]`, including arrays with `null` gaps). Supports empty trees with `[]` or `null`.
- **Strict Set Membership**: Rejects duplicate keys with informative errors upon construction and insertion, matching the semantics of a set member test.
- **Programmatic Manipulation**: Add nodes on the fly with `tree.insert(value)`, rebuild trees with `tree.setTreeValues(...)`, or switch search algorithms dynamically.
- **Full Playback Engine**: Play, pause, step forward, step backward, seek, reset, and configurable playback speed (0.5x to 2x).
- **Collapsible Action Log**: Real-time narrative step log explaining each comparison, branch decision, and state change.
- **Zero Runtime Dependencies**: Written in pure ES Modules with clean SVG rendering and CSS styling.

---

## Demos

Treetoy includes two sample pages out of the box:

1. **Algorithm Comparison Demo (`examples/comparison.html`)**:
   A blog-style article showing all three search strategies (3-Way, Sentinel, and Two-Way) running side-by-side on identical tree values with independent controls—ideal for video walkthroughs and technical articles.
2. **Interactive Playground (`examples/playground.html`)**:
   A sandbox to experiment with custom level-order arrays, presets, programmatic node insertion, algorithm switching, and search parameters.

---

## Running Locally

Clone the repository and install dev dependencies:

```bash
git clone https://github.com/justinhj/treetoy.git
cd treetoy
npm install
```

Start the local development server:

```bash
npm run dev
```

Open your browser to:
- Overview & Live Demo: [http://localhost:5173/](http://localhost:5173/)
- Comparison Demo: [http://localhost:5173/examples/comparison.html](http://localhost:5173/examples/comparison.html)
- Interactive Playground: [http://localhost:5173/examples/playground.html](http://localhost:5173/examples/playground.html)

### Running Tests & Building

Run the unit tests (Node.js native test runner):

```bash
npm test
```

Create production builds in `dist/`:

```bash
npm run build
```

---

## Embedding in a Web Page

### 1. Using ES Modules

Include the CSS stylesheet and import `TreeToy`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="path/to/treetoy.css">
</head>
<body>
  <!-- Container element for the tree widget -->
  <div id="tree-container"></div>

  <script type="module">
    import { TreeToy } from './path/to/treetoy.js';

    // Initialize an interactive BST
    const tree = TreeToy.create('#tree-container', {
      initialValues: [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15],
      treeType: 'default', // 'default' | 'sentinel' | 'two-way'
      searchKey: 6,
      showControls: true,
      showLog: true,
      logCollapsible: true,
      speed: 700
    });

    // Programmatic insertion (enforces unique keys)
    tree.insert(16);

    // Trigger an animated search
    tree.search(11, /* autoPlay */ true);
  </script>
</body>
</html>
```

### 2. Using UMD (Script Tag)

For non-module setups or older static site generators:

```html
<link rel="stylesheet" href="path/to/treetoy.css">
<div id="tree-container"></div>

<script src="path/to/treetoy.umd.cjs"></script>
<script>
  const tree = TreeToy.TreeToy.create('#tree-container', {
    initialValues: [10, 5, 15, 2, 7, 12, 20],
    treeType: 'two-way',
    searchKey: 7
  });
</script>
```

---

## Configuration Options

Pass these options to `TreeToy.create(target, options)`:

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `initialValues` | `Array<number\|null>\|null` | `[5, 3, 7, 1, 4, 6, 8]` | Level-order (breadth-first) serialized array or `null` for an empty tree. |
| `treeType` | `'default' \| 'sentinel' \| 'two-way'` | `'default'` | The BST search strategy to execute. |
| `searchKey` | `number \| null` | `null` | Initial key to search for on load. |
| `showControls`| `boolean` | `true` | Display playback bar (Play/Pause, Step, Reset, Speed). |
| `showLog` | `boolean` | `true` | Display the textual step-by-step action log. |
| `logCollapsible` | `boolean` | `true` | Allow users to expand/collapse the action log drawer. |
| `speed` | `number` | `700` | Animation delay in milliseconds per step. |
| `title` | `string \| null` | `null` | Custom title displayed in the header. |
| `autoPlay` | `boolean` | `false` | Automatically begin playback after initialization. |

---

## Instance Methods

Instances returned by `TreeToy.create()` provide programmatic control:

| Method | Description |
| :--- | :--- |
| `tree.insert(value)` | Programmatically inserts a number into the BST. Throws an error if the value already exists. |
| `tree.search(key, autoPlay = false)` | Prepares step-by-step search traces for `key` and optionally starts playback. |
| `tree.setTreeType(type)` | Changes algorithm (`'default'`, `'sentinel'`, `'two-way'`), reconfigures leaves, and recalculates steps. |
| `tree.setTreeValues(array)` | Reconstructs the tree with a new level-order array. |
| `tree.play()` | Starts or resumes animation playback. |
| `tree.pause()` | Pauses the ongoing animation. |
| `tree.stepForward()` | Advances one step forward in the search trace. |
| `tree.stepBackward()` | Steps one step backward. |
| `tree.reset()` | Resets the animation back to the initial state. |
| `tree.toggleLog(visible?)` | Toggles or sets the visibility of the action log. |

---

## Algorithm Comparison Reference

| Search Type | Branching per Node | Null Checks | Equality Testing |
| :--- | :--- | :--- | :--- |
| **Default (3-Way)** | 3-way (`<`, `==`, `>`) | Checked at every step/leaf | Checked at every visited node |
| **Sentinel** | 2-way (`<`, `>`) | **None** (sentinels eliminate null checks) | Checked against target or sentinel |
| **Two-Way** | 1-way (strict `<` only) | Traverses until leaf is reached | **Single test** at the end against candidate |

---

## License

MIT © [Justin Heyes-Jones](https://github.com/justinhj)
