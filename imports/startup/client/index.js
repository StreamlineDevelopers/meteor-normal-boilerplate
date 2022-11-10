import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import routes from './routes';

Meteor.settings.public.collections = {};

db = {};

Meteor.startup(() => {
    db = {
        '#tasks': new Mongo.Collection('#tasks', { idGeneration: 'MONGO' }),
    };

    for (let key in db) {
        db[key].deny({
            update() {
                return true;
            },
        });
    }

    render(routes, document.getElementById('react-target'));

    if (Object.keys(Meteor.settings.public).length > 1) {
        //check if settings.json was loaded
        console.log("settings:", Meteor.settings.public.title);
    }
});