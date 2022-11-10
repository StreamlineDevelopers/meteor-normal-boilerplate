import { Picker } from "meteor/meteorhacks:picker";
import bodyParser from "body-parser";
import multer from "multer";
import cors from "cors";

Picker.middleware(multer().any());
Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));
Picker.middleware(cors());

Meteor.startup(() => {
    Picker.route('/sample', (params, req, res, next) => {
        Util.showNotice('sample - params: %s, body: %s', params.query, req.body);

        try {
            res.writeHead(200, { 'Content-Type': 'text/xml' });
            res.end("sample");
        } catch (error) {
            res.end();
        }
    });
});