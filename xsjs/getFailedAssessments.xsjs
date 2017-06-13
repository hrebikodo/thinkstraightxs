
var conn = $.db.getConnection();
var pstmt;
var rs;
var query;
var output = {results: [] };
function getData() {
    try {
        query = 'SELECT  trs."userID", usr."firstName", usr."secondName",'
                    + ' trs."timestamp_end",'
                    + ' ttp."name"'
                + ' FROM "FITFORWORK"."tblTestResult" trs,'
                    + ' "FITFORWORK"."tblUser" usr,'
                    + ' "FITFORWORK"."tblTestType" ttp'
                + ' WHERE "timestamp_end" IS NOT NULL'
                    + ' AND trs."userID" = usr."userID"'
                    + ' AND ttp."testTypeID" = trs."testTypeID"'
                    + ' AND trs."testResultOutputID" = 2'
                + ' ORDER BY "timestamp_end" DESC';
        pstmt = conn.prepareStatement(query);
        rs = pstmt.executeQuery();
        while (rs.next()) {
            var record = {};
            record.userID = rs.getString(1);
            record.firstName = rs.getString(2);
            record.secondName = rs.getString(3);
            record.timestamp = rs.getString(4);
            record.testName = rs.getString(5);
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
