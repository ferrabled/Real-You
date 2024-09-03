// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RealYou {
    struct User {
        string username;
        uint256 reputation;
        bool exists;
    }

    struct Photo {
        address owner;
        string ipfsHash;
        uint256 timestamp;
        bool inContest;
        uint256 contestId;
        uint256 votes;
    }

    struct Contest {
        string topic;
        uint256 startTime;
        uint256 endTime;
        bool active;
        uint256[] photoIds;
    }

    mapping(address => User) public users;
    mapping(uint256 => Photo) public photos;
    mapping(uint256 => Contest) public contests;

    //This mapping keeps track of the users who have voted in a contest
    //It is used to prevent a user from voting multiple times in the same contest
    mapping(uint256 => mapping(address => bool)) public contestVotes;

    uint256 public photoCount;
    uint256 public contestCount;

    event UserRegistered(address indexed userAddress, string username);
    event PhotoUploaded(
        uint256 indexed photoId,
        address indexed owner,
        string ipfsHash
    );
    event ContestCreated(uint256 indexed contestId, string topic);
    event PhotoAddedToContest(
        uint256 indexed contestId,
        uint256 indexed photoId
    );
    event VoteCast(
        uint256 indexed contestId,
        uint256 indexed photoId,
        address indexed voter
    );

    function registerUser(string memory _username) external {
        require(!users[msg.sender].exists, "User already registered");
        users[msg.sender] = User(_username, 0, true);
        emit UserRegistered(msg.sender, _username);
    }

    function uploadPhoto(string memory _ipfsHash) external {
        require(users[msg.sender].exists, "User not registered");

        photoCount++;
        photos[photoCount] = Photo(
            msg.sender,
            _ipfsHash,
            block.timestamp,
            false,
            0,
            0
        );
        emit PhotoUploaded(photoCount, msg.sender, _ipfsHash);
    }

    function createContest(string memory _topic, uint256 _duration) external {
        require(users[msg.sender].exists, "User not registered");

        contestCount++;
        contests[contestCount] = Contest(
            _topic,
            block.timestamp,
            block.timestamp + _duration,
            true,
            new uint256[](0)
        );
        emit ContestCreated(contestCount, _topic);
    }

    function addPhotoToContest(uint256 _photoId, uint256 _contestId) external {
        require(users[msg.sender].exists, "User not registered");
        require(_photoId > 0 && _photoId <= photoCount, "Invalid photo ID");
        require(contests[_contestId].active, "Contest not active");
        require(photos[_photoId].owner == msg.sender, "Not the photo owner");
        require(!photos[_photoId].inContest, "Photo already in a contest");

        contests[_contestId].photoIds.push(_photoId);
        photos[_photoId].inContest = true;
        photos[_photoId].contestId = _contestId;
        emit PhotoAddedToContest(_contestId, _photoId);
    }

    function voteForPhoto(uint256 _photoId) external {
        require(users[msg.sender].exists, "User not registered");
        require(_photoId > 0 && _photoId <= photoCount, "Invalid photo ID");
        require(photos[_photoId].inContest, "Photo not in a contest");
        require(
            contests[photos[_photoId].contestId].active,
            "Contest not active"
        );
        require(
            photos[_photoId].owner != msg.sender,
            "Cannot vote for own photo"
        );
        require(
            !contestVotes[photos[_photoId].contestId][msg.sender],
            "Already voted in this contest"
        );

        photos[_photoId].votes++;
        contestVotes[photos[_photoId].contestId][msg.sender] = true;
        emit VoteCast(photos[_photoId].contestId, _photoId, msg.sender);
    }

    function endContest(uint256 _contestId) external {
        require(contests[_contestId].active, "Contest not active");
        require(
            block.timestamp >= contests[_contestId].endTime,
            "Contest still ongoing"
        );

        contests[_contestId].active = false;
        // TODO: Winner logic
    }

    /* GETTERS */

    function getUserProfile(
        address _userAddress
    )
        external
        view
        returns (string memory username, uint256 reputation, bool exists)
    {
        User memory user = users[_userAddress];
        return (user.username, user.reputation, user.exists);
    }

    function getPhotoDetails(
        uint256 _photoId
    )
        external
        view
        returns (
            address owner,
            string memory ipfsHash,
            uint256 timestamp,
            bool inContest,
            uint256 contestId,
            uint256 votes
        )
    {
        require(_photoId > 0 && _photoId <= photoCount, "Invalid photo ID");
        Photo memory photo = photos[_photoId];
        return (
            photo.owner,
            photo.ipfsHash,
            photo.timestamp,
            photo.inContest,
            photo.contestId,
            photo.votes
        );
    }

    function getContestDetails(
        uint256 _contestId
    )
        external
        view
        returns (
            string memory topic,
            uint256 startTime,
            uint256 endTime,
            bool active,
            uint256[] memory photoIds
        )
    {
        require(
            _contestId > 0 && _contestId <= contestCount,
            "Invalid contest ID"
        );
        Contest memory contest = contests[_contestId];
        return (
            contest.topic,
            contest.startTime,
            contest.endTime,
            contest.active,
            contest.photoIds
        );
    }

    function getAllPhotos(
        uint256 _startId,
        uint256 _endId
    ) external view returns (Photo[] memory) {
        require(_startId > 0 && _startId <= photoCount, "Invalid start ID");
        require(_endId >= _startId && _endId <= photoCount, "Invalid end ID");

        uint256 length = _endId - _startId + 1;
        Photo[] memory result = new Photo[](length);

        for (uint256 i = 0; i < length; i++) {
            result[i] = photos[_startId + i];
        }

        return result;
    }

    function getContestPhotos(
        uint256 _contestId
    ) external view returns (Photo[] memory) {
        require(
            _contestId > 0 && _contestId <= contestCount,
            "Invalid contest ID"
        );
        Contest memory contest = contests[_contestId];

        Photo[] memory result = new Photo[](contest.photoIds.length);

        for (uint256 i = 0; i < contest.photoIds.length; i++) {
            result[i] = photos[contest.photoIds[i]];
        }

        return result;
    }

    function getContestLeaderboard(
        uint256 _contestId
    )
        external
        view
        returns (uint256[] memory photoIds, uint256[] memory voteCounts)
    {
        require(
            _contestId > 0 && _contestId <= contestCount,
            "Invalid contest ID"
        );
        Contest memory contest = contests[_contestId];

        uint256[] memory pIds = new uint256[](contest.photoIds.length);
        uint256[] memory votes = new uint256[](contest.photoIds.length);

        for (uint256 i = 0; i < contest.photoIds.length; i++) {
            pIds[i] = contest.photoIds[i];
            votes[i] = photos[contest.photoIds[i]].votes;
        }

        return (pIds, votes);
    }
}
