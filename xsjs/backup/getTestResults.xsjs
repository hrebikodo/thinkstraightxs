
var conn = $.db.getConnection();
var pstmt;
var rs;
var query;
var output = {
    results: [] 
};
function getData(startDate, endDate, userID, assessmentID) {
    try {
        query = 'SELECT a."userID", TO_VARCHAR(a."timestamp_end", \'DD/MM/YYYY\') AS "date",  TO_VARCHAR(a."timestamp_end", \'HH24:MI:SS\') AS "time",'
                + ' a."result", b."name" AS "test"'
                + ' FROM "FITFORWORK"."tblTestResult" a, "tblTestType" b'
                + ' WHERE a."testTypeID"=b."testTypeID"'
                + ' AND (b."name" <> \'Motor Praxis\' AND b."name" <> \'Response time\')'
                + ' AND a."timestamp_end" IS NOT NULL'
                + ' AND NOT CONTAINS(a."result", \'%accuracyPercentage":0%\')';
                                                    
        if (startDate && endDate) {
            query += ' AND TO_DATE(TO_VARCHAR(a."timestamp_end",\'DD/MM/yyyy\'), \'DD/MM/YYYY\') >= TO_DATE(?, \'DD/MM/YYYY\')'
                    + ' AND TO_DATE(TO_VARCHAR(a."timestamp_end",\'DD/MM/yyyy\'), \'DD/MM/YYYY\') <= TO_DATE(?, \'DD/MM/YYYY\')';
        }
        if (userID) {
            query += ' AND a."userID"=?';
        }
        if (assessmentID) {
            query += ' AND a."testTypeID"=?';
        }
        query += ' ORDER BY "timestamp_end" DESC';
        pstmt = conn.prepareStatement(query);
        if (startDate && endDate) {
            pstmt.setString(1, startDate);
            pstmt.setString(2, endDate);
            if (userID) {
                pstmt.setString(3, userID);
                if (assessmentID) {
                    pstmt.setString(4, assessmentID);
                }
            } else {
                if (assessmentID) {
                    pstmt.setString(3, assessmentID);
                }
            }
        } else {
            if (userID) {
                pstmt.setString(1, userID);
                if (assessmentID) {
                    pstmt.setString(2, assessmentID);
                }
            } else {
                if (assessmentID) {
                    pstmt.setString(1, assessmentID);
                }
            }
        }
        rs = pstmt.executeQuery();
        while (rs.next()) {
            //// date, time, result, userID, test
            var record = {};
            record.userID = rs.getString(1);
            record.date = rs.getString(2);
            record.time = rs.getString(3);
            record.result = rs.getString(4);
            record.test = rs.getString(5);
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

var param1 = $.request.parameters.get('startDate');
var param2 = $.request.parameters.get('endDate');
var param3 = $.request.parameters.get('userID');
var param4 = $.request.parameters.get('assessmentID');
getData(param1, param2, param3, param4);
