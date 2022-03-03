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

    function insert(mapping(uint => Node) storage nodes, uint node, uint value, uint id) internal returns(uint) {
        if(node == 10000) {
            nodes[id] = Node({value: value, id: id, left: 10000, right: 10000, height: 1});
            return id;
        }

        if(value <= nodes[node].value) {
            nodes[node].left = insert(nodes, nodes[node].left, value, id);
        }
        else {
            nodes[node].right = insert(nodes, nodes[node].right, value, id);
        }

        nodes[node].height = height(nodes, node);

        (uint balance, bool positive) = getBalance(nodes, node);

        if(balance > 1 && positive && value <= nodes[nodes[node].left].value) {
            return rightRotate(nodes, node);
        }

        if(balance > 1 && !positive && value > nodes[nodes[node].right].value) {
            return leftRotate(nodes, node);
        }

        if(balance > 1 && positive && value > nodes[nodes[node].left].value) {
            nodes[node].left = leftRotate(nodes, nodes[node].left);
            return rightRotate(nodes, node);
        }

        if(balance > 1 && !positive && value <= nodes[nodes[node].right].value) {
            nodes[node].right = rightRotate(nodes, nodes[node].right);
            return leftRotate(nodes, node);
        }

        return node;
    }

    function remove(mapping(uint => Node) storage nodes, uint root, uint value, uint id) internal {
        // ovde treba da se implementira funkcija za brisanje cvora iz stabla
    }

    function get(mapping(uint => Node) storage nodes, uint root, uint value, uint id) internal returns(uint) {
        if(nodes[root].value == id) return id;
        else if(value < nodes[root].value) return get(nodes, nodes[root].left, value, id);
        else return get(nodes, nodes[root].right, value, id);
    }

    function minValueNode(mapping(uint => Node) storage nodes, uint root) internal returns(uint) {
        if(nodes[root].left == 10000) {
            return root;
        }
        else {
            return minValueNode(nodes, nodes[root].left);
        }
    }

    function deleteNode(mapping(uint => Node) storage nodes, uint root, uint value, uint id) internal returns(uint) {
        if(nodes[root].value == value && nodes[root].id == id) {
            
        }
    }
}