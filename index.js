const express = require('express');
const fs = require('fs');
const formidable = require('formidable');
var cors = require('cors');
const moment = require('moment');
const app = express();

app.use(cors())

app.post('/api/parseFile', (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var filePath = files.file.path;
        var fileData = fs.readFileSync(filePath);
        const fileDataList = fileData.toString().trim().split('\n');
        if (fileDataList && fileDataList.length > 0) {
            // file should have the header at the first line
            const dataHeader = fileDataList[0];
            const headerArray = dataHeader.split(',');
            // get the first indexes of FirstName, Date, and City
            const firstNameIndex = (headerArray.indexOf('First Name') > -1 ? headerArray.indexOf('First Name') : (headerArray.indexOf('First name') > -1 ? headerArray.indexOf('First name') : -1));
            const dateIndex = (headerArray.indexOf('Date') > -1 ? headerArray.indexOf('Date') : (headerArray.indexOf('date') > -1 ? headerArray.indexOf('date') : -1));
            const cityIndex = (headerArray.indexOf('City') > -1 ? headerArray.indexOf('City') : (headerArray.indexOf('city') > -1 ? headerArray.indexOf('city') : -1));

            if (firstNameIndex == -1 && dateIndex == -1 && cityIndex == -1) {
                // failed as atleast one field should be present
                return res.json({ status: 200, fileDataList: [] });
            }

            const userDataList = [];
            for (var dataIndex = 1; dataIndex < fileDataList.length; dataIndex++) {
                // use the indexes we found for firstname, last name and city
                const userData = fileDataList[dataIndex].split(',');
                var date = userData[dateIndex];
                try {
                    // input Date can be of any 3 formats
                    date = moment(userData[dateIndex], ["DD-MM-YYYY","MM-DD-YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD");
                } catch(error) {
                    // incase the date format is not given in standard date format, return the default date given in the date object
                    date = userData[dateIndex];
                }
                userDataList.push({
                    firstName: userData[firstNameIndex],
                    city: userData[cityIndex],
                    date: date
                });
            }

            return res.json({ status: 200, fileDataList: userDataList });
        }
    })
});

app.listen(3001, function (err) {
    if (err) console.log(err);
    console.log('Server listening on Port 3001');
}); 
