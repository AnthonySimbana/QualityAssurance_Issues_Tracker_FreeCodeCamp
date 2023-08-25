const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  // El primer test crea un objeto que sirve para consultas, edicion y eliminacion
  test("Create an issue with every field: POST", function(done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        "issue_title": "Issue with every field",
        "issue_text": "When we post data it has not an error.",
        "created_by": "Joe",
        "assigned_to": "Joe",
        "status_text": "In QA"
      })
      .end(function(err, res) {
        _id = res.body._id;
        assert.equal(res.status, 201, "Response status should be 200");
        assert.property(res.body, "_id", "the response must include an _id");
        assert.strictEqual(res.body.issue_title, "Issue with every field", "issue_title must be Issue with every field");
        assert.strictEqual(res.body.issue_text, "When we post data it has not an error.", "issue_text must be When we post data it has not an error.");
        assert.strictEqual(res.body.created_by, "Joe", "created_by must be Joe");
        assert.strictEqual(res.body.assigned_to, "Joe", "assigned_to must be Joe");
        assert.strictEqual(res.body.status_text, "In QA", "status_text must In QA");
        assert.strictEqual(res.body.created_on, res.body.updated_on, "created_on and updated_on must be equal");
        done();
      })
  });

  test("Create an issue with only required fields: POST", function(done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        "issue_title": "Issue with only required fields",
        "issue_text": "When we post data it has an error.",
        "created_by": "Joe"
      })
      .end(function(err, res) {
        assert.equal(res.status, 201, "Response status should be 200");
        assert.property(res.body, "_id", "the response must include an _id");
        assert.strictEqual(res.body.issue_title, "Issue with only required fields", "issue_title must be Issue with only required fields");
        assert.strictEqual(res.body.issue_text, "When we post data it has an error.", "issue_text must be When we post data it has an error.");
        assert.strictEqual(res.body.created_by, "Joe", "created_by must be Joe");
        assert.strictEqual(res.body.assigned_to, "", "assigned_to must be empty");
        assert.strictEqual(res.body.status_text, "", "status_text must In empty");
        assert.strictEqual(res.body.created_on, res.body.updated_on, "created_on and updated_on must be equal");
        done();
      })
  });
  
  test("Create an issue with missing required fields: POST", function(done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200, "Response status should be 200");
        assert.strictEqual(res.body.error, "required field(s) missing", "can't create an issue without required fields");
        done();
      })
  });
  // GET functions Test 

  test("View issues on a project: GET", function(done) {
    chai
      .request(server)
      .get("/api/issues/apitest")
      .end(function(err, res) {
        assert.equal(res.status, 200, "Response status should be 200");
        assert.isArray(res.body, "The response must be an array of issues");
        done();
      })
  });
  test("View issues on a project with one filter: GET", function(done) {
    chai
      .request(server)
      .get("/api/issues/apitest?issue_title=Issue with every field")
      .end(function(err, res) {
        assert.equal(res.status, 200, "Response status should be 200");
        const issue = res.body[0];
        assert.deepEqual(issue.issue_title, "Issue with every field", "issue_title must be Issue with every field");
        assert.deepEqual(issue.issue_text, "When we post data it has not an error.", "issue_text must be When we post data it has not an error.");
        assert.deepEqual(issue.created_by, "Joe", "created_by must be Joe");
        assert.deepEqual(issue.assigned_to, "Joe", "assigned_to must be Joe");
        assert.deepEqual(issue.status_text, "In QA", "status_text must In QA");
        done();
      });
  });
  test("View issues on a project with multiple filters: GET", function(done) {
    chai
      .request(server)
      .get("/api/issues/apitest?issue_title=Issue with every field&open=true")
      .end(function(err, res) {
        assert.equal(res.status, 200, "Response status should be 200");
        const issue = res.body[0];
        assert.deepEqual(issue.issue_title, "Issue with every field", "issue_title must be Issue with every field");
        assert.deepEqual(issue.issue_text, "When we post data it has not an error.", "issue_text must be When we post data it has not an error.");
        assert.deepEqual(issue.created_by, "Joe", "created_by must be Joe");
        assert.deepEqual(issue.assigned_to, "Joe", "assigned_to must be Joe");
        assert.deepEqual(issue.status_text, "In QA", "status_text must In QA");
        done();
      })
  });

  // PUT functions test
  test("Update one field on an issue: PUT", function(done) {
        chai
          .request(server)
          .put("/api/issues/apitest")
          .send({
            "_id": "64e82450e126f4411c619a21",
            "assigned_to": "UserAsigned",
          })
          .end(function(err, res) {
            assert.equal(res.status, 200, "Response status should be 200");
            assert.strictEqual(res.body._id, "64e82450e126f4411c619a21", "_id must be the same");
            assert.strictEqual(res.body.result, "successfully updated", "result property must be equal to successfully updated");
            done();
          });
  
  });
  test("Update multiple fields on an issue: PUT", function(done) {
        chai
          .request(server)
          .put("/api/issues/apitest")
          .send({
            "_id": "64e82225a75b390473e1836e",
            "issue_title": "Issue with every field",
            "issue_text": "When we post data it has not an error.",
            "created_by": "Joe",
            "assigned_to": "Joe",
            "status_text": "In QA"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200, "Response status should be 200");
            assert.strictEqual(res.body._id, "64e82225a75b390473e1836e", "_id must be the same");
            assert.strictEqual(res.body.result, "successfully updated", "result property must be equal to successfully updated");
            done();
          });
  });
  test("Update an issue with missing _id: PUT", function(done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200, "Response status should be 200");
        assert.strictEqual(res.body.error, "missing _id");
        done();
      })
  });
  test("Update an issue with no fields to update: PUT", function(done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        "_id": "636e82a9c930377c14cd001c"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200, "Response status should be 200");
        assert.strictEqual(res.body._id, "636e82a9c930377c14cd001c", "_id must be the some")
        assert.strictEqual(res.body.error, "no update field(s) sent");
        done();
      })
  });
  test("Update an issue with an invalid _id: PUT", function(done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        "_id": "67646677"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200, "Response status should be 200");
        assert.strictEqual(res.body._id, "67646677", "_id must be the some")
        assert.strictEqual(res.body.error, 'no update field(s) sent');
        //assert.deepEqual(res.body.err, "no update field(s) sent");
        done();
      })
  });
//delete test

  test("Delete an issue: DELETE", function(done) {
        chai
          .request(server)
          .delete("/api/issues/apitest")
          .send({
            "_id": "64e8270f7e7bcdf32be45159"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200, "Response status should be 200");
            assert.strictEqual(res.body._id, "64e8270f7e7bcdf32be45159", "_id must be the same");
            assert.strictEqual(res.body.result, "successfully deleted", "result property must be equal to successfully deleted");
            done();
          })

  });
  
  test("Delete an issue with an invalid _id: DELETE", function(done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({
        "_id": "636eb5de3a"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200, "Response status should be 200");
        assert.strictEqual(res.body._id, "636eb5de3a", "_id must be the same");
        assert.strictEqual(res.body.error, "could not delete", "result property must be equal to could not delete");
        done();
      })
  });
  test("Delete an issue with missing _id: DELETE", function(done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .end(function(err, res) {
        assert.equal(res.status, 200, "Response status should be 200");
        assert.strictEqual(res.body.error, "missing _id");
        done();
      })
  });

  
    after(function() {
      chai.request(server)
        .get('/')
    });
  
});