
var conn = $.db.getConnection();
var pstmt;
var rs;
var query;
var output = {results: [] };
function getData() {
    try {
        query = 'SELECT "testTypeID", "name" '
                + ' FROM "FITFORWORK"."tblTestType" '
                + ' ORDER BY "name"';
        pstmt = conn.prepareStatement(query);
        rs = pstmt.executeQuery();
        while (rs.next()) {
            var record = {};
            record.assessmentID = rs.getString(1);
            record.assessmentName = rs.getString(2);
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
