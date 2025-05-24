// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {LockedInRooms} from "../src/LockedInRooms.sol";

contract LockedInRoomsTest is Test {
    LockedInRooms public lockedIn;

    address public owner = makeAddr("owner");
    address public player1 = makeAddr("player1");
    address public player2 = makeAddr("player2");
    address public player3 = makeAddr("player3");

    uint256 public constant ENTRY_FEE = 0.01 ether;

    event RoomCreated(uint256 indexed id, address indexed owner, uint256 fee);
    event Joined(uint256 indexed id, address indexed player);
    event Settled(uint256 indexed id, address indexed winner, uint256 prize);

    function setUp() public {
        lockedIn = new LockedInRooms();

        // Give test accounts some ETH
        vm.deal(owner, 10 ether);
        vm.deal(player1, 10 ether);
        vm.deal(player2, 10 ether);
        vm.deal(player3, 10 ether);
    }

    function test_CreateRoom() public {
        vm.startPrank(owner);

        // Should emit RoomCreated event
        vm.expectEmit(true, true, false, true);
        emit RoomCreated(1, owner, ENTRY_FEE);

        uint256 roomId = lockedIn.createRoom(ENTRY_FEE);

        assertEq(roomId, 1);
        assertEq(lockedIn.getRoomCount(), 1);

        // Check room details
        assertEq(lockedIn.getRoomOwner(roomId), owner);
        assertEq(lockedIn.getRoomEntryFee(roomId), ENTRY_FEE);
        assertEq(lockedIn.getRoomPlayers(roomId).length, 0);
        assertEq(lockedIn.isRoomSettled(roomId), false);
        assertEq(lockedIn.getRoomWinner(roomId), address(0));

        vm.stopPrank();
    }

    function test_CreateRoomFailsWithZeroFee() public {
        vm.startPrank(owner);

        vm.expectRevert("Entry fee must be greater than 0");
        lockedIn.createRoom(0);

        vm.stopPrank();
    }

    function test_JoinRoom() public {
        // Create room
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(ENTRY_FEE);

        // Player 1 joins
        vm.startPrank(player1);
        vm.expectEmit(true, true, false, true);
        emit Joined(roomId, player1);

        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);
        vm.stopPrank();

        // Player 2 joins
        vm.startPrank(player2);
        vm.expectEmit(true, true, false, true);
        emit Joined(roomId, player2);

        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);
        vm.stopPrank();

        // Check players array
        address[] memory players = lockedIn.getRoomPlayers(roomId);
        assertEq(players.length, 2);
        assertEq(players[0], player1);
        assertEq(players[1], player2);

        // Check total prize
        assertEq(lockedIn.getTotalPrize(roomId), ENTRY_FEE * 2);
    }

    function test_JoinRoomFailsWithIncorrectFee() public {
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(ENTRY_FEE);

        vm.startPrank(player1);
        vm.expectRevert("Incorrect entry fee");
        lockedIn.joinRoom{value: ENTRY_FEE / 2}(roomId);
        vm.stopPrank();
    }

    function test_JoinRoomFailsIfAlreadyJoined() public {
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(ENTRY_FEE);

        vm.startPrank(player1);
        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);

        vm.expectRevert("Already joined");
        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);
        vm.stopPrank();
    }

    function test_JoinRoomFailsIfNonexistent() public {
        vm.startPrank(player1);
        vm.expectRevert("Room does not exist");
        lockedIn.joinRoom{value: ENTRY_FEE}(999);
        vm.stopPrank();
    }

    function test_SettleRoom() public {
        // Create room
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(ENTRY_FEE);

        // Players join
        vm.prank(player1);
        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);

        vm.prank(player2);
        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);

        // Record initial balances
        uint256 winnerBalanceBefore = player1.balance;
        uint256 expectedPrize = ENTRY_FEE * 2;

        // Owner settles room
        vm.startPrank(owner);
        vm.expectEmit(true, true, false, true);
        emit Settled(roomId, player1, expectedPrize);

        lockedIn.settle(roomId, player1);
        vm.stopPrank();

        // Check winner received prize
        assertEq(player1.balance, winnerBalanceBefore + expectedPrize);

        // Check room is settled
        assertEq(lockedIn.isRoomSettled(roomId), true);
        assertEq(lockedIn.getRoomWinner(roomId), player1);
    }

    function test_SettleRoomFailsIfNotOwner() public {
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(ENTRY_FEE);

        vm.prank(player1);
        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);

        vm.startPrank(player2);
        vm.expectRevert("Not room owner");
        lockedIn.settle(roomId, player1);
        vm.stopPrank();
    }

    function test_SettleRoomFailsIfWinnerNotInRoom() public {
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(ENTRY_FEE);

        vm.prank(player1);
        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);

        vm.startPrank(owner);
        vm.expectRevert("Winner not in room");
        lockedIn.settle(roomId, player2); // player2 didn't join
        vm.stopPrank();
    }

    function test_SettleRoomFailsIfAlreadySettled() public {
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(ENTRY_FEE);

        vm.prank(player1);
        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);

        // First settlement
        vm.prank(owner);
        lockedIn.settle(roomId, player1);

        // Try to settle again
        vm.startPrank(owner);
        vm.expectRevert("Room already settled");
        lockedIn.settle(roomId, player1);
        vm.stopPrank();
    }

    function test_SettleRoomFailsIfNoPlayers() public {
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(ENTRY_FEE);

        vm.startPrank(owner);
        vm.expectRevert("No players in room");
        lockedIn.settle(roomId, owner);
        vm.stopPrank();
    }

    function test_JoinRoomFailsAfterSettlement() public {
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(ENTRY_FEE);

        vm.prank(player1);
        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);

        vm.prank(owner);
        lockedIn.settle(roomId, player1);

        // Try to join settled room
        vm.startPrank(player2);
        vm.expectRevert("Room already settled");
        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);
        vm.stopPrank();
    }

    function test_MultipleRooms() public {
        // Create multiple rooms
        vm.startPrank(owner);
        uint256 room1 = lockedIn.createRoom(ENTRY_FEE);
        uint256 room2 = lockedIn.createRoom(ENTRY_FEE * 2);
        vm.stopPrank();

        assertEq(room1, 1);
        assertEq(room2, 2);
        assertEq(lockedIn.getRoomCount(), 2);

        // Different entry fees
        assertEq(lockedIn.getRoomEntryFee(room1), ENTRY_FEE);
        assertEq(lockedIn.getRoomEntryFee(room2), ENTRY_FEE * 2);
    }

    // Integration test: Full flow
    function test_FullRoomFlow() public {
        // 1. Create room
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(ENTRY_FEE);

        // 2. Multiple players join
        vm.prank(player1);
        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);

        vm.prank(player2);
        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);

        vm.prank(player3);
        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);

        // 3. Check contract balance
        assertEq(address(lockedIn).balance, ENTRY_FEE * 3);

        // 4. Record balances before settlement
        uint256 winnerBalanceBefore = player2.balance;
        uint256 expectedPrize = ENTRY_FEE * 3;

        // 5. Settle with player2 as winner
        vm.prank(owner);
        lockedIn.settle(roomId, player2);

        // 6. Verify winner received full prize
        assertEq(player2.balance, winnerBalanceBefore + expectedPrize);

        // 7. Verify contract balance is empty
        assertEq(address(lockedIn).balance, 0);

        // 8. Verify room state
        assertEq(lockedIn.isRoomSettled(roomId), true);
        assertEq(lockedIn.getRoomWinner(roomId), player2);
    }
}
