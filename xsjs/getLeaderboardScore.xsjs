
var conn = $.db.getConnection();
var pstmt;
var rs;
var query;
var output = {
    results: [],
    userCount: 0
};
function getData(startDate) {
    var record;
    try {
        query = 'SELECT'
                    + ' t."userID", t."result",'
                    + ' j."jobName",'
                    + ' u."site", u."firstName", u."secondName"'
                + ' FROM'
                    + '"FITFORWORK"."tblTestResult" t,'
                    + '"FITFORWORK"."tblUser" u,'
                    + '"FITFORWORK"."tblJob" j'
                + ' WHERE'
                    + ' u."userID" = t."userID"'
                    + ' AND u."jobID"=j."jobID"'
                    + ' AND CONTAINS(t."result", \'%accuracyPercentage%\')'
                    + ' AND NOT CONTAINS(t."result", \'%accuracyPercentage":0%\')'
                    + ' AND NOT CONTAINS(t."result", \'%accuracyPercentage":null%\')';
        if (startDate) {
            query += ' AND TO_DATE(TO_VARCHAR(t."timestamp_end",\'DD/MM/yyyy\'), \'DD/MM/YYYY\') >= TO_DATE(?, \'DD/MM/YYYY\')';
        }
        query += ' ORDER BY "userID"';
        pstmt = conn.prepareStatement(query);
        if (startDate) {
            pstmt.setString(1, startDate);
        }
        rs = pstmt.executeQuery();
        while (rs.next()) {
            record = {};
            record.userID = rs.getString(1);
            record.result = rs.getString(2);
            record.jobName = rs.getString(3);
            record.site = rs.getString(4);
            record.firstName = rs.getString(5);
            record.secondName = rs.getString(6);
            output.results.push(record);
        }
        query = 'SELECT '
                + ' count("userID") AS "usersCount"'
                + ' FROM "FITFORWORK"."tblUser"';
        pstmt = conn.prepareStatement(query);
        rs = pstmt.executeQuery();
        while (rs.next()) {
            output.userCount = rs.getString(1);
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
var param1 = $.request.parameters.get('startDate');
getData(param1);
