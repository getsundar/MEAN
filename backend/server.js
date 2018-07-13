import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Issue from './models/issues';
import {
    pipeline
} from 'stream';

const app = express();
const router = express.Router();
app.use(cors());
var jsonParser = bodyParser.json({
    type: 'application/json'
});
app.use(jsonParser);
app.listen(4000, (req, res) => {
    console.log('Express running 4000!');
});
app.get('/', (req, res) => res.send('Hello World!!!!!!!'))
mongoose.connect('mongodb://localhost:27017/issues');
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB conneciton established!!!');
});
app.use('/', router)
router.route('/issues').get((req, res) => {
    console.log("Inside route")
    Issue.find((err, issues) => {
        if (err) {
            console.log('error')
        } else {
            console.log('Issues received')
            res.json(issues)
        }

    })
});
router.route('/getIssue/:id').get((req, res) => {
    console.log('ID---->' + JSON.stringify(req.params));
    Issue.findOne({
        id: parseInt(req.params.id)
    }, function (err, data) {
        console.log('Issue---->' + data);
        res.json(data);
    });
});
router.route('/issues/add').post((req, res) => {
    console.log('req---->' + JSON.stringify(req.body));
    let issue = new Issue(req.body);
    console.log('Issue---->' + issue);
    issue.save()
        .then(issue => {
            res.status(200).json({
                'issue': 'Added Successfully!!!!'
            });
        })
        .catch(err => {
            res.status(400).send('Failed')
        });

});
router.route('/issues/update/:id').post((req, res) => {
    Issue.findById(req.params.id, (err, issue) => {
        if (!issue)
            console.log('error')
        else
            issue.title = req.body.title;
        issue.responsible = req.body.responsible;
        issue.description = req.body.description;
        issue.save().then(issue => {
            res.json('Updated');

        }).catch(err => {
            res.status(500).send('Update Failed')
        })
    })
});
router.route('/issues/:id').get((req, res) => {
    Issue.findByIdAndRemove({
        _id: req.params.id
    }, (err, issue) => {
        if (err)
            console.log('error')
        else
            res.json('Removed Successfully!!!!!!')
    })
});
