const fs = require('fs');

module.exports = {
     addTripPage: (req, res) => {
         res.render('add-Trip.ejs', {
             title: "Welcome | Add a new Trip"
             ,message: ''
         });
     },
    addTrip: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let name = req.body.name;
        let location = req.body.location;
        let rating = req.body.rating;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = name + '.' + fileExtension;

        
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the Trip's details to the database
                        let query = "INSERT INTO `trips` (name, location, rating, image) VALUES ('" +
                            name + "', '" + location + "', '" + rating + "', '" + image_name + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-Trip.ejs', {
                        message,
                        title: "Welcome | Add a new Trip"
                    });
                }
        
    },
    editTripPage: (req, res) => {
        let TripId = req.params.id;
        let query = "SELECT * FROM `trips` WHERE id = '" + TripId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-Trip.ejs', {
                title: "Edit Trip"
                ,trip: result[0]
                ,message: ''
            });
        });
    },
    editTrip: (req, res) => {
        let TripId = req.params.id;
        let name = req.body.name;
        let location = req.body.location;
        let rating = req.body.rating;

        let query = "UPDATE `trips` SET `name` = '" + name + "', `location` = '" + location + "', `rating` = '" + rating + "', `id` = '" + TripId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deleteTrip: (req, res) => {
        let TripId = req.params.id;
        let getImageQuery = 'SELECT image from `trips` WHERE id = "' + TripId + '"';
        let deleteUserQuery = 'DELETE FROM trips WHERE id = "' + TripId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};

