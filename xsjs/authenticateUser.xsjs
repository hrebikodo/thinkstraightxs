
var conn = $.db.getConnection();
var pstmt;
var rs;
var query;
var output = {results: [] };
function getData(userID, password) {
    try {
        query = 'SELECT "firstName", "secondName", "jobID", "testResultTypeID", "userRoleID", "userID"'
                + ' FROM "FITFORWORK"."tblUser"'
                + ' WHERE LOWER("userID")=LOWER(?)'
                + ' AND "password"=?';
        pstmt = conn.prepareStatement(query);
        pstmt.setString(1, userID);
        pstmt.setString(2, password);
        rs = pstmt.executeQuery();
        while (rs.next()) {
            var record = {};
            record.firstName = rs.getString(1);
            record.secondName = rs.getString(2);
            record.jobID = rs.getString(3);
            record.testResultTypeID = rs.getString(4);
            record.userRoleID = rs.getString(5);
            record.userID = rs.getString(6);
            output.results.push(record);
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
var param2 = $.request.parameters.get('password');

getData(param1, param2);
