// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {RealYou} from "../src/RealYou.sol";

contract RealYouTest is Test {
    RealYou public platform;
    address public user1;
    address public user2;

    function setUp() public {
        platform = new RealYou();
        user1 = address(0x1);
        user2 = address(0x2);
    }

    function testUserRegistration() public {
        vm.prank(user1);
        platform.registerUser("Alice");
        (string memory username, uint256 reputation, bool exists) = platform
            .getUserProfile(user1);
        assertEq(username, "Alice");
        assertEq(reputation, 0);
        assertTrue(exists);
    }

    function testPhotoUpload() public {
        vm.startPrank(user1);
        platform.registerUser("Alice");
        platform.uploadPhoto("ipfs://photo1");
        vm.stopPrank();

        (address owner, string memory ipfsHash, , , , ) = platform
            .getPhotoDetails(1);
        assertEq(owner, user1);
        assertEq(ipfsHash, "ipfs://photo1");
    }

    function testContestCreation() public {
        vm.startPrank(user1);
        platform.registerUser("Alice");
        platform.createContest("Nature", 7 days);
        vm.stopPrank();

        (string memory topic, , , bool active, ) = platform.getContestDetails(
            1
        );
        assertEq(topic, "Nature");
        assertTrue(active);
    }

    function testAddPhotoToContest() public {
        vm.startPrank(user1);
        platform.registerUser("Alice");
        platform.uploadPhoto("ipfs://photo1");
        platform.createContest("Nature", 7 days);
        platform.addPhotoToContest(1, 1);
        vm.stopPrank();

        (, , , bool inContest, uint256 contestId, ) = platform.getPhotoDetails(
            1
        );
        assertTrue(inContest);
        assertEq(contestId, 1);
    }

    function testVoting() public {
        vm.prank(user1);
        platform.registerUser("Alice");
        vm.prank(user2);
        platform.registerUser("Bob");

        vm.prank(user1);
        platform.uploadPhoto("ipfs://photo1");
        vm.prank(user1);
        platform.createContest("Nature", 7 days);
        vm.prank(user1);
        platform.addPhotoToContest(1, 1);

        vm.prank(user2);
        platform.voteForPhoto(1);

        (, , , , , uint256 votes) = platform.getPhotoDetails(1);
        assertEq(votes, 1);
    }

    function testGetContestLeaderboard() public {
        vm.prank(user1);
        platform.registerUser("Alice");
        vm.prank(user2);
        platform.registerUser("Bob");

        vm.startPrank(user1);
        platform.uploadPhoto("ipfs://photo1");
        platform.createContest("Nature", 7 days);
        platform.addPhotoToContest(1, 1);
        vm.stopPrank();

        vm.prank(user2);
        platform.voteForPhoto(1);

        (uint256[] memory photoIds, uint256[] memory voteCounts) = platform
            .getContestLeaderboard(1);
        assertEq(photoIds.length, 1);
        assertEq(photoIds[0], 1);
        assertEq(voteCounts[0], 1);
    }
}
