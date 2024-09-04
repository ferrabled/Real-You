// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {RealYou} from "../src/RealYou.sol";

contract RealYouScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        RealYou realYou = new RealYou();
        console.log("RealYou contract deployed at:", address(realYou));

        vm.stopBroadcast();
    }
}
