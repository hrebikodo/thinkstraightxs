
var conn = $.db.getConnection();
var pstmt;
var rs;
var query;
var output = {results: [] };
function getData() {
    try {
        query = 'SELECT "userID"'
                + ' FROM "FITFORWORK"."tblUser"'
                + ' ORDER BY "userID";';
        pstmt = conn.prepareStatement(query);
        rs = pstmt.executeQuery();
        while (rs.next()) {
            //// date, time, result, userID, test
            var record = {};
            record.userID = rs.getString(1);
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

getData();
