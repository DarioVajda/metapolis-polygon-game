// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

library BST {
    struct Node {
        uint value;
        uint id;
        uint left;
        uint right;
        uint height;
    }

    function max(uint a, uint b) internal pure returns(uint) {
        if(a > b) return a;
        else return b;
    }

    function height(mapping(uint => Node) storage nodes, uint root) view internal returns(uint) {
        if(root == 10000) return 0;
        else return 1 + max(height(nodes, nodes[root].left), height(nodes, nodes[root].right));
    }

    function rightRotate(mapping(uint => Node) storage nodes, uint y) internal returns(uint) {
        uint x = nodes[y].left;
        uint t2 = nodes[y].right;

        nodes[x].right = y;
        nodes[y].left = t2;

        nodes[y].height = height(nodes, y);
        nodes[x].height = height(nodes, x);

        return x;
    }

    function leftRotate(mapping(uint => Node) storage nodes, uint x) internal returns(uint) {
        uint y = nodes[x].right;
        uint t2 = nodes[y].left;

        nodes[y].left = x;
        nodes[x].right = t2;

        nodes[x].height = height(nodes, x);
        nodes[y].height = height(nodes, y);

        return y;
    }

    function getBalance(mapping(uint => Node) storage nodes, uint n) internal view returns(uint, bool) {
        if(n == 10000) return (0, false);
        uint left = height(nodes, nodes[n].left);
        uint right = height(nodes, nodes[n].right);

        if(left >= right) return (left - right, true);
        else return(right - left, false);
    }

    function insert(mapping(uint => Node) storage nodes, uint root, uint value, uint id) internal returns(uint) {
        if(root == 10000) {
            nodes[id] = Node({value: value, id: id, left: 10000, right: 10000, height: 1});
            return id;
        }

        if(value <= nodes[root].value) {
            nodes[root].left = insert(nodes, nodes[root].left, value, id);
        }
        else {
            nodes[root].right = insert(nodes, nodes[root].right, value, id);
        }

        nodes[root].height = height(nodes, root);

        (uint balance, bool positive) = getBalance(nodes, root);

        if(balance > 1 && positive && value <= nodes[nodes[root].left].value) {
            return rightRotate(nodes, root);
        }

        if(balance > 1 && !positive && value > nodes[nodes[root].right].value) {
            return leftRotate(nodes, root);
        }

        if(balance > 1 && positive && value > nodes[nodes[root].left].value) {
            nodes[root].left = leftRotate(nodes, nodes[root].left);
            return rightRotate(nodes, root);
        }

        if(balance > 1 && !positive && value <= nodes[nodes[root].right].value) {
            nodes[root].right = rightRotate(nodes, nodes[root].right);
            return leftRotate(nodes, root);
        }

        return root;
    }

    function minNode(mapping(uint => Node) storage nodes, uint root)internal returns(uint) {
        if(nodes[root].left == 10000) return nodes[root].value;
        else return minNode(nodes, nodes[root].left);
    }

    function remove(mapping(uint => Node) storage nodes, uint root, uint value, uint id) internal returns(uint) {
        if(root == 10000) return root;
        
        if(value <= nodes[root].value && id != nodes[root].id) {
            nodes[root].left = remove(nodes, nodes[root].left, value, id);
        }
        else if(value > nodes[root].value) {
            nodes[root].right = remove(nodes, nodes[root].right, value, id);
        }
        else {
            if(nodes[root].left == 10000 || nodes[root].right == 10000) {
                uint temp = (nodes[root].left == 10000) ? nodes[root].right : nodes[root].left;
                nodes[root] = Node({value: 0, id: 0, left: 0, right: 0, height: 0});
                return temp;
            }
            else {
                uint temp = minNode(nodes, nodes[root].right);
                nodes[root] = nodes[temp];
                // nodes[root].right = remove(nodes, nodes[root].right, nodes[temp].value, nodes[temp].id);
                nodes[temp] = Node({value: 0, id: 0, left: 0, right: 0, height: 0});
            }
        }

        if(root == 10000) return root;

        nodes[root].height = height(nodes, root);

        (uint balance, bool positive) = getBalance(nodes, root);

        if(balance > 1 && positive && value <= nodes[nodes[root].left].value) {
            return rightRotate(nodes, root);
        }

        if(balance > 1 && !positive && value > nodes[nodes[root].right].value) {
            return leftRotate(nodes, root);
        }

        if(balance > 1 && positive && value > nodes[nodes[root].left].value) {
            nodes[root].left = leftRotate(nodes, nodes[root].left);
            return rightRotate(nodes, root);
        }

        if(balance > 1 && !positive && value <= nodes[nodes[root].right].value) {
            nodes[root].right = rightRotate(nodes, nodes[root].right);
            return leftRotate(nodes, root);
        }

        return root;
    }

    function get(mapping(uint => Node) storage nodes, uint root, uint value, uint id) internal returns(uint) {
        if(nodes[root].value == value && nodes[root].id == id) return id;
        else if(value < nodes[root].value) return get(nodes, nodes[root].left, value, id);
        else return get(nodes, nodes[root].right, value, id);
    }
}