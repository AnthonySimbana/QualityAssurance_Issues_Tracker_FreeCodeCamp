// create isuue
const assert = require("chai").assert;
// const object = require('lodash');



const filterParameters = (param) => {
    if ("open" in param)
        param.open = (param.open == "true" || param.open == "1") ? true : false;
    if ("_id" in param)
        param["_id"] = ObjectId(param["_id"]);
}

const { ObjectId } = require("mongodb");
async function createIssue(issue, project, myDataBase, done) {
    let { issue_title, issue_text, created_by } = issue;
    try {
        let query = await myDataBase.insertOne({
            project: project,
            issue_title: issue_title,
            issue_text: issue_text,
            created_by: created_by,
            created_on: new Date(),
            updated_on: new Date(),
            assigned_to: issue.assigned_to || '',
            status_text: issue.status_text || '',
            open: true,
        });
        const data = await myDataBase.findOne({ _id: query.insertedId }, { projection: { project: 0 } });
        done(null, data);
    }
    catch (e) {
        done(e);
    }
}


async function listOfIssues(project, query, myDataBase, done) {
    try {
        let filter = query;
        filterParameters(filter);
        let data = await myDataBase.find({
            ...filter,
            project: project,
        }, { projection: { project: 0 } }).toArray();
        done(null, data);
    }
    catch (e) {
        done(e);
    }
}

async function updateIssue(arguments, myDataBase, done) {
  try {
    let updates = { ...arguments };
    
    if (Object.keys(updates).length === 1) {
      done(null, { error: ErrorCode.NoFieldsSent, _id: updates._id });
      return;
    }
    
    filterParameters(updates);

    const data = await myDataBase.findOne({
      _id: updates._id,
    }, { projection: { project: 0, created_on: 0, updated_on: 0 } });

    if (!data) {
      done(null, { error: ErrorCode.DocumentNotFound, _id: updates._id });
      return;
    }

    const update = await myDataBase.findOneAndUpdate(
      { _id: updates._id },
      { $set: { ...updates, updated_on: new Date() } },
      { returnDocument: 'after' }
    );

    if (!update.value) {
      done(null, { error: ErrorCode.UpdateFailed, _id: updates._id });
      return;
    }

    done(null, { result: 'successfully updated', _id: update.value._id });
  } catch (error) {
    done({ error: ErrorCode.UpdateError, _id: arguments._id });
  }
}

// Enumeración de códigos de error
const ErrorCode = {
  NoFieldsSent: 'no update field(s) sent',
  DocumentNotFound: 'could not update',
  UpdateFailed: 'update_failed',
  UpdateError: 'could not update',
};

async function delteIssue(_id, myDataBase, done) {
    try {
        let deleted = await myDataBase.findOneAndDelete({ _id: ObjectId(_id) });
        if (deleted.value == null)
            throw new Error("can't delete the document!!");
        else
            done(null, { result: 'successfully deleted', '_id': deleted.value._id })
    }
    catch (e) {
        done({ error: 'could not delete', '_id': _id });
    }

}


exports.createIssue = createIssue;
exports.listOfIssues = listOfIssues;
exports.updateIssue = updateIssue;
exports.delteIssue = delteIssue;