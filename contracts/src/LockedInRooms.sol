// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LockedInRooms is ReentrancyGuard {
    struct Room {
        string name;
        address owner;
        uint256 entryFee;
        address[] players;
        bool settled;
        address winner;
    }

    struct RoomInfo {
        uint256 id;
        string name;
        address owner;
        uint256 entryFee;
        address[] players;
        bool settled;
        address winner;
        uint256 totalPrize;
        uint256 playerCount;
    }

    uint256 private _roomId;
    mapping(uint256 => Room) public rooms;

    event RoomCreated(
        uint256 indexed id,
        address indexed owner,
        string name,
        uint256 fee
    );
    event Joined(uint256 indexed id, address indexed player);
    event Settled(uint256 indexed id, address indexed winner, uint256 prize);

    modifier onlyOwner(uint256 id) {
        require(rooms[id].owner == msg.sender, "Not room owner");
        _;
    }

    function createRoom(
        string memory name,
        uint256 fee
    ) public returns (uint256) {
        require(fee > 0, "Entry fee must be greater than 0");
        require(bytes(name).length > 0, "Room name cannot be empty");

        ++_roomId;
        rooms[_roomId] = Room({
            name: name,
            owner: msg.sender,
            entryFee: fee,
            players: new address[](0),
            settled: false,
            winner: address(0)
        });

        emit RoomCreated(_roomId, msg.sender, name, fee);
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

    // Single comprehensive read function
    function getRoomInfo(uint256 id) external view returns (RoomInfo memory) {
        require(id > 0 && id <= _roomId, "Room does not exist");

        Room storage room = rooms[id];
        uint256 totalPrize = room.entryFee * room.players.length;

        return
            RoomInfo({
                id: id,
                name: room.name,
                owner: room.owner,
                entryFee: room.entryFee,
                players: room.players,
                settled: room.settled,
                winner: room.winner,
                totalPrize: totalPrize,
                playerCount: room.players.length
            });
    }

    function getRoomCount() external view returns (uint256) {
        return _roomId;
    }

    // Helper function to get multiple rooms at once
    function getRoomInfoBatch(
        uint256[] calldata ids
    ) external view returns (RoomInfo[] memory) {
        RoomInfo[] memory roomInfos = new RoomInfo[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            if (ids[i] > 0 && ids[i] <= _roomId) {
                Room storage room = rooms[ids[i]];
                uint256 totalPrize = room.entryFee * room.players.length;

                roomInfos[i] = RoomInfo({
                    id: ids[i],
                    name: room.name,
                    owner: room.owner,
                    entryFee: room.entryFee,
                    players: room.players,
                    settled: room.settled,
                    winner: room.winner,
                    totalPrize: totalPrize,
                    playerCount: room.players.length
                });
            }
        }

        return roomInfos;
    }
}
