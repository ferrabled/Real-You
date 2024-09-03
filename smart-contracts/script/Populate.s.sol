// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {RealYou} from "../src/RealYou.sol";

contract PopulateRealYouScript is Script {
    RealYou public realYou;
    address public user1;
    address public user2;
    address public user3;

    function setUp() public {
        // Set up user addresses
        user1 = vm.addr(1);
        user2 = vm.addr(2);
        user3 = vm.addr(3);
    }

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address realYouAddress = vm.envAddress("REAL_YOU_ADDRESS");
        realYou = RealYou(realYouAddress);

        vm.startBroadcast(deployerPrivateKey);

        // Register users
        vm.prank(user1);
        realYou.registerUser("Alice");
        console.log("Registered user: Alice");

        vm.prank(user2);
        realYou.registerUser("Bob");
        console.log("Registered user: Bob");

        vm.prank(user3);
        realYou.registerUser("Charlie");
        console.log("Registered user: Charlie");

        // Upload photos
        vm.prank(user1);
        realYou.uploadPhoto("ipfs://photo1");
        console.log("Uploaded photo 1 by Alice");

        vm.prank(user2);
        realYou.uploadPhoto("ipfs://photo2");
        console.log("Uploaded photo 2 by Bob");

        vm.prank(user3);
        realYou.uploadPhoto("ipfs://photo3");
        console.log("Uploaded photo 3 by Charlie");

        // Create a contest
        vm.prank(user1);
        realYou.createContest("Nature Beauty", 7 days);
        console.log("Created contest: Nature Beauty");

        // Add photos to the contest
        vm.prank(user1);
        realYou.addPhotoToContest(1, 1);
        console.log("Added photo 1 to contest");

        vm.prank(user2);
        realYou.addPhotoToContest(2, 1);
        console.log("Added photo 2 to contest");

        vm.prank(user3);
        realYou.addPhotoToContest(3, 1);
        console.log("Added photo 3 to contest");

        // Cast some votes
        vm.prank(user2);
        realYou.voteForPhoto(1);
        console.log("Bob voted for photo 1");

        vm.prank(user3);
        realYou.voteForPhoto(2);
        console.log("Charlie voted for photo 2");

        vm.prank(user1);
        realYou.voteForPhoto(3);
        console.log("Alice voted for photo 3");

        vm.stopBroadcast();

        console.log("RealYou contract populated successfully!");
    }
}
