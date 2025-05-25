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
    string public constant ROOM_NAME = "Daily Steps Challenge";

    event RoomCreated(
        uint256 indexed id,
        address indexed owner,
        string name,
        uint256 fee
    );
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
        emit RoomCreated(1, owner, ROOM_NAME, ENTRY_FEE);

        uint256 roomId = lockedIn.createRoom(ROOM_NAME, ENTRY_FEE);

        assertEq(roomId, 1);
        assertEq(lockedIn.getRoomCount(), 1);

        // Check room details using new getRoomInfo function
        LockedInRooms.RoomInfo memory roomInfo = lockedIn.getRoomInfo(roomId);
        assertEq(roomInfo.id, roomId);
        assertEq(roomInfo.name, ROOM_NAME);
        assertEq(roomInfo.owner, owner);
        assertEq(roomInfo.entryFee, ENTRY_FEE);
        assertEq(roomInfo.players.length, 0);
        assertEq(roomInfo.settled, false);
        assertEq(roomInfo.winner, address(0));
        assertEq(roomInfo.totalPrize, 0);
        assertEq(roomInfo.playerCount, 0);

        vm.stopPrank();
    }

    function test_CreateRoomFailsWithZeroFee() public {
        vm.startPrank(owner);

        vm.expectRevert("Entry fee must be greater than 0");
        lockedIn.createRoom(ROOM_NAME, 0);

        vm.stopPrank();
    }

    function test_CreateRoomFailsWithEmptyName() public {
        vm.startPrank(owner);

        vm.expectRevert("Room name cannot be empty");
        lockedIn.createRoom("", ENTRY_FEE);

        vm.stopPrank();
    }

    function test_JoinRoom() public {
        // Create room
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(ROOM_NAME, ENTRY_FEE);

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

        // Check room info
        LockedInRooms.RoomInfo memory roomInfo = lockedIn.getRoomInfo(roomId);
        assertEq(roomInfo.players.length, 2);
        assertEq(roomInfo.players[0], player1);
        assertEq(roomInfo.players[1], player2);
        assertEq(roomInfo.totalPrize, ENTRY_FEE * 2);
        assertEq(roomInfo.playerCount, 2);
    }

    function test_JoinRoomFailsWithIncorrectFee() public {
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(ROOM_NAME, ENTRY_FEE);

        vm.startPrank(player1);
        vm.expectRevert("Incorrect entry fee");
        lockedIn.joinRoom{value: ENTRY_FEE / 2}(roomId);
        vm.stopPrank();
    }

    function test_JoinRoomFailsIfAlreadyJoined() public {
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(ROOM_NAME, ENTRY_FEE);

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

    function test_GetRoomInfoFailsForNonexistentRoom() public {
        vm.expectRevert("Room does not exist");
        lockedIn.getRoomInfo(999);
    }

    function test_SettleRoom() public {
        // Create room
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(ROOM_NAME, ENTRY_FEE);

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

        // Check room is settled using getRoomInfo
        LockedInRooms.RoomInfo memory roomInfo = lockedIn.getRoomInfo(roomId);
        assertEq(roomInfo.settled, true);
        assertEq(roomInfo.winner, player1);
        assertEq(roomInfo.totalPrize, expectedPrize);
    }

    function test_SettleRoomFailsIfNotOwner() public {
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(ROOM_NAME, ENTRY_FEE);

        vm.prank(player1);
        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);

        vm.startPrank(player2);
        vm.expectRevert("Not room owner");
        lockedIn.settle(roomId, player1);
        vm.stopPrank();
    }

    function test_SettleRoomFailsIfWinnerNotInRoom() public {
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(ROOM_NAME, ENTRY_FEE);

        vm.prank(player1);
        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);

        vm.startPrank(owner);
        vm.expectRevert("Winner not in room");
        lockedIn.settle(roomId, player2); // player2 didn't join
        vm.stopPrank();
    }

    function test_SettleRoomFailsIfAlreadySettled() public {
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(ROOM_NAME, ENTRY_FEE);

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
        uint256 roomId = lockedIn.createRoom(ROOM_NAME, ENTRY_FEE);

        vm.startPrank(owner);
        vm.expectRevert("No players in room");
        lockedIn.settle(roomId, owner);
        vm.stopPrank();
    }

    function test_JoinRoomFailsAfterSettlement() public {
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(ROOM_NAME, ENTRY_FEE);

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
        string memory room1Name = "Morning Workout";
        string memory room2Name = "Evening Jog";

        // Create multiple rooms
        vm.startPrank(owner);
        uint256 room1 = lockedIn.createRoom(room1Name, ENTRY_FEE);
        uint256 room2 = lockedIn.createRoom(room2Name, ENTRY_FEE * 2);
        vm.stopPrank();

        assertEq(room1, 1);
        assertEq(room2, 2);
        assertEq(lockedIn.getRoomCount(), 2);

        // Check room details
        LockedInRooms.RoomInfo memory room1Info = lockedIn.getRoomInfo(room1);
        LockedInRooms.RoomInfo memory room2Info = lockedIn.getRoomInfo(room2);

        assertEq(room1Info.name, room1Name);
        assertEq(room1Info.entryFee, ENTRY_FEE);
        assertEq(room2Info.name, room2Name);
        assertEq(room2Info.entryFee, ENTRY_FEE * 2);
    }

    function test_GetRoomInfoBatch() public {
        // Create multiple rooms
        vm.startPrank(owner);
        uint256 room1 = lockedIn.createRoom("Room 1", ENTRY_FEE);
        uint256 room2 = lockedIn.createRoom("Room 2", ENTRY_FEE * 2);
        uint256 room3 = lockedIn.createRoom("Room 3", ENTRY_FEE * 3);
        vm.stopPrank();

        // Add some players
        vm.prank(player1);
        lockedIn.joinRoom{value: ENTRY_FEE}(room1);

        vm.prank(player2);
        lockedIn.joinRoom{value: ENTRY_FEE * 2}(room2);

        // Get batch info
        uint256[] memory roomIds = new uint256[](3);
        roomIds[0] = room1;
        roomIds[1] = room2;
        roomIds[2] = room3;

        LockedInRooms.RoomInfo[] memory batchInfo = lockedIn.getRoomInfoBatch(
            roomIds
        );

        assertEq(batchInfo.length, 3);
        assertEq(batchInfo[0].name, "Room 1");
        assertEq(batchInfo[0].playerCount, 1);
        assertEq(batchInfo[1].name, "Room 2");
        assertEq(batchInfo[1].playerCount, 1);
        assertEq(batchInfo[2].name, "Room 3");
        assertEq(batchInfo[2].playerCount, 0);
    }

    // Integration test: Full flow
    function test_FullRoomFlow() public {
        string memory challengeName = "30-Day Fitness Challenge";

        // 1. Create room
        vm.prank(owner);
        uint256 roomId = lockedIn.createRoom(challengeName, ENTRY_FEE);

        // 2. Multiple players join
        vm.prank(player1);
        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);

        vm.prank(player2);
        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);

        vm.prank(player3);
        lockedIn.joinRoom{value: ENTRY_FEE}(roomId);

        // 3. Check contract balance
        assertEq(address(lockedIn).balance, ENTRY_FEE * 3);

        // 4. Check room info before settlement
        LockedInRooms.RoomInfo memory roomInfoBefore = lockedIn.getRoomInfo(
            roomId
        );
        assertEq(roomInfoBefore.name, challengeName);
        assertEq(roomInfoBefore.playerCount, 3);
        assertEq(roomInfoBefore.totalPrize, ENTRY_FEE * 3);
        assertEq(roomInfoBefore.settled, false);

        // 5. Record balances before settlement
        uint256 winnerBalanceBefore = player2.balance;
        uint256 expectedPrize = ENTRY_FEE * 3;

        // 6. Settle with player2 as winner
        vm.prank(owner);
        lockedIn.settle(roomId, player2);

        // 7. Verify winner received full prize
        assertEq(player2.balance, winnerBalanceBefore + expectedPrize);

        // 8. Verify contract balance is empty
        assertEq(address(lockedIn).balance, 0);

        // 9. Verify room state using getRoomInfo
        LockedInRooms.RoomInfo memory roomInfoAfter = lockedIn.getRoomInfo(
            roomId
        );
        assertEq(roomInfoAfter.settled, true);
        assertEq(roomInfoAfter.winner, player2);
        assertEq(roomInfoAfter.totalPrize, expectedPrize);
    }
}
