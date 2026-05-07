// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {CaseAgentNFT} from "../src/CaseAgentNFT.sol";

/**
 * Deploy CaseAgentNFT (ERC-7857) to 0G Aristotle MAINNET.
 *
 * Usage:
 *   export OG_SERVER_PRIVATE_KEY=0x...
 *   forge script script/DeployCaseAgent.s.sol \
 *     --rpc-url https://evmrpc.0g.ai \
 *     --broadcast \
 *     --legacy --gas-price 3000000000 \
 *     --private-key $OG_SERVER_PRIVATE_KEY
 *
 * After deploy:
 *   1. Copy NEXT_PUBLIC_CASE_AGENT_NFT_ADDRESS into Vercel + .env.local
 *   2. Verify on https://chainscan.0g.ai
 *
 * Note: For the hackathon demo the deployer is also operator AND oracle.
 *       In production these should be three distinct keys: a cold-storage
 *       owner, a warm operator (server wallet), and an oracle key that
 *       only signs re-encryption proofs.
 */
contract DeployCaseAgent is Script {
    function run() external {
        vm.startBroadcast();

        address deployer = msg.sender;
        address operator = deployer; // hackathon: same key
        address oracle   = deployer; // hackathon: same key (replace post-launch)

        CaseAgentNFT agent = new CaseAgentNFT(operator, oracle);

        vm.stopBroadcast();

        console.log("");
        console.log("========================================================");
        console.log(" CaseAgentNFT (ERC-7857) deployed to 0G Aristotle MAINNET");
        console.log("========================================================");
        console.log("");
        console.log("CaseAgentNFT     :", address(agent));
        console.log("  Owner          :", agent.owner());
        console.log("  Operator       :", agent.operator());
        console.log("  Oracle         :", agent.oracle());
        console.log("");
        console.log("Chain ID         : 16661 (0G Aristotle Mainnet)");
        console.log("Explorer         : https://chainscan.0g.ai");
        console.log("");
        console.log("Add to .env.local AND Vercel:");
        console.log("NEXT_PUBLIC_CASE_AGENT_NFT_ADDRESS=", address(agent));
        console.log("========================================================");
    }
}
