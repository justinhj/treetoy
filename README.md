Treetoy is a Javascript library and sample web page for an easily embeddable interactive binary search tree.

The developer can create the tree element on their html page with the following parameters, that users than then modify and perform searches on and those operations go step by step, displaying a log of action descriptions as well as the graphical steps.

1. initial Tree values...
build_tree function reconstructs a binary tree from a level-order (breadth-first) serialized array, identical to the representation used by LeetCode (e.g., [1, 2, 3, None, 4]).
user can pass null instead of an array to get an empty tree 
2. tree type. all three types are binary search trees with minor differences in how search is done.
  a. default (3 way) in this tree searches are done in the conventional way, the search checks for less than, equal or greater than and moves to the next node (left or right) or returns true if found. returns false at the null leaf
  b. sentinel. in this mode there is a sentinel node inserted at all the leafs as the tree is built. when the user searches for a key the sentinel nodes are assigned that value. now the search log does not show null checks because it can skip them, instead when it finds the search ket it returns true unless the node is the sentinel in which case it returns false.
  c. two-way. in the two way search we display a candidate node which starts as null. as the search progresses we check only less than at each step. if the search node is less than the current node then we go left. If it is >= then we go right but we also store the current key value as the candidate. at the end of the tree (we hit nulls) we can check if the candidate is the search key or not
3. Search key. The key to search for. When this is set the first animation will show searching for this key.

we should have functions that can be called programattically to add elements to the tree. 

the library can be used in two ways, the main goal is to put it into the web page which is a blog about BST search. therefore the developer specifies the parameters above and the search animates. for user experience we should add a play button and a reset button. we also want a hideable log of actions in addition to animating the search. 

the output we are looking for is a sample web page with an example of each search type on the same tree values. 

another sample web page should provide a full interactive versino with input elements for the paraemeters so a user can play with and test the library.
