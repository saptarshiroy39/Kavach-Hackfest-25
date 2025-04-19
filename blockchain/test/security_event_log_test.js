const SecurityEventLog = artifacts.require("SecurityEventLog");

contract("SecurityEventLog", accounts => {
  const [owner, reporter, auditor] = accounts;
  let securityLogInstance;

  beforeEach(async () => {
    securityLogInstance = await SecurityEventLog.new({ from: owner });
  });

  it("should log a security event", async () => {
    const eventType = "INTRUSION_ATTEMPT";
    const eventData = JSON.stringify({
      sourceIP: "192.168.1.100",
      timestamp: "2025-04-19T10:30:00Z",
      userId: "user123",
      accessPoint: "admin-portal",
      attempts: 5
    });

    // Log the event
    const tx = await securityLogInstance.logEvent(eventType, eventData, { from: reporter });
    
    // Check for EventLogged emission
    assert.equal(tx.logs[0].event, "EventLogged", "EventLogged event should be emitted");
    
    // Extract the eventId
    const eventId = tx.logs[0].args.eventId;
    
    // Get the event count
    const eventCount = await securityLogInstance.getEventCount();
    assert.equal(eventCount, 1, "Event count should be 1");
    
    // Get the event ID at index 0
    const storedEventId = await securityLogInstance.getEventIdAtIndex(0);
    assert.equal(storedEventId, eventId, "Event ID should match");
    
    // Get the event details
    const event = await securityLogInstance.getEvent(eventId);
    assert.equal(event[0], eventId, "Event ID should match");
    assert.equal(event[1], reporter, "Reporter should match");
    assert.equal(event[3], eventType, "Event type should match");
    assert.equal(event[4], eventData, "Event data should match");
  });

  it("should verify event data integrity", async () => {
    const eventType = "DATA_ACCESS";
    const eventData = JSON.stringify({
      userId: "admin001",
      resourceId: "classified-doc-123",
      accessTime: "2025-04-19T14:45:00Z",
      actionType: "read"
    });

    // Log the event
    const tx = await securityLogInstance.logEvent(eventType, eventData, { from: reporter });
    const eventId = tx.logs[0].args.eventId;
    
    // Verify with correct data
    let isValid = await securityLogInstance.verifyEvent(eventId, eventData, { from: auditor });
    assert.equal(isValid, true, "Event should be verified as valid with correct data");
    
    // Verify with tampered data
    const tamperedData = JSON.stringify({
      userId: "admin001",
      resourceId: "classified-doc-123",
      accessTime: "2025-04-19T14:45:00Z",
      actionType: "write" // Changed from "read" to "write"
    });
    
    isValid = await securityLogInstance.verifyEvent(eventId, tamperedData, { from: auditor });
    assert.equal(isValid, false, "Event should be verified as invalid with tampered data");
  });

  it("should get multiple events", async () => {
    // Log first event
    await securityLogInstance.logEvent(
      "LOGIN_FAILURE", 
      JSON.stringify({ userId: "user1", attempts: 3 }), 
      { from: reporter }
    );
    
    // Log second event
    await securityLogInstance.logEvent(
      "PRIVILEGE_ESCALATION", 
      JSON.stringify({ userId: "user2", newLevel: "admin" }), 
      { from: reporter }
    );
    
    // Get event count
    const eventCount = await securityLogInstance.getEventCount();
    assert.equal(eventCount, 2, "Event count should be 2");
    
    // Get events by index
    const eventId1 = await securityLogInstance.getEventIdAtIndex(0);
    const eventId2 = await securityLogInstance.getEventIdAtIndex(1);
    
    // Get event details
    const event1 = await securityLogInstance.getEvent(eventId1);
    const event2 = await securityLogInstance.getEvent(eventId2);
    
    assert.equal(event1[3], "LOGIN_FAILURE", "First event type should match");
    assert.equal(event2[3], "PRIVILEGE_ESCALATION", "Second event type should match");
  });

  it("should fail when getting a non-existent event", async () => {
    const nonExistentId = web3.utils.keccak256("non-existent-event");
    
    try {
      await securityLogInstance.getEvent(nonExistentId);
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert(error.message.includes("Event does not exist"), "Error message should mention that event does not exist");
    }
  });
});
