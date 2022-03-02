// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

library BST {
    struct Node {
        uint value;
        uint id;
        BST storage left;
        BST storage right;
    }

    function add(Node storage root, uint value, uint id) {
        if(root.value == 0 && root.id == 0) {
            root = new Node({value: value, id: id}); // ovo mozda ne valja
            return;
        }
        
        if(value <= root.value) {
            add(root.left, vlaue, id);
        }
        else {
            add(root.right, value, id);
        }

        // ovde treba da se implementira optimizovan algoritam za dodavanje elemenata u stablo, tako da stablo ostane balansirano
    }

    function remove(Node storage root, uint value, uint id) {
        // ovde treba da se implementira funkcija za brisanje cvora iz stabla
    }

    function get(Node storage root, uint value, uint id) returns(uint) {
        if(root.id == id) return id;
        else if(value < root.value) return get(root, value, id);
        else return get(root.right, value, id);
    }
}