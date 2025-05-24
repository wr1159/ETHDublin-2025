// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract LockedInRooms is ReentrancyGuard {
    struct Room {
        address owner;
        uint256 entryFee;
        address[] players;
        bool settled;
        address winner;
    }

    uint256 private _roomId;
    mapping(uint256 => Room) public rooms;

    event RoomCreated(uint256 indexed id, address indexed owner, uint256 fee);
    event Joined(uint256 indexed id, address indexed player);
    event Settled(uint256 indexed id, address indexed winner, uint256 prize);

    modifier onlyOwner(uint256 id) {
        require(rooms[id].owner == msg.sender, "Not room owner");
        _;
    }

    function createRoom(uint256 fee) public returns (uint256) {
        require(fee > 0, "Entry fee must be greater than 0");

        ++_roomId;
        rooms[_roomId] = Room({
            owner: msg.sender,
            entryFee: fee,
            players: new address[](0),
            settled: false,
            winner: address(0)
        });

        emit RoomCreated(_roomId, msg.sender, fee);
        return _roomId;
    }

    function joinRoom(uint256 id) external payable nonReentrant {
        Room storage room = rooms[id];
        require(room.owner != address(0), "Room does not exist");
        require(!room.settled, "Room already settled");
        require(msg.value == room.entryFee, "Incorrect entry fee");
        require(!playerInRoom(id, msg.sender), "Already joined");

        room.players.push(msg.sender);
        emit Joined(id, msg.sender);
    }

    function settle(
        uint256 id,
        address winner
    ) external nonReentrant onlyOwner(id) {
        Room storage room = rooms[id];
        require(!room.settled, "Room already settled");
        require(room.players.length > 0, "No players in room");
        require(playerInRoom(id, winner), "Winner not in room");

        room.settled = true;
        room.winner = winner;

        uint256 prize = room.entryFee * room.players.length;

        (bool success, ) = winner.call{value: prize}("");
        require(success, "Transfer failed");

        emit Settled(id, winner, prize);
    }

    function playerInRoom(
        uint256 id,
        address player
    ) internal view returns (bool) {
        Room storage room = rooms[id];
        for (uint256 i = 0; i < room.players.length; i++) {
            if (room.players[i] == player) {
                return true;
            }
        }
        return false;
    }

    function getRoomPlayers(
        uint256 id
    ) external view returns (address[] memory) {
        return rooms[id].players;
    }

    function getRoomCount() external view returns (uint256) {
        return _roomId;
    }

    function getTotalPrize(uint256 id) external view returns (uint256) {
        Room storage room = rooms[id];
        return room.entryFee * room.players.length;
    }

    function isRoomSettled(uint256 id) external view returns (bool) {
        return rooms[id].settled;
    }

    function getRoomWinner(uint256 id) external view returns (address) {
        return rooms[id].winner;
    }

    function getRoomOwner(uint256 id) external view returns (address) {
        return rooms[id].owner;
    }

    function getRoomEntryFee(uint256 id) external view returns (uint256) {
        return rooms[id].entryFee;
    }
}
