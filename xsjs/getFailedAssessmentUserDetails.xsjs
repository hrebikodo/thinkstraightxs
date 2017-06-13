
var conn = $.db.getConnection();
var pstmt;
var rs;
var query;
var output = {
    allUsersData: [],
    results: []
};
function getData(userID, testResultTimestamp_end) {
    try {
        // Get data for the form
        query = 'SELECT usr."firstName", usr."secondName", ssn."timestamp_start" AS lastLogin,'
                    + ' (SELECT max("timestamp_end") FROM "tblTestResult") AS lastActivity,'
                    + ' (SELECT j."jobName" FROM "FITFORWORK"."tblUser" u, "FITFORWORK"."tblJob" j WHERE u."userID" = ? AND u."jobID"=j."jobID") AS jobName,'
                    + ' (SELECT "site" FROM "FITFORWORK"."tblUser" WHERE "userID" = ?) AS site'
                + ' FROM "FITFORWORK"."tblSession" AS ssn,'
                    + ' "FITFORWORK"."tblUser" AS usr'
                + ' WHERE usr."userID" = ?'
                    + ' AND ssn."userID" = usr."userID"'
                + ' ORDER BY ssn."timestamp_start" DESC LIMIT 1';
        pstmt = conn.prepareStatement(query);
        pstmt.setString(1, userID);
        pstmt.setString(2, userID);
        pstmt.setString(3, userID);
        rs = pstmt.executeQuery();
        while (rs.next()) {
            var record = {};
            record.firstName = rs.getString(1);
            record.secondName = rs.getString(2);
            record.lastActivity = rs.getString(4);
            record.jobName = rs.getString(5);
            record.site = rs.getString(6);
            output.results.push(record);
        }
        // Get data for graph:
        // All users for the last 7 days:
        query = 'SELECT  tst."userID", TO_VARCHAR(tst."timestamp_end", \'DD/MM/YYYY\') AS "date",'
                + ' tst."result" AS "Test result",'
                + ' ttp."name" AS "Test name"'
                + ' FROM    "FITFORWORK"."tblTestResult" tst,'
                        + ' "FITFORWORK"."tblTestType" ttp'
                + ' WHERE tst."testTypeID" = ttp."testTypeID"'
                + ' AND (ttp."name" <> \'Motor Praxis\' AND ttp."name" <> \'Response time\')'
                + ' AND tst."timestamp_end" IS NOT NULL'
                + ' AND NOT CONTAINS(tst."result", \'%accuracyPercentage":0%\')'
                + ' AND NOT CONTAINS(tst."result", \'%accuracyPercentage":null%\')'
                + ' AND TO_DATE(tst."timestamp_start") >= ADD_DAYS(TO_DATE(now()), -6)'// Last 7 days only
                + ' AND tst."result" IS NOT NULL';
        pstmt = conn.prepareStatement(query);
        rs = pstmt.executeQuery();
        while (rs.next()) {
            record = {};
            record.userID = rs.getString(1);
            record.date = rs.getString(2);
            record.result = rs.getString(3);
            record.testName = rs.getString(4);
            output.allUsersData.push(record);
        }
        rs.close();
        pstmt.close();
        conn.close();
    } 
    catch (e) {
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.setBody(e.message);
        return;
    }
    var body = JSON.stringify(output);
    $.response.contentType = 'application/json';
    $.response.setBody(body);
    $.response.status = $.net.http.OK;
}

var param1 = $.request.parameters.get('userID');
var param2 = $.request.parameters.get('testResultTimestamp_end');

getData(param1, param2);
