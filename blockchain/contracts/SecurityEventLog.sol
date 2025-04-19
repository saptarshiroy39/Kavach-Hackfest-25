// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SecurityEventLog
 * @dev Smart contract for logging security events on the blockchain
 */
contract SecurityEventLog {
    // Structure to store security event data
    struct SecurityEvent {
        bytes32 eventId;
        address reporter;
        uint256 timestamp;
        string eventType;
        string eventData;
        bytes32 dataHash;
    }

    // Mapping from eventId to SecurityEvent
    mapping(bytes32 => SecurityEvent) public events;
    
    // Array to store all event IDs
    bytes32[] public eventIds;
    
    // Event emitted when a new security event is logged
    event EventLogged(
        bytes32 indexed eventId, 
        address indexed reporter,
        string eventType,
        uint256 timestamp
    );
    
    // Event emitted when an event is verified
    event EventVerified(
        bytes32 indexed eventId,
        address indexed verifier,
        uint256 timestamp
    );

    /**
     * @dev Log a new security event
     * @param eventType Type of security event (e.g., "INTRUSION", "DATA_BREACH")
     * @param eventData JSON string containing event details
     * @return eventId The ID of the newly logged event
     */
    function logEvent(string memory eventType, string memory eventData) public returns (bytes32) {
        // Generate a unique ID for the event
        bytes32 eventId = keccak256(abi.encodePacked(
            msg.sender,
            block.timestamp,
            eventType,
            eventData
        ));
        
        // Calculate hash of event data for future verification
        bytes32 dataHash = keccak256(abi.encodePacked(eventData));
        
        // Store the event
        events[eventId] = SecurityEvent({
            eventId: eventId,
            reporter: msg.sender,
            timestamp: block.timestamp,
            eventType: eventType,
            eventData: eventData,
            dataHash: dataHash
        });
        
        // Add event ID to array
        eventIds.push(eventId);
        
        // Emit event
        emit EventLogged(eventId, msg.sender, eventType, block.timestamp);
        
        return eventId;
    }

    /**
     * @dev Verify the integrity of an event's data
     * @param eventId The ID of the event to verify
     * @param eventData The event data to verify against the stored hash
     * @return true if the data matches the stored hash, false otherwise
     */
    function verifyEvent(bytes32 eventId, string memory eventData) public returns (bool) {
        // Get the stored event
        SecurityEvent storage event_ = events[eventId];
        
        // Check if event exists
        require(event_.eventId == eventId, "Event does not exist");
        
        // Calculate hash of provided data
        bytes32 dataHash = keccak256(abi.encodePacked(eventData));
        
        // Verify hash matches
        bool isValid = (dataHash == event_.dataHash);
        
        // Emit verification event if valid
        if (isValid) {
            emit EventVerified(eventId, msg.sender, block.timestamp);
        }
        
        return isValid;
    }

    /**
     * @dev Get the number of logged events
     * @return The total count of events
     */
    function getEventCount() public view returns (uint256) {
        return eventIds.length;
    }

    /**
     * @dev Get event details by ID
     * @param eventId The ID of the event to retrieve
     * @return Event details (id, reporter, timestamp, type, data, hash)
     */
    function getEvent(bytes32 eventId) public view returns (
        bytes32,
        address,
        uint256,
        string memory,
        string memory,
        bytes32
    ) {
        SecurityEvent storage event_ = events[eventId];
        require(event_.eventId == eventId, "Event does not exist");
        
        return (
            event_.eventId,
            event_.reporter,
            event_.timestamp,
            event_.eventType,
            event_.eventData,
            event_.dataHash
        );
    }

    /**
     * @dev Get event ID at a specific index
     * @param index The index in the events array
     * @return The event ID at the given index
     */
    function getEventIdAtIndex(uint256 index) public view returns (bytes32) {
        require(index < eventIds.length, "Index out of bounds");
        return eventIds[index];
    }
}
