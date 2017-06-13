
var conn = $.db.getConnection();
var pstmt;
var rs;
var query;
var output = {
    results: []
};
function getData(userID) {
    try {
        query = 'SELECT usr2."userID" AS "Supervisor", usr2."mobile"'
                + ' FROM "FITFORWORK"."tblUser" usr1,'
                + ' "FITFORWORK"."tblUser" usr2'
                + ' WHERE usr1."userID" = ? AND usr1."supervisorID" = usr2."userID"';
        pstmt = conn.prepareStatement(query);
        pstmt.setString(1, userID);
        rs = pstmt.executeQuery();
        while (rs.next()) {
            var record = {};
            record.userID = rs.getString(1);
            record.mobile = rs.getString(2);
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

getData(param1);
