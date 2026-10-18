Treetoy is a JavaScript library and sample web page for an easily embeddable, interactive binary search tree.

The developer can create the tree element on their HTML page with the following parameters, which users can then modify and perform searches on. Those operations proceed step by step, displaying a log of action descriptions as well as the graphical steps.

1. Initial tree values...
The `build_tree` function reconstructs a binary tree from a level-order (breadth-first) serialized array (e.g., `[1, 2, 3, null, 4]`).
The user can pass `null` instead of an array to get an empty tree.
2. Tree type. All three types are binary search trees with minor differences in how search is done:
  a. Default (3-way): In this tree, searches are done in the conventional way. The search checks for less than, equal to, or greater than, and moves to the next node (left or right) or returns `true` if found. It returns `false` at the null leaf.
  b. Sentinel: In this mode, a sentinel node is inserted at all the leaves as the tree is built. When the user searches for a key, the sentinel nodes are assigned that value. Now the search log does not show null checks because it can skip them; instead, when it finds the search key, it returns `true` unless the node is the sentinel, in which case it returns `false`.
  c. Two-way: In the two-way search, we display a candidate node which starts as `null`. As the search progresses, we check only less than at each step. If the search key is less than the current node, then we go left. If it is >=, then we go right, but we also store the current key value as the candidate. At the end of the tree (when we hit null), we can check if the candidate is the search key or not.
3. Search key. The key to search for. When this is set, the first animation will show searching for this key.

We should have functions that can be called programmatically to add elements to the tree. 

The library can be used in two ways. The main goal is to put it into the web page, which is a blog about BST search; therefore, the developer specifies the parameters above and the search animates. For user experience, we should add a play button and a reset button. We also want a hideable log of actions in addition to animating the search. 

The output we are looking for is a sample web page with an example of each search type on the same tree values. 

Another sample web page should provide a full interactive version with input elements for the parameters so a user can play with and test the library.
